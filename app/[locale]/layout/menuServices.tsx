"use client";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import MenuCard from "@/components/cards/menuCard";
import { useParams } from "next/navigation";
import axios from "axios"

type FilterText = {
    id: number;
    name: string;
};

type File = {
    id: number,
    url: string,
    isProfile: boolean
}

type Menu = {
    id: number,
    name: string,
    price: number,
    durationInMinutes: number,
    file: File
}


export default function MenuService() {

    const params = useParams();
    const id = params?.id as string;
    const [selectedId, setSelectedId] = useState<number>(1);
    const [canScroll, setCanScroll] = useState<{ left: boolean; right: boolean }>({ left: false, right: false });
    const containerRef = useRef<HTMLDivElement>(null);
    const hasFetched = useRef(false);
    const [filterText, setfilterText] = useState<FilterText[]>([]);
    const [selectedFilterId, setSelectedFilterId] = useState<number | null>(filterText[0]?.id);
    const [menu, setMenu] = useState<Menu[]>();

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
        container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    };


    const getFiltertext = async (): Promise<void> => {
        try {
            const response = await axios.get(
                `https://bookitcrm.runasp.net/api/v1/public/service-categories/${id}`
            );

            const data = response.data;
            setfilterText(data);

            const defaultItem = data.find((item: any) => item.name === "ყველა");

            if (defaultItem) {
                setSelectedFilterId(defaultItem.id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getMenu = async (): Promise<void> => {

        try {
            const response = await axios.get(`https://bookitcrm.runasp.net/api/v1/public/services/${id}`)

            const data = response.data;

            setMenu(data);

        } catch (error) {
            console.log(error)
        }
    }


   useEffect(() => {
    if (!id || hasFetched.current) return;

    getFiltertext();
    getMenu();

    hasFetched.current = true;
}, [id]);



    return (
        <div className="w-full mb-[100px]">

            <div className="w-full h-[44px] mt-[30px] inline-flex items-center gap-2">
                <div ref={containerRef} className="w-full h-full gap-[8px] flex overflow-x-hidden no-scrollbar scrollbar-hide" onScroll={updateScrollButtons}>
                    {filterText.map((item) => {
                        const isSelected = item.id === selectedId;
                        return (
                            <div key={item.id} onClick={() => setSelectedId(item.id)} className={`px-[10px] py-[22px] rounded-full flex items-center cursor-pointer ${isSelected ? "bg-[#F94B00] text-white" : "bg-[#171717] text-[#A7A7A7]"}`} >
                                <h1 className="truncate whitespace-nowrap">{item.name}</h1>
                            </div>
                        );
                    })}
                </div>

                <div className="inline-flex gap-[4px] h-full items-center">
                    <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center cursor-pointer border-[2px] ${canScroll.left ? "border-[#F94B00] text-white" : "border-[#2B2B2B] text-[#A7A7A7]"}`} onClick={() => scroll("left")}>
                        <FaChevronLeft size={14} color={canScroll.left ? "white" : "#A7A7A7"} />
                    </div>

                    <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center cursor-pointer border-[2px] ${canScroll.right ? "border-[#F94B00] bg-[#22140E] text-white" : "border-[#2B2B2B] bg-[#1A1A1A] text-[#A7A7A7]"}`} onClick={() => scroll("right")}>
                        <FaChevronRight size={14} color={canScroll.right ? "white" : "#A7A7A7"} />
                    </div>
                </div>
            </div>

            <div className="w-full mt-[20px] rounded-xl flex flex-wrap gap-[24px]">
                {menu?.map((item: Menu) => (
                    <MenuCard
                        key={item.id}
                        name={item.name}
                        durationInMinutes={item.durationInMinutes}
                        price={item.price}
                        img={item?.file?.url ? item?.file?.url : "/images/test.svg"}
                    />
                ))}
            </div>
        </div>
    );
};
