"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import CardSkeleton from "@/components/skeletons/cardSkeleton";
import Card from "@/components/cards/card";
import { useRegionsStore } from "@/zustand/APIs/public/regionsStore";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useBusinessCategoriesStore } from "@/zustand/APIs/public/businessCatecoryStore";
import { useLocationStore } from "@/zustand/User/locationStore";
import Filter from "@/components/filter";

export default function Favorite() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const t = useTranslations();
    const { regionsStore, fetchRegionsInfo } = useRegionsStore();
    const { categories, fetchCategories } = useBusinessCategoriesStore();

    const { latitude, longitude, locationEnabled, getLocation } = useLocationStore();

    const [favorites, setFavorites] = useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRegionId, setSelectedRegionId] = useState<number>(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const statusOptions = [
        { value: "all", label: t("components.all") },
        { value: "open", label: t("components.profile_open_now") },
        { value: "closed", label: t("components.is_closed") },
    ];
    const [openStatus, setOpenStatus] = useState<"all" | "open" | "closed">("all");
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

    function getLocalDateTimeWithOffset() {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");

        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1);
        const day = pad(now.getDate());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        const offset = -now.getTimezoneOffset();
        const sign = offset >= 0 ? "+" : "-";
        const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
        const offsetMinutes = pad(Math.abs(offset) % 60);

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
    }

    useEffect(() => {
        fetchRegionsInfo();
        fetchCategories();
        if (locationEnabled) getLocation();
    }, []);

    const getIsOpenValue = () => {
        if (openStatus === "open") return true;
        if (openStatus === "closed") return false;
        return undefined;
    };

    const isOpen = getIsOpenValue();

    const buildParams = () => {
        const params: Record<string, any> = {};

        if (search.trim() !== "") {
            params.SearchKey = search;
        }

        if (latitude && longitude) {
            params.Latitude = latitude;
            params.Longtitude = longitude;
        }

        if (selectedRegionId !== 0) {
            params.RegionId = selectedRegionId;
        }

        if (selectedCategoryId !== 0) {
            params.BusinessCategoryId = selectedCategoryId;
        }

        if (typeof isOpen === "boolean") {
            params.IsOpen = isOpen;
        }

        params.LocalTime = getLocalDateTimeWithOffset();

        return params;
    };

    const debouncedFetchFavorites = useMemo(() => {
        return debounce(async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) return;

            setLoading(true);

            try {
                const response = await axios.get(
                    `${apiUrl}/api/v1/favorites`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        params: buildParams(),
                    }
                );

                setFavorites(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }, 500);
    }, [
        search,
        selectedRegionId,
        selectedCategoryId,
        latitude,
        longitude,
        openStatus
    ]);

    useEffect(() => {
        debouncedFetchFavorites();
        return () => debouncedFetchFavorites.cancel();
    }, [debouncedFetchFavorites]);

    const countedBusinesses = favorites.length;

    return (
        <>
            <Header />
            <div className="w-full flex justify-center mt-[20px]">
                <div className="w-full max-w-7xl px-4 md:px-[100px] flex flex-col gap-5">

                    <h2 className="text-[#a7a7a7]">
                        <Link href="/">
                            <span className="cursor-pointer">
                                {t("pages.main_page_title")}
                            </span>
                        </Link>
                        <span className="mx-2">&gt;</span>
                        <span className="text-white font-bold">
                            {t("pages.favorite_page")}
                        </span>
                    </h2>

                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        <div onClick={() => setSelectedCategoryId(0)} className="cursor-pointer py-2 flex flex-col items-center flex-shrink-0" >
                            <img src={categoryImages[0]} alt="all" className="w-8 h-8 mb-1" />
                            <h2 className={`text-sm mt-[10px] whitespace-nowrap ${selectedCategoryId === 0 ? "text-[#F94B00] font-bold" : "text-white"}`} >
                                {t("components.all")}
                            </h2>
                        </div>

                        {categories?.map((item) => (
                            <div key={item.id} onClick={() => setSelectedCategoryId(item.id)} className="cursor-pointer py-2 flex flex-col items-center flex-shrink-0"    >
                                <img src={categoryImages[item.id]} alt={item.name} className="w-8 h-8 mb-1" />
                                <h2 className={`text-sm mt-[10px] whitespace-nowrap ${selectedCategoryId === item.id ? "text-[#F94B00] font-bold" : "text-white"}`}  >
                                    {item.name}
                                </h2>
                            </div>
                        ))}
                    </div>


                    <div className="flex flex-col md:flex-row md:justify-between gap-3">
                        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto justify-center md:justify-start">
                            <div className="flex flex-col gap-1">
                                <span className="text-[12px] text-[#a7a7a7]">{t("pages.search_field")}</span>
                                <div className="flex-1 min-w-[180px] h-[42px] flex items-center bg-[#0f0f0f] px-4 border border-[#2b2b2b] rounded-xl focus-within:border-[#F94B00] transition mt-[12px]">
                                    <Search className="w-5 h-5 text-white mr-3" />
                                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("pages.search_placeholder")} className="bg-transparent outline-none text-white placeholder-[#a7a7a7] w-full h-[42px] text-[14px]" />
                                </div>
                            </div>

                            <div className="md:hidden w-[44px] h-[42px] bg-[#F94B00] rounded-xl flex justify-center items-center" onClick={() => setOpenFilter(true)}>
                                <img src="/images/filter.svg" alt="filter" className="w-[20px] h-[20px]" />
                            </div>

                            <div className="hidden md:flex gap-2 text-[#a7a7a7]">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[12px] text-[#a7a7a7]">{t("pages.city")}</span>
                                    <div className="relative mt-[12px]">
                                        <select value={selectedRegionId} onChange={(e) => setSelectedRegionId(Number(e.target.value))} className={`h-[42px] border py-[10px] px-[12px] pr-[40px] rounded-xl appearance-none w-full text-white bg-[#0f0f0f] text-[14px] outline-none focus:border-[#F94B00] ${selectedRegionId !== 0 ? "border-[#F94B00]" : "border-[#2b2b2b]"}`}>
                                            <option value={0}>{t("pages.city")}</option>
                                            {regionsStore.map((item: any) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[12px] text-white">
                                            <img src="/images/arrow_down.svg" alt="arrow_down" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-[12px] text-[#a7a7a7]">{t("components.status")}</span>
                                    <div className="flex gap-3 mt-[12px]">
                                        {statusOptions.map(({ value, label }) => (
                                            <label key={value} className={`flex items-center gap-[10px] h-[42px] px-4 rounded-xl border cursor-pointer transition-all select-none ${openStatus === value ? "border-[#F94B00] bg-[#1a0d00]" : "border-[#2b2b2b] bg-[#0f0f0f]"}`}>
                                                <input type="radio" name="openStatus" value={value} checked={openStatus === value} onChange={() => setOpenStatus(value as any)} className="appearance-none w-[20px] h-[20px] rounded-full border-2 border-[#555] checked:border-[#F94B00] relative cursor-pointer flex-shrink-0 after:content-[''] after:absolute after:w-[10px] after:h-[10px] after:rounded-full after:bg-[#F94B00] after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100" />
                                                <span className={`text-[14px] whitespace-nowrap ${openStatus === value ? "text-white font-bold" : "text-[#a7a7a7]"}`}>{label}</span>
                                            </label>
                                        ))}
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
                                ({countedBusinesses})
                            </h3>
                        </div>
                    </div>

                </div >
            </div >


            <div className="flex flex-wrap gap-6 mt-6 mb-6 w-full max-w-7xl px-4 md:px-[100px] mx-auto">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))
                ) : favorites.length === 0 ? (
                    <div className="w-full">
                        <div className="text-center py-10 text-gray-500">
                            {t("pages.no_business_found")}
                        </div>
                    </div>
                ) : (
                    favorites.map((item: any) => (
                        <div key={item.id} className="w-[calc(50%-12px)] md:w-[252px] flex-shrink-0" >
                            <Link href={`/page/business/${item.id}`} className="cursor-pointer" prefetch={false} >
                                <Card
                                    businessId={item.id}
                                    isFavorite={true}
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
                <div className="fixed inset-0 z-50 md:hidden" onClick={() => setOpenFilter(false)}>
                    <div className="absolute inset-0 bg-black/50" />
                    <Filter
                        regions={regionsStore}
                        selectedRegionId={selectedRegionId}
                        selectedCategoryId={selectedCategoryId}
                        openStatus={openStatus}
                        onChangeRegion={setSelectedRegionId}
                        onChangeCategory={setSelectedCategoryId}
                        onChangeOpenStatus={setOpenStatus}
                        onApply={() => setOpenFilter(false)}
                        onClose={() => setOpenFilter(false)}
                    />
                </div>
            )}
            <Footer />
        </>
    );
}