"use client"
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuthPositionStore } from "@/zustand/User/userPositionStore";
import axios from "axios";

type Props = {
    businessId: string,
    isFavorite: boolean,
    isOpen: boolean,
    title: string,
    image: string,
    address: string,
    businessCategory: string
    distance: string | null
}


export default function Card({ businessId, isFavorite, isOpen, title, image, address, businessCategory, distance }: Props) {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const t = useTranslations();
    const { isAuthenticated } = useAuthPositionStore();

    const [heart, setHeart] = useState<boolean>(isFavorite);

    const addFavirite = async (): Promise<void> => {

        const accessToken = await localStorage.getItem("accessToken");

        if (!accessToken) return;

        try {

            if (!isAuthenticated) return;

            if (!heart) {

                await axios.post(`${apiUrl}/api/v1/favorites/${businessId}`, {}, {

                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${accessToken}`,
                        "Accept-Language": "ka-GE",
                    },
                });
            } else {

                await axios.delete(`${apiUrl}/api/v1/favorites/${businessId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }
            setHeart(!heart);
        } catch (error) {
        }
    }

    useEffect(() => {
        setHeart(isFavorite);
    }, [isFavorite]);

    return (
        <>
            <div className="w-full md:w-[252px] h-[260px] border border-[#2b2b2b] rounded-xl overflow-hidden relative">

                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addFavirite();
                    }}
                    className="absolute top-3 right-3 z-20 w-[38px] h-[38px] backdrop-blur-xl bg-black/40 rounded-full flex justify-center items-center cursor-pointer"
                >
                    <img
                        src={`/images/${heart ? "fill-heart.svg" : "heart.svg"}`}
                        alt="heart"
                        className="w-5 h-5"
                    />
                </button>

                <div className="cursor-pointer">

                    <div className="w-full h-[180px] relative">
                        <img src={image} alt="" className="w-full h-full object-cover" />

                        <div className="absolute inset-0 flex flex-col justify-between p-3">
                            <div className="inline-flex px-[12px] py-[8px] backdrop-blur-sm bg-black/50 rounded-2xl items-center gap-2 w-fit">
                                {isOpen ? (
                                    <>
                                        <div className="w-[8px] h-[8px] bg-[#00d34d] rounded-full" />
                                        <h3 className="text-white text-[14px]">
                                            {t("components.profile_open_now")}
                                        </h3>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-[8px] h-[8px] bg-red-500 rounded-full" />
                                        <h3 className="text-white text-[14px]">
                                            {t("components.is_closed")}
                                        </h3>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                    </div>

                    <div className="p-3">

                        <div className="w-full flex justify-between text-[14px]">
                            <h3 className="text-[#a7a7a7] text-[10px]">
                                {businessCategory}
                            </h3>

                            <div className="flex text-white">
                                <span>
                                    {distance}
                                    <span className="ml-[1px]">{t("components.distance")}</span>
                                </span>
                                <img src="/images/map_pin.svg" alt="map" className="w-[12px] ml-[5px]" />
                            </div>
                        </div>

                        <h1 className="text-[16px] text-white">
                            {title}
                        </h1>

                        <p className="text-[12px] text-[#a7a7a7] truncate">
                            {address}
                        </p>

                    </div>
                </div>
            </div>
        </>
    )
}