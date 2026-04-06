"use client";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

type ReviewCardProps = {
    name: string;
    date: string;
    review: string;
    rating: number;
    avatar: string;
};

export default function ReviewCard({ name, date, review, rating, avatar, }: ReviewCardProps) {

    return (
        <div className="w-[344px] h-[156px] px-[12px] py-[12px] rounded-xl bg-[#0F0F0F] border border-[#2B2B2B] flex flex-col justify-between ">
            <div className="flex items-start justify-between">

                <div className="flex gap-[12px]">
                    <img src={avatar} alt={name} width={40} height={40} className="rounded-full object-cover" />

                    <div className="">
                        <h3 className="text-white text-[14px] font-semibold leading-[18px]">
                            {name}
                        </h3>
                        <p className="text-[#A7A7A7] text-[12px]">
                            {date}
                        </p>
                    </div>
                    
                </div>

                <div className="flex gap-[4px]">
                    {[1, 2, 3, 4, 5].map((i) => {
                        if (rating >= i) {
                            return (
                                <FaStar key={i} size={14} className="text-[#FFB83F]" />
                            );
                        } else if (rating >= i - 0.5) {
                            return (
                                <FaStarHalfAlt key={i} size={14} className="text-[#FFB83F]" />
                            );
                        } else {
                            return (
                                <FaRegStar key={i} size={14} className="text-[#FFB83F]" />
                            );
                        }
                    })}
                </div>
            </div>

            <div className="w-full h-[1px] bg-[#2B2B2B]" />

            <p className="text-[#A7A7A7] text-[13px] leading-[18px] line-clamp-3">
                {review}
            </p>
        </div>
    );
}