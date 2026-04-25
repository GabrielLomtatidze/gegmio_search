"use client";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import MenuCard from "@/components/cards/menuCard";
import { useParams } from "next/navigation";
import axios from "axios";

type FilterText = {
    id: number;
    name: string;
};

type File = {
    id: number;
    url: string;
    isProfile: boolean;
};

type Menu = {
    id: number;
    name: string;
    price: number;
    durationInMinutes: number;
    file: File;
};

export default function MenuService() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const params = useParams();
    const id = params?.id as string;

    const [canScroll, setCanScroll] = useState({ left: false, right: false });
    const containerRef = useRef<HTMLDivElement>(null);
    const hasFetched = useRef(false);

    const [filterText, setfilterText] = useState<FilterText[]>([]);
    const [selectedFilterId, setSelectedFilterId] = useState<number>(0);
    const [menu, setMenu] = useState<Menu[]>([]);

    const updateScrollButtons = () => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;

        setCanScroll({
            left: scrollLeft > 0,
            right: scrollLeft + clientWidth < scrollWidth,
        });
    };

    useEffect(() => {
        updateScrollButtons();
        window.addEventListener("resize", updateScrollButtons);
        return () => window.removeEventListener("resize", updateScrollButtons);
    }, [filterText]);

    const scroll = (direction: "left" | "right") => {
        const container = containerRef.current;
        if (!container) return;

        const scrollAmount = container.clientWidth / 2;

        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const getFiltertext = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/v1/public/service-categories/${id}`
            );

            const data = response.data;

            setfilterText([
                { id: 0, name: "ყველა" },
                ...data,
            ]);

            setSelectedFilterId(0);
        } catch (error) {
            console.log(error);
        }
    };

    const getMenu = async (categoryId?: number) => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/v1/public/services/${id}`,
                {
                    params: {
                        categoryId: categoryId && categoryId !== 0 ? categoryId : undefined,
                    },
                }
            );

            setMenu(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!id || hasFetched.current) return;

        getFiltertext();
        getMenu();

        hasFetched.current = true;
    }, [id]);

    useEffect(() => {
        if (!id) return;

        getMenu(selectedFilterId);
    }, [selectedFilterId, id]);

    return (
        <div className="w-full mb-[100px]">
            <div className="w-full h-[44px] mt-[30px] flex items-center gap-2">
                <div className="relative w-full h-full">
                    {canScroll.left && (
                        <div className="pointer-events-none absolute left-0 top-0 h-full w-[40px] bg-gradient-to-r from-[#0f0f0f] to-transparent z-10" />
                    )}

                    {canScroll.right && (
                        <div className="pointer-events-none absolute right-0 top-0 h-full w-[40px] bg-gradient-to-l from-[#0f0f0f] to-transparent z-10" />
                    )}

                    <div ref={containerRef} onScroll={updateScrollButtons} className="w-full h-full flex gap-[8px] overflow-x-auto no-scrollbar px-[8px]"  >
                        {filterText.map((item) => {
                            const isSelected = item.id === selectedFilterId;

                            return (
                                <div key={item.id} onClick={() => setSelectedFilterId(item.id)} className={`px-[10px] py-[22px] rounded-full flex items-center cursor-pointer ${isSelected ? "bg-[#F94B00] text-white" : "bg-[#171717] text-[#A7A7A7]"}`} >
                                    <h1 className="truncate whitespace-nowrap">
                                        {item.name}
                                    </h1>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="hidden md:inline-flex gap-[4px] h-full items-center">
                    <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center cursor-pointer border-[2px] ${canScroll.left ? "border-[#F94B00] text-white" : "border-[#2B2B2B] text-[#A7A7A7]"}`} onClick={() => scroll("left")}     >
                        <FaChevronLeft size={14} color={canScroll.left ? "white" : "#A7A7A7"} />
                    </div>

                    <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center cursor-pointer border-[2px] ${canScroll.right ? "border-[#F94B00] bg-[#22140E] text-white" : "border-[#2B2B2B] bg-[#1A1A1A] text-[#A7A7A7]"}`} onClick={() => scroll("right")}  >
                        <FaChevronRight size={14} color={canScroll.right ? "white" : "#A7A7A7"} />
                    </div>
                </div>
            </div>

            <div className="w-full mt-[20px] rounded-xl flex flex-wrap gap-[24px]">
                {menu.map((item: Menu) => (
                    <MenuCard
                        key={item.id}
                        name={item.name}
                        durationInMinutes={item.durationInMinutes}
                        price={item.price}
                        img={item?.file?.url || "/images/test.svg"}
                    />
                ))}
            </div>
        </div>
    );
}