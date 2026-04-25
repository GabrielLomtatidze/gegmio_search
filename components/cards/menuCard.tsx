import { FaChevronRight } from "react-icons/fa";
import { useTranslations } from "next-intl";


type Props = {
    name: string,
    durationInMinutes: number,
    price: number,
    img: string
}


export default function MenuCard({ name, durationInMinutes, price, img }: Props) {

    const t = useTranslations();

    return (
        <>
            <div className="w-full md:w-[252px] h-[238px] border border-[#2B2B2B] rounded-xl overflow-hidden">

                <div className="relative w-full h-[150px] overflow-hidden">
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>

                <div className="px-[12px] pb-[12px]">
                    <h1 className="text-white text-[12px] font-bold truncate">
                        {name}
                    </h1>

                    <h3 className="text-[#A7A7A7] text-[12px]">
                        {t("components.time")} {durationInMinutes} {t("components.min")}
                    </h3>

                    <div className="w-full mt-[5px] flex justify-between items-center">
                        <h1 className="text-white text-[18px] font-bold">
                            {price} {t("components.price")}
                        </h1>

                        <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center cursor-pointer border-2 border-[#F94B00] bg-[#22140E]">
                            <FaChevronRight size={10} color="white" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
