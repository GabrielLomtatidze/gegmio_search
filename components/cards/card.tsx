"use client"
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuthPositionStore } from "@/zustand/User/userPositionStore";
import axios from "axios";
import Link from "next/link";

type Props = {
    businessId: string,
    isFavorite: boolean,
    title: string,
    image: string,
    address: string,
    businessCategory: string
    distance: string | null
}


export default function Card({ businessId, isFavorite, title, image, address, businessCategory, distance }: Props) {

    const t = useTranslations();
    const { guessMode } = useAuthPositionStore();

    const [heart, setHeart] = useState<boolean>(isFavorite);

    const addFavirite = async (): Promise<void> => {

        const accessToken = await localStorage.getItem("accessToken");

        if(!accessToken) return;

        try {
            
            if (!guessMode) {

                if (!heart) {

                    await axios.post(`https://bookitcrm.runasp.net/api/v1/favorites/${businessId}`, {}, {

                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${accessToken}`,
                            "Accept-Language": "ka-GE",
                        },
                    });
                } else {

                    await axios.delete(`https://bookitcrm.runasp.net/api/v1/favorites/${businessId}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                }
                setHeart(!heart);
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        setHeart(isFavorite);
    }, [isFavorite]);

    return (
        <>
            <div className="w-[252px] h-[260px] border-[1px] border-[#2b2b2b] rounded-xl overflow-hidden relative">

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        addFavirite();
                    }}
                    className="absolute top-[10px] right-[10px] z-20 w-[32px] h-[32px] backdrop-blur-xl bg-black/40 rounded-full flex justify-center items-center"
                >
                    <img
                        src={`/images/${heart ? "fill-heart.svg" : "heart.svg"}`}
                        alt="heart"
                        className="w-5 h-5"
                    />
                </button>

                <Link href={`/Business/${businessId}`}>
                    <div className="cursor-pointer">

                        <div className="w-full h-[180px] relative">
                            <img src={image} alt="" className="w-full h-full object-cover" />

                            <div className="absolute inset-0 flex flex-col justify-between p-[10px]">
                                <div className="inline-flex px-[12px] py-[8px] backdrop-blur-sm bg-black/50 rounded-2xl items-center gap-2 w-fit">
                                    <div className="w-[8px] h-[8px] bg-[#00d34d] rounded-full" />
                                    <h3 className="text-white">{t("components.profile_open_now")}</h3>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
                        </div>

                        <div className="p-[10px]">
                            <div className="w-full flex justify-between text-[14px]">
                                <h3 className="text-[#a7a7a7]">
                                    {businessCategory}
                                </h3>

                                <div className="flex text-white">
                                    <span>
                                        {distance}<span className="ml-[1px]">{t("components.distance")}</span>
                                    </span>
                                    <img src="/images/map_pin.svg" alt="map" className="ml-[5px]" />
                                </div>
                            </div>

                            <h1 className="text-[16px] text-white mt-[2px]">
                                {title}
                            </h1>

                            <p className="text-[12px] text-[#a7a7a7] truncate">
                                {address}
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}