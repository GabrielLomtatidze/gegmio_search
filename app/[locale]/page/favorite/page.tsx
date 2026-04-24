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


export default function Favorite() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const t = useTranslations();
    const { regionsStore, fetchRegionsInfo } = useRegionsStore();

    const [favorites, setFavorites] = useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRegionId, setSelectedRegionId] = useState<number>(0);
    const [openFilter, setOpenFilter] = useState<boolean>(false);

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [locationResolved, setLocationResolved] = useState<boolean>(false);

    const hasLocation = latitude !== null && longitude !== null;

    function getLocalDateTimeWithOffset() {
        const now = new Date();

        const pad = (n: number) => String(n).padStart(2, "0");

        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1);
        const day = pad(now.getDate());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        const offset = -now.getTimezoneOffset(); // minutes
        const sign = offset >= 0 ? "+" : "-";
        const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
        const offsetMinutes = pad(Math.abs(offset) % 60);

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
    }

    useEffect(() => {
        fetchRegionsInfo();
    }, [fetchRegionsInfo]);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationResolved(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setLatitude(coords.latitude);
                setLongitude(coords.longitude);
                setLocationResolved(true);
            },
            () => setLocationResolved(true)
        );
    }, []);

    const buildParams = (query: string, lat?: number, lng?: number, regionId?: number) => {
        const params: Record<string, any> = {};

        if (query.trim() !== "") {
            params.SearchKey = query;
        }

        if (lat !== undefined && lng !== undefined) {
            params.Latitude = lat;
            params.Longtitude = lng;
        }

        if (regionId && regionId !== 0) {
            params.RegionId = regionId;
        }

        params.LocalTime = getLocalDateTimeWithOffset();

        return params;
    };

    const debouncedFetchFavorites = useMemo(() => {
        return debounce(
            async (query: string, lat?: number, lng?: number, regionId?: number) => {
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
                            params: buildParams(query, lat, lng, regionId),
                        }
                    );

                    setFavorites(response.data);
                } catch (error) {
                    console.log("error loading favorites", error);
                } finally {
                    setLoading(false);
                }
            },
            500
        );
    }, []);

    useEffect(() => {
        if (!locationResolved) return;

        const lat = hasLocation ? latitude! : undefined;
        const lng = hasLocation ? longitude! : undefined;
        const regionId =
            selectedRegionId !== 0 ? selectedRegionId : undefined;

        if (search === "") {
            debouncedFetchFavorites("", lat, lng, regionId);
            return;
        }

        debouncedFetchFavorites(search, lat, lng, regionId);

        return () => debouncedFetchFavorites.cancel();
    }, [search, selectedRegionId, latitude, longitude, locationResolved, debouncedFetchFavorites,]);

    const countedBusinesses = favorites.length;


    return (
        <>
            <Header />
            <div className="w-full justify-center mt-[20px]">
                <div className="w-full flex justify-center mt-[20px]">
                    <div className="w-full max-w-7xl px-4 md:px-[100px] flex flex-col md:flex-row md:justify-between gap-3">
                        <h2 className="text-[#a7a7a7]">
                            {t("pages.main_page_title")}
                            <span className="mx-2">&gt;</span>
                            <span className="text-white font-bold">
                                {t("pages.favorite_page")}
                            </span>
                        </h2>
                    </div>
                </div>

                <div className="w-full flex justify-center mt-[20px]">
                    <div className="w-full max-w-7xl px-4 md:px-[100px] flex flex-col md:flex-row md:justify-between gap-3">
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
                                ({countedBusinesses})
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-start items-start gap-6 mt-6 mb-6 max-w-7xl mx-auto px-4 md:px-[100px]">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))
                    ) : favorites.length > 0 ? (
                        favorites.map((item: any) => (
                            <Card
                                key={item.id}
                                businessId={item.id}
                                isFavorite={true}
                                isOpen={item.isOpen}
                                title={item.name}
                                image={item.file?.url || "/images/start.svg"}
                                address={item.addressName}
                                businessCategory={item.businessCategory.name}
                                distance={item.distnace?.toFixed(2)}
                            />
                        ))
                    ) : (
                        <></>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}