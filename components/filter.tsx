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

type Props = {
    regions: Item[];
    selectedRegionId: number;
    selectedCategoryId: number;
    openStatus: "all" | "open" | "closed";
    onChangeRegion: (id: number) => void;
    onChangeCategory: (id: number) => void;
    onChangeOpenStatus: (status: "all" | "open" | "closed") => void;
    onApply: () => void;
    onClose: () => void;
};

export default function Filter({ regions, selectedRegionId, openStatus, onChangeRegion, onChangeOpenStatus, onApply, onClose, }: Props) {
    const t = useTranslations();

    const fetchDistricts = useDistrictStore((state) => state.fetchDistricts);

    const [searchCity, setSearchCity] = useState("");
    const [filterRouter, setFilterRouter] = useState("");

    const statis = [
        { id: "all", title: t("components.all") },
        { id: "open", title: t("components.profile_open_now") },
        { id: "closed", title: t("components.closed") },
    ];

    useEffect(() => {
        fetchDistricts(selectedRegionId || null);
    }, [selectedRegionId, fetchDistricts]);

    const filteredRegions = regions.filter((r) =>
        r.name.toLowerCase().includes(searchCity.toLowerCase())
    );

    const clear = () => {
        onChangeRegion(0);
        onChangeOpenStatus("all");
        setSearchCity("");
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50">
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 300 }}
                onDragEnd={(e, info) => {
                    if (info.offset.y > 120) {
                        onClose();
                    }
                }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#0f0f0f] rounded-t-2xl p-4 overflow-y-auto text-white"
            >
                <div className="w-full flex justify-center mb-4">
                    <h2 className="text-white font-bold">
                        {filterRouter === "city" ? t("components.city") : t("components.filter")}
                    </h2>
                </div>

                {filterRouter === "city" && (
                    <>
                        <div className="w-full h-[42px] flex gap-[8px] items-center">
                            <button onClick={() => setFilterRouter("")} className="w-[42px] h-[42px] bg-[#171717] flex justify-center items-center rounded-full"  >
                                <img src="/images/arrow_left.svg" alt="arrow_left" />
                            </button>

                            <div className="flex-1 h-[42px] flex items-center bg-[#0f0f0f] px-4 border border-[#2b2b2b] rounded-xl focus-within:border-[#F94B00]">
                                <Search className="w-5 h-5 text-white mr-3" />
                                <input
                                    type="text"
                                    value={searchCity}
                                    onChange={(e) => setSearchCity(e.target.value)}
                                    className="bg-transparent outline-none text-white w-full text-[14px]"
                                />
                            </div>

                            <h3 className="text-[14px] font-bold" onClick={() => { onChangeRegion(0); setSearchCity(""); }}  >
                                {t("components.cancel")}
                            </h3>
                        </div>

                        <div className="mt-2 max-h-[400px] overflow-y-auto">
                            {filteredRegions.map((item) => (
                                <div key={item.id} onClick={() => { onChangeRegion(item.id); setFilterRouter(""); }} className="h-[64px] p-4 border-b border-[#2b2b2b] flex justify-between"     >
                                    <span className={selectedRegionId === item.id ? "text-[#F94B00]" : "text-white"}  >
                                        {item.name}
                                    </span>
                                    {selectedRegionId === item.id && (
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
                            <div onClick={() => setFilterRouter("city")} className="h-[64px] flex justify-between items-center text-[14px] text-[#a7a7a7] border-b border-[#2b2b2b]"  >
                                <span>{t("components.city")}</span>
                                <div className="flex items-center">
                                    <span className="text-white">
                                        {
                                            regions.find((r) => r.id === selectedRegionId)?.name
                                        }
                                    </span>
                                    <img src="/images/arrow_right.svg" alt="arrow_right" />
                                </div>
                            </div>

                            <div className="border-b border-[#2b2b2b] pb-2">
                                <span className="text-[#a7a7a7] text-[14px]">
                                    {t("components.status")}
                                </span>
                                <div className="flex gap-[8px] mt-[12px]">
                                    {statis.map((item) => {
                                        const isSelected = openStatus === item.id;
                                        return (
                                            <div key={item.id} onClick={() => onChangeOpenStatus(item.id as any)}
                                                className={`w-full h-[42px] rounded-[12px] border ${isSelected ? "border-[#F94B00] bg-[#22140E]" : "border-[#2b2b2b]"} flex justify-center items-center`}     >
                                                <h3 className={`text-[14px] ${isSelected ? "text-white" : "text-[#a7a7a7]"}`}     >
                                                    {item.title}
                                                </h3>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="w-full absolute bottom-[5px] left-0 px-4">
                            <button onClick={onApply} className="w-full bg-[#F94B00] p-3 rounded-xl font-bold"  >
                                {t("components.apply_filter")}
                            </button>

                            <div className="w-full h-[48px] mt-[12px] flex">
                                <div className="w-1/2 flex justify-center items-center" onClick={onClose}    >
                                    <h3>{t("components.close")}</h3>
                                </div>
                                <div className="w-1/2 flex justify-center items-center border border-[#2b2b2b] rounded-[12px]" onClick={clear} >
                                    <h3>{t("components.clear")}</h3>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}