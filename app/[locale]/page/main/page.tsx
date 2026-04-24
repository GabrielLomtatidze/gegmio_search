"use client";
import { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import debounce from "lodash.debounce";
import { useBusinessStore } from "@/zustand/APIs/public/businessStore";
import { useRegionsStore } from "@/zustand/APIs/public/regionsStore";
import Card from "@/components/cards/card";
import CardSkeleton from "@/components/skeletons/cardSkeleton";
import Link from "next/link";
import Filter from "@/components/filter";
import { useBusinessCategoriesStore } from "@/zustand/APIs/public/businessCatecoryStore";
import { useLocationStore } from "@/zustand/User/locationStore";

export default function Main() {
  const t = useTranslations();
  const { businessStore, loading, fetchBusiness } = useBusinessStore();
  const { regionsStore, fetchRegionsInfo } = useRegionsStore();
  const { categories, fetchCategories } = useBusinessCategoriesStore();


  const { latitude, longitude, locationEnabled, getLocation } = useLocationStore();

  const [search, setSearch] = useState<string>("");
  const [selectedRegionId, setSelectedRegionId] = useState<number>(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const categoryImages: Record<number, string> = {
    0: "/images/business_category/home.svg",
    1: "/images/business_category/restaurant.svg",
    2: "/images/business_category/salon.svg",
    3: "/images/business_category/medic.svg",
    4: "/images/business_category/cut.svg",
    5: "/images/business_category/team.svg",
    6: "/images/business_category/wash.svg",
    7: "/images/business_category/engine.svg",
    8: "/images/business_category/cafe.svg",
    9: "/images/business_category/health.svg",
  };

  const hasLocation =
    locationEnabled && latitude !== null && longitude !== null;

  const buildParams = (
    query: string,
    lat?: number,
    lng?: number,
    regionId?: number,
    categoryId?: number
  ) => {
    const params: Record<string, any> = {};

    if (query) params.searchKey = query;

    if (lat !== undefined && lng !== undefined) {
      params.latitude = lat;
      params.longitude = lng;
    }

    if (regionId && regionId !== 0) {
      params.regionId = regionId;
    }

    if (categoryId && categoryId !== 0) {
      params.businessCategoryId = categoryId;
    }

    return params;
  };

  useEffect(() => {
    if (locationEnabled) {
      getLocation();
    }
  }, [locationEnabled]);

  useEffect(() => {
    fetchRegionsInfo();
    fetchCategories();
  }, []);

  const debouncedFetchBusiness = useMemo(() => {
    return debounce(
      (
        query: string,
        lat?: number,
        lng?: number,
        regionId?: number,
        categoryId?: number
      ) => {
        fetchBusiness(buildParams(query, lat, lng, regionId, categoryId));
      },
      500
    );
  }, [fetchBusiness]);

  useEffect(() => {
    const lat = hasLocation ? latitude! : undefined;
    const lng = hasLocation ? longitude! : undefined;
    const regionId =
      selectedRegionId !== 0 ? selectedRegionId : undefined;
    const categoryId =
      selectedCategoryId !== 0 ? selectedCategoryId : undefined;

    if (search === "") {
      fetchBusiness(buildParams("", lat, lng, regionId, categoryId));
      return;
    }

    debouncedFetchBusiness(search, lat, lng, regionId, categoryId);

    return () => debouncedFetchBusiness.cancel();
  }, [
    search,
    latitude,
    longitude,
    locationEnabled,
    selectedRegionId,
    selectedCategoryId,
    debouncedFetchBusiness,
    fetchBusiness,
  ]);

  return (
    <>
      <div className="w-full flex justify-center mt-5">
        <div className="w-full max-w-7xl px-4 md:px-[100px] flex flex-col gap-5">

          <div className="flex gap-6 border-[#2b2b2b] overflow-x-auto no-scrollbar">
            <div onClick={() => setSelectedCategoryId(0)} className="cursor-pointer py-2 flex flex-col items-center"    >
              <img src={categoryImages[0]} alt="all" className="w-8 h-8 mb-1" />
              <h2 className={`text-sm mt-[10px] ${selectedCategoryId === 0 ? "text-[#F94B00] font-bold" : "text-white"}`}>
                {t("components.all")}
              </h2>
            </div>

            {categories?.map((item) => (
              <div key={item.id} onClick={() => setSelectedCategoryId(item.id)} className="cursor-pointer py-2 flex flex-col items-center"  >
                <img src={categoryImages[item.id]} alt={item.name} className="w-8 h-8 mb-1" />
                <h2 className={`text-sm mt-[10px] ${selectedCategoryId === item.id ? "text-[#F94B00] font-bold" : "text-white"}`}>
                  {item.name}
                </h2>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:justify-between gap-3">
            <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto justify-center md:justify-start">
              <div className="flex-1 min-w-[180px] h-[42px] flex items-center bg-[#0f0f0f] px-4 border border-[#2b2b2b] rounded-xl focus-within:border-[#F94B00] transition">
                <Search className="w-5 h-5 text-white mr-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("pages.search_placeholder")}
                  className="bg-transparent outline-none text-white placeholder-[#a7a7a7] w-full h-[42px] text-[14px]"
                />
              </div>

              <div className="md:hidden w-[44px] h-[42px] bg-[#F94B00] rounded-xl flex justify-center items-center" onClick={() => setOpenFilter(true)}>
                <img src="/images/filter.svg" alt="filter" className="w-[20px] h-[20px]" />
              </div>

              <div className="hidden md:flex gap-2 text-[#a7a7a7]">
                <div className="relative">
                  <select value={selectedRegionId} onChange={(e) => setSelectedRegionId(Number(e.target.value))} className={`border py-[10px] px-[12px] pr-[40px] rounded-xl appearance-none w-full text-white bg-[#0f0f0f] text-[14px] outline-none focus:border-[#F94B00] ${selectedRegionId !== 0 ? "border-[#F94B00]" : "border-[#2b2b2b]"}`} >
                    <option value={0}>{t("pages.city")}</option>
                    {regionsStore.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[12px] text-white">
                    <img src="/images/arrow_down.svg" alt="arrow_down" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex md:justify-center w-full md:w-[109px] gap-[8px] items-center mt-2 md:mt-0">
              <div className="w-[8px] h-[8px] bg-[#F94B00] rounded-full" />
              <h3 className="text-[16px] text-white font-bold">
                {t("pages.result")}
              </h3>
              <h3 className="text-[16px] text-[#a7a7a7] font-bold">
                ({businessStore.length})
              </h3>
            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-wrap gap-6 mt-6 mb-6 w-full max-w-7xl px-4 md:px-[100px] mx-auto">

        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
        ) : businessStore.length === 0 ? (
          <div className="w-full">
            <div className="text-center py-10 text-gray-500">
              {t("pages.no_business_found")}
            </div>
          </div>

        ) : (
          businessStore.map((item: any) => (
            <div
              key={item.id}
              className="w-[calc(50%-12px)] md:w-[252px] flex-shrink-0"
            >
              <Link
                key={item.id}
                href={`/page/business/${item.id}`}
                className="cursor-pointer"
                prefetch={false}
              >
                <Card
                  businessId={item.id}
                  isFavorite={item.isFavorite}
                  isOpen={item.isOpen}
                  title={item.name}
                  image={item.file?.url || "/images/start.svg"}
                  address={item.addressName}
                  businessCategory={item.businessCategory.name}
                  distance={item.distnace?.toFixed(2)}
                />
              </Link>
            </div>
          ))
        )}
      </div>

      {openFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenFilter(false)} />
          <Filter
            regions={regionsStore}
            onApply={() => { setOpenFilter(false) }}
            onClose={() => setOpenFilter(false)}
          />
        </div>
      )}
    </>
  );
}