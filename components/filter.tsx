"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDistrictStore } from "@/zustand/APIs/public/districtStore";

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
    districts: Item[];
    businessTypes: Item[];
    onApply?: (data: FilterValues) => void;
};

type Status = {
    id: number,
    title: string
}

export default function Filter({ regions, businessTypes, onApply }: Props) {

    const t = useTranslations();

    const districts = useDistrictStore((state) => state.districts);
    const fetchDistricts = useDistrictStore((state) => state.fetchDistricts);

    const [searchCity, setSearchCity] = useState<string>();
    const [filterRouter, setFilterRouter] = useState("");
    const [selectedRegion, setSelectedRegion] = useState<Item | null>(null);
    const [selectedDistricts, setSelectedDistricts] = useState<Item[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<Item | null>(null);
    const [sortBy, setSortBy] = useState("distance");
    const [selectedStatus, setSelectedStatus] = useState<number>(0);

    const statis: Status[] = [
        {
            id: 0,
            title: "ყველა"
        },
        {
            id: 1,
            title: "ღიაა ახლა"
        },
        {
            id: 2,
            title: "დაკეტილია"
        }
    ]


    useEffect(() => {
        fetchDistricts(selectedRegion?.id ?? null);
    }, [selectedRegion, fetchDistricts]);

    const toggleDistrict = (district: Item) => {
        if (selectedDistricts.some((d) => d.id === district.id)) {
            setSelectedDistricts((prev) =>
                prev.filter((d) => d.id !== district.id)
            );
        } else {
            setSelectedDistricts((prev) => [...prev, district]);
        }
    };

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

    return (
        <div className="w-full text-white">

            <div className="absolute bottom-0 left-0 w-full h-[70vh] bg-[#0f0f0f] rounded-t-2xl p-4 animate-slideUp overflow-y-auto">

                <div className="w-full flex justify-center mb-4">
                    <h2 className="text-white font-bold"> {filterRouter === "city" ? "ქალაქი" : "ფილტრი"}</h2>
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

                            <h3 className="text-[14px] font-bold" onClick={() => { setSelectedRegion(null); setSearchCity(""); }}>გაუქმება</h3>
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

                {filterRouter === "district" && (
                    <>
                        <button onClick={() => setFilterRouter("")}>←</button>
                        {districts.map((item) => {
                            const isSelected = selectedDistricts.some((d) => d.id === item.id);

                            return (
                                <div key={item.id} onClick={() => toggleDistrict(item)} className="h-[64px] p-4 border-b border-[#2b2b2b] flex justify-between items-center"      >
                                    <span className={`text-[${isSelected ? "#F94B00" : "white"}]`}>
                                        {item.name}
                                    </span>

                                    {isSelected && (
                                        <img src="/images/fill_mark.svg" alt="mark" />
                                    )}
                                </div>
                            );
                        })}
                    </>
                )}

                {filterRouter === "" && (
                    <>

                        <div className="space-y-4">
                            <div onClick={() => setFilterRouter("city")} className="h-[64px] flex justify-between items-center text-[14px] text-[#a7a7a7] border-b border-[#2b2b2b]" >
                                <span className="text-[#a7a7a7] text-[14px]">ქალაქი</span>
                                <div className="flex items-center justofy-cetner">
                                    <span className="text-white">{selectedRegion?.name}</span>
                                    <img src="/images/arrow_right.svg" alt="arrow_right" />
                                </div>
                            </div>

                            <div onClick={() => selectedRegion && setFilterRouter("district")} className={`h-[64px] flex justify-between items-center text-[14px] text-[#a7a7a7] border-b border-[#2b2b2b] pb-2 ${!selectedRegion && "opacity-40 pointer-events-none "}`}  >
                                <span className="text-[#a7a7a7] text-[14px]">უბანი</span>
                                <div className="flex items-center justofy-cetner">
                                    <span className="text-white">{selectedDistricts.length > 0 && `${selectedDistricts.length} არჩეული`}</span>
                                    <img src="/images/arrow_right.svg" alt="" />
                                </div>
                            </div>

                            <div className="flex flex-col justify-between border-b border-[#2b2b2b] pb-2 " >
                                <span className="text-[#a7a7a7] text-[14px]">სტატუსი</span>
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
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={() => setSortBy("distance")}
                                className={`w-1/2 p-2 rounded ${sortBy === "distance"
                                    ? "bg-[#F94B00]"
                                    : "border border-[#F94B00]"
                                    }`}
                            >
                                დისტანცია
                            </button>

                            <button
                                onClick={() => setSortBy("rating")}
                                className={`w-1/2 p-2 rounded ${sortBy === "rating"
                                    ? "bg-[#F94B00]"
                                    : "border border-[#F94B00]"
                                    }`}
                            >
                                რეიტინგი
                            </button>
                        </div>

                        <button
                            onClick={apply}
                            className="w-full bg-[#F94B00] mt-6 p-3 rounded-xl font-bold"
                        >
                            გაფილტვრა
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}