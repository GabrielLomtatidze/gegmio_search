"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";


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

export default function Filter({ regions, districts, businessTypes, onApply, }: Props) {

    const t = useTranslations();


    const [searchCity, setSearchCity] = useState<string>();
    const [filterRouter, setFilterRouter] = useState("");
    const [selectedRegion, setSelectedRegion] = useState<Item | null>(null);
    const [selectedDistricts, setSelectedDistricts] = useState<Item[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<Item | null>(null);
    const [sortBy, setSortBy] = useState("distance");

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


                            <h3 className="text-[14px] font-bold">გაუქმება</h3>
                        </div>

                        <div className="mt-2 max-h-[400px] overflow-y-auto">
                            {filteredRegions.map((item) => (
                                <div key={item.id} onClick={() => { setSelectedRegion(item); setSelectedDistricts([]); setFilterRouter(""); }} className="h-[64px] p-4 border-b border-[#2b2b2b] flex justify-between" >
                                    <span>{item.name}</span>
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
                        {districts
                            .filter((d) => d.regionId === selectedRegion?.id)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => toggleDistrict(item)}
                                    className="p-4 border-b border-[#2b2b2b] flex justify-between"
                                >
                                    {item.name}
                                    {selectedDistricts.some((d) => d.id === item.id) && "✓"}
                                </div>
                            ))}
                    </>
                )}

                {filterRouter === "object" && (
                    <>
                        <button onClick={() => setFilterRouter("")}>←</button>
                        {businessTypes.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => {
                                    setSelectedBusiness(item);
                                    setFilterRouter("");
                                }}
                                className="p-4 border-b border-[#2b2b2b] flex justify-between"
                            >
                                {item.name}
                                {selectedBusiness?.id === item.id && "✓"}
                            </div>
                        ))}
                    </>
                )}

                {filterRouter === "" && (
                    <>

                        <div className="space-y-4">
                            <div onClick={() => setFilterRouter("city")} className="h-[64px] flex justify-between items-center text-[14px] text-[#a7a7a7] border-b border-[#2b2b2b]" >
                                ქალაქი
                                <div className="flex items-center justofy-cetner">
                                    <span className="text-white">{selectedRegion?.name}</span>
                                    <img src="/images/arrow_right.svg" alt="arrow_right" />
                                </div>
                            </div>

                            <div onClick={() => selectedRegion && setFilterRouter("district")} className={`h-[64px] flex justify-between items-center text-[14px] text-[#a7a7a7] border-b border-[#2b2b2b] pb-2 ${!selectedRegion && "opacity-40 pointer-events-none "}`}  >
                                უბანი
                                <div className="flex items-center justofy-cetner">
                                    <span>  {selectedDistricts.length > 0 && `${selectedDistricts.length} არჩეული`}</span>
                                    <img src="/images/arrow_right.svg" alt="" />
                                </div>
                            </div>

                            <div onClick={() => setFilterRouter("object")} className="flex justify-between border-b border-[#2b2b2b] pb-2"   >
                                ობიექტი
                                <span>{selectedBusiness?.name}</span>
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