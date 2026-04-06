"use client";
import Card from "@/components/cards/card";
import { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import debounce from "lodash.debounce";
import { useBusinessStore } from "@/zustand/APIs/public/businessStore";
import CardSkeleton from "@/components/skeletons/cardSkeleton";


// wogofaj349@fftube.com

export default function Main() {

    const t = useTranslations();
    const { businessStore, loading, fetchBusiness } = useBusinessStore();

    const [search, setSearch] = useState<string>("");

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [locationResolved, setLocationResolved] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationResolved(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setLocationResolved(true);
            },
            () => {
                setLocationResolved(true);
            }
        );
    }, []);

    const debouncedFetchBusiness = useMemo(() => {
        return debounce(
            (query: string, lat?: number, lng?: number) => {
                fetchBusiness({
                    searchKey: query,
                    ...(lat !== undefined &&
                        lng !== undefined && {
                        latitude: lat,
                        longitude: lng,
                    }),
                });
            },
            500
        );
    }, [fetchBusiness]);

    useEffect(() => {
        if (!locationResolved) return;

        const hasLocation = latitude !== null && longitude !== null;

        if (search === "") {
            fetchBusiness({
                searchKey: "",
                ...(hasLocation && {
                    latitude: latitude!,
                    longitude: longitude!,
                }),
            });
            return;
        }

        debouncedFetchBusiness(
            search,
            hasLocation ? latitude! : undefined,
            hasLocation ? longitude! : undefined
        );

        return () => {
            debouncedFetchBusiness.cancel();
        };
    }, [search, latitude, longitude, locationResolved, debouncedFetchBusiness]);

    const countedBusinesses = businessStore.length;


    return (
        <>

            <div className="w-full flex justify-center mt-[20px]">
                <div className="w-full max-w-7xl  px-4 md:px-[100px] flex flex-col md:flex-row md:justify-between gap-3">

                    <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto justify-center md:justify-start">

                        <div className="flex-1 min-w-[180px] h-[42px] flex items-center bg-[#0f0f0f] px-4 border border-[#2b2b2b] rounded-xl focus-within:border-[#F94B00] transition">
                            <Search className="w-5 h-5 text-white mr-3" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t("pages.search_placeholder")}
                                className="bg-transparent outline-none text-white placeholder-[#a7a7a7] w-full"
                            />
                        </div>

                        <div className="md:hidden w-[44px] h-[42px] bg-[#F94B00] rounded-xl flex justify-center items-center">
                            <img src="/images/filter.svg" alt="filter" className="w-[20px] h-[20px]" />
                        </div>

                        <div className="hidden md:flex gap-2 text-[#a7a7a7]">
                            <select className="border border-[#2b2b2b] bg-[#0f0f0f] p-[10px] rounded-xl">
                                <option value="">{t("pages.city")}</option>
                                <option value="tbilisi">თბილისი</option>
                                <option value="qutaisi">ქუთაისი</option>
                                <option value="batumi">ბათუმი</option>
                                <option value="ozurgeti">ოზურგეთი</option>
                            </select>
                            <select className="border border-[#2b2b2b] bg-[#0f0f0f] p-[10px] rounded-xl">
                                <option value="">შენთან ახლოს</option>
                                <option value="#">შორს</option>
                                <option value="#1">შორიახლოს</option>
                                <option value="#2">ძაან იქით</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex md:justify-center w-full md:w-[109px] gap-[8px] items-center mt-2 md:mt-0">
                        <div className="w-[8px] h-[8px] bg-[#F94B00] rounded-full" />
                        <h3 className="text-[16px] text-white font-bold">{t("pages.result")}</h3>
                        <h3 className="text-[16px] text-[#a7a7a7] font-bold">({countedBusinesses})</h3>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-6 mb-6 max-w-7xl mx-auto">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))
                ) : businessStore?.length > 0 ? (
                    businessStore.map((item: any) => {
                        const imageSource = item?.file?.url || "/images/start.svg";

                        return (
                            <Card
                                key={item.id}
                                businessId={item.id}
                                isFavorite={item.isFavorite}
                                title={item.name}
                                image={imageSource}
                                address={item.addressName}
                                businessCategory={item.businessCategory.name}
                                distance={item.distnace?.toFixed(2)}
                            />
                        );
                    })
                ) : (
                    <></>
                )}

            </div>

        </>
    )
}

