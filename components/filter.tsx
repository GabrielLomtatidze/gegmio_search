"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDistrictStore } from "@/zustand/APIs/public/districtStore";
import { motion } from "framer-motion";

type Item = {
    id: number;
    name: string;
    regionId?: number;
};

type FilterValues = {
    region: Item | null;
    districts: Item[];
    business: Item | null;
    sortBy: string;
};

type Props = {
    regions: Item[];
    onApply?: (data: FilterValues) => void;
    onClose?: () => void;
};

type Status = {
    id: number,
    title: string
}

type Sorting = {
    id: number,
    title: string
}

export default function Filter({ regions, onApply, onClose }: Props) {

    const t = useTranslations();

    const districts = useDistrictStore((state) => state.districts);
    const fetchDistricts = useDistrictStore((state) => state.fetchDistricts);

    const [searchCity, setSearchCity] = useState<string>();
    const [searchdistricts, setSearchDistricts] = useState<string>()
    const [filterRouter, setFilterRouter] = useState("");
    const [selectedRegion, setSelectedRegion] = useState<Item | null>(null);
    const [selectedDistricts, setSelectedDistricts] = useState<Item[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<Item | null>(null);
    const [sortBy, setSortBy] = useState("distance");
    const [selectedStatus, setSelectedStatus] = useState<number>(0);
    const [selectedSorting, setSelectedSorting] = useState<number>(0);

    const statis: Status[] = [
        {
            id: 0,
            title: t("components.all")
        },
        {
            id: 1,
            title: t("components.profile_open_now")
        },
        {
            id: 2,
            title: t("components.closed")
        }
    ]

    const sorting: Sorting[] = [
        {
            id: 0,
            title: t("components.nearby")
        },
        {
            id: 1,
            title: t("components.latest")
        }
    ]


    useEffect(() => {
        fetchDistricts(selectedRegion?.id ?? null);
    }, [selectedRegion, fetchDistricts]);


    const apply = () => {
        onApply?.({
            region: selectedRegion,
            districts: selectedDistricts,
            business: selectedBusiness,
            sortBy,
        });
    };

    const filteredRegions = regions.filter((r) =>
        r.name.toLowerCase().includes((searchCity ?? "").toLowerCase())
    );

    const filteredDistricts = districts.filter((r) =>
        r.name.toLowerCase().includes((searchdistricts ?? "").toLowerCase())
    );

    const clear = () => {
        setSelectedRegion(null);
        setSearchCity("");
        setSelectedDistricts([])
        setSelectedStatus(0);
        setSelectedSorting(0);
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-50">

            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 300 }}
                onDragEnd={(e, info) => {
                    if (info.offset.y > 120) {
                        onClose?.();
                    }
                }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#0f0f0f] rounded-t-2xl p-4 overflow-y-auto text-white"
            >

                <div className="w-full flex justify-center mb-4">
                    <h2 className="text-white font-bold"> {filterRouter === "city" ? t("components.city") : t("components.filter")}</h2>
                </div>

                {filterRouter === "city" && (
                    <>
                        <div className="w-full h-[42px] flex gap-[8px] justify-between items-center">
                            <button onClick={() => setFilterRouter("")} className="w-[42px] h-[42px] bg-[#171717] flex justify-center items-center rounded-full">
                                <img src="/images/arrow_left.svg" alt="arrow_left" />
                            </button>
                            <div className="flex-1 min-w-[100px] h-[42px] flex items-center bg-[#0f0f0f] px-4 border border-[#2b2b2b] rounded-xl focus-within:border-[#F94B00] transition">
                                <Search className="w-5 h-5 text-white mr-3" />
                                <input
                                    type="text"
                                    value={searchCity || ""}
                                    onChange={(e) => setSearchCity(e.target.value)}
                                    className="bg-transparent outline-none text-white placeholder-[#a7a7a7] w-full text-[14px]"
                                />
                            </div>

                            <h3 className="text-[14px] font-bold" onClick={() => { setSelectedRegion(null); setSearchCity(""); }}>{t("components.cancel")}</h3>
                        </div>

                        <div className="mt-2 max-h-[400px] overflow-y-auto">
                            {filteredRegions.map((item) => (
                                <div key={item.id} onClick={() => { setSelectedRegion(item); setSelectedDistricts([]); setFilterRouter(""); }} className="h-[64px] p-4 border-b border-[#2b2b2b] flex justify-between" >
                                    <span className={`text-[${selectedRegion?.id === item.id ? "#F94B00" : "white"}]`}>{item.name}</span>
                                    {selectedRegion?.id === item.id && (
                                        <img src="/images/fill_mark.svg" alt="mark" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {filterRouter === "" && (
                    <>

                        <div className="space-y-4">
                            <div onClick={() => setFilterRouter("city")} className="h-[64px] flex justify-between items-center text-[14px] text-[#a7a7a7] border-b border-[#2b2b2b]" >
                                <span className="text-[#a7a7a7] text-[14px]">{t("components.city")}</span>
                                <div className="flex items-center justofy-cetner">
                                    <span className="text-white">{selectedRegion?.name}</span>
                                    <img src="/images/arrow_right.svg" alt="arrow_right" />
                                </div>
                            </div>


                            <div className="flex flex-col justify-between border-b border-[#2b2b2b] pb-2 " >
                                <span className="text-[#a7a7a7] text-[14px]">{t("components.status")}</span>
                                <div className="w-full h-[42px] flex gap-[8px] mt-[12px]">
                                    {statis.map((item: any) => {

                                        const isSelected = item.id === selectedStatus;

                                        return (
                                            <div key={item.id} className={`w-full h-full rounded-[12px] border border-[${isSelected ? "#F94B00" : "#2b2b2b"}] bg-[${isSelected ? "#22140E" : "transparant"}] flex justify-center items-center`} onClick={() => setSelectedStatus(item.id)}>
                                                <h3 className={`text-[${isSelected ? "white" : "#a7a7a7"}] text-[14px]`}>{item.title}</h3>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="flex flex-col justify-between border-b border-[#2b2b2b] pb-2 " >
                                <span className="text-[#a7a7a7] text-[14px]">{t("components.sort")}</span>
                                <div className="w-full h-[140px] flex flex-col gap-[8px] mt-[12px]">
                                    {sorting.map((item: any) => {

                                        const isSelected = item.id === selectedSorting;

                                        return (
                                            <div key={item.id} className={`w-full h-full rounded-[12px] border border-[${isSelected ? "#F94B00" : "#2b2b2b"}] bg-[${isSelected ? "#22140E" : "transparant"}] flex justify-center items-center`} onClick={() => setSelectedSorting(item.id)}>
                                                <h3 className={`text-[${isSelected ? "white" : "#a7a7a7"}] text-[14px]`}>{item.title}</h3>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>


                        <div className="w-full absolute bottom-[5px] left-0 px-4">
                            <button onClick={apply} className="w-full bg-[#F94B00] p-3 rounded-xl font-bold"       >
                                {t("components.apply_filter")}
                            </button>

                            <div className="w-full h-[48px] mt-[12px] flex justify-center items-center">
                                <div className="w-[50%] flex justify-center items-center" onClick={onClose}>
                                    <h3>{t("components.close")}</h3>
                                </div>
                                <div className="w-[50%] h-full flex justify-center items-center border border-[#2b2b2b] rounded-[12px]" onClick={clear}>
                                    <h3>{t("components.clear")}</h3>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </motion.div >
        </div>
    );
}