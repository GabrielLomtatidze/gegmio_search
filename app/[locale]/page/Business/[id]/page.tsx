"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import MenuService from "@/app/[locale]/layout/menuServices";
import Reviews from "@/app/[locale]/layout/reviews";
import Details from "@/app/[locale]/layout/details";
import { useBusinessStoreId } from "@/zustand/APIs/public/businessStoreId";
import ErrorPage from "@/app/[locale]/not-found";
import { useTranslations } from "next-intl";
import axios from "axios";
import { useAuthPositionStore } from "@/zustand/User/userPositionStore";
import Link from "next/link";

export default function Business() {

    const t = useTranslations();
    const params = useParams();
    const id = params?.id as string;
    const hasFetched = useRef(false);

    const { business, loading, getBusinessById } = useBusinessStoreId();
    const { guessMode, isAuthenticated } = useAuthPositionStore();

    const [selectedNavId, setSelectedNavId] = useState<number>(0);
    const [favorite, setFavorite] = useState(false);
    const [openModal, setOpenModal] = useState<boolean>(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);


    const navItems = [
        { id: 0, name: t("pages.menu_service") },
        { id: 1, name: t("pages.reviews") },
        { id: 2, name: t("pages.details") },
    ];

    useEffect(() => {
        if (id) getBusinessById(id);
    }, [id]);


    useEffect(() => {
        if (id && !hasFetched.current) {
            getBusinessById(id);
            hasFetched.current = true;
        }
    }, [id]);

    useEffect(() => {
        if (business) {
            setFavorite(!!business.isFavorite);
        }
    }, [business]);

    const addFavorite = async (): Promise<void> => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            if (!guessMode && business) {
                if (!favorite) {
                    await axios.post(
                        `https://bookitcrm.runasp.net/api/v1/favorites/${id}`,
                        {},
                        {
                            headers: {
                                Accept: "application/json",
                                Authorization: `Bearer ${accessToken}`,
                                "Accept-Language": "ka-GE",
                            },
                        }
                    );
                } else {
                    await axios.delete(
                        `https://bookitcrm.runasp.net/api/v1/favorites/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                }

                setFavorite(!favorite);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX === null) return;

        const diff = touchStartX - e.touches[0].clientX;

        if (diff > 50 && currentIndex < (business?.files?.length || 0) - 1) {
            setCurrentIndex((prev) => prev + 1);
            setTouchStartX(null);
        } else if (diff < -50 && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setTouchStartX(null);
        }
    };

    const handleTouchEnd = () => setTouchStartX(null);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
                <Spinner color="#F94B00" />
            </div>
        );
    }

    if (!business) return <ErrorPage />;

    const images = business.files || [];
    const rating = 3.5;

    const formatPhone = (number: string | null | undefined, isAuthenticated: boolean) => {
        if (!number) return "No phone number";

        if (isAuthenticated) return number;

        const visiblePart = number.slice(0, -4);
        return visiblePart + "****";
    };


    return (
        <div className="bg-[#0F0F0F]">
            <Header />

            <div className="hidden md:flex w-full justify-center sticky top-0 z-30">
                <div className="text-white flex justify-between items-center max-w-7xl w-full px-4 py-5 md:px-[100px]">
                    <a href="/" className="flex items-center gap-3">
                        <div className="w-[42px] h-[42px] border border-[#2b2b2b] rounded-full flex justify-center items-center">
                            <img src="/images/arrow_left.svg" />
                        </div>
                        <h3 className="text-[#a7a7a7]">{t("pages.back")}</h3>
                    </a>

                    <div className="flex items-center gap-3">
                        <div className="px-3 py-2 border border-[#2b2b2b] bg-[#141414] rounded-full flex items-center">
                            <h4 className="font-bold">{business.distnace} {t("pages.distance")}</h4>
                            <img src="/images/map_pin.svg" className="w-[12px] ml-2" />
                        </div>

                        <div onClick={addFavorite} className="w-[42px] h-[42px] border border-[#2b2b2b] bg-[#141414] rounded-full flex justify-center items-center cursor-pointer" >
                            <img src={favorite ? "/images/fill-heart.svg" : "/images/heart.svg"} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-[100px] py-6 relative">

                <div className="absolute top-7 left-7 right-7 flex justify-between z-20 md:hidden">
                    <a href="/" className="bg-black/50 p-2 rounded-full">
                        <img src="/images/arrow_left.svg" />
                    </a>

                    <div className="flex gap-2">
                        <div className="bg-black/50 px-3 py-2 rounded-full text-white">
                            {business.distnace} {t("pages.distance")}
                        </div>

                        <div onClick={addFavorite} className="bg-black/50 p-2 rounded-full" >
                            <img src={favorite ? "/images/fill-heart.svg" : "/images/heart.svg"} />
                        </div>
                    </div>
                </div>

                <div
                    className="md:hidden overflow-hidden h-[300px]"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-300"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {images.map((img) => (
                            <img
                                key={img.id}
                                src={img.url}
                                className="w-full h-[300px] object-cover flex-shrink-0 rounded-2xl"
                            />
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex gap-[5px] h-[417px]">
                    <div className="w-1/2">
                        {images[0] && (
                            <img src={images[0].url} className="w-full h-full object-cover rounded-2xl" />
                        )}
                    </div>

                    <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-[5px]">
                        {images.slice(1, 5).map((img) => (
                            <img key={img.id} src={img.url} className="w-full h-full object-cover rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-[100px]">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                    <div className="w-full md:w-[35%] flex flex-col gap-2">
                        <h1 className="text-white text-xl md:text-2xl font-bold">
                            {business.name}
                        </h1>

                        <div className="flex gap-1 text-[#FFB83F]">
                            {[1, 2, 3, 4, 5].map((i) => {
                                if (rating >= i) return <FaStar key={i} />;
                                if (rating >= i - 0.5) return <FaStarHalfAlt key={i} />;
                                return <FaRegStar key={i} />;
                            })}
                        </div>
                    </div>

                    <button className="w-full md:w-auto px-4 py-3 rounded-xl flex items-center justify-center gap-2 bg-[#00D34D] text-white font-bold whitespace-nowrap" onClick={() => { if (!isAuthenticated) setOpenModal(true); }} >
                        <img src="/images/call.svg" alt="call" className="w-5 h-5" />
                        {formatPhone(business.phoneNumber, isAuthenticated)}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-4">

                    <div className="w-full md:w-[35%]">
                        <div className="w-full h-[42px] rounded-xl border border-[#2b2b2b] flex gap-[6px] px-[12px] items-center">
                            <img src="/images/map_pin.svg" alt="map" />
                            <h3 className="text-[#a7a7a7] text-[14px] truncate">
                                {business.businessAddressName}
                            </h3>
                            <img src="/images/arrow_right.svg" alt="arrowRight" />
                        </div>
                    </div>

                    <div className="flex gap-4 justify-start md:justify-end">
                        <a href="https://www.facebook.com/profile.php?id=61583853083725" target="_blank" className="group w-[42px] h-[42px] border-2 border-[#2b2b2b] rounded-full flex items-center justify-center relative overflow-hidden" >
                            <img src="/images/facebook-big.svg" className="absolute opacity-100 group-hover:opacity-0 transition duration-300" />
                            <img src="/images/fill_facebook_icon.svg" className="absolute opacity-0 group-hover:opacity-100 transition duration-300" />
                        </a>

                        <a href="#" className="group w-[42px] h-[42px] border-2 border-[#2b2b2b] rounded-full flex items-center justify-center relative overflow-hidden" >
                            <img src="/images/tiktok-big.svg" className="absolute opacity-100 group-hover:opacity-0 transition duration-300" />
                            <img src="/images/fill_tiktok_icon.svg" className="absolute opacity-0 group-hover:opacity-100 transition duration-300" />
                        </a>

                        <a href="#" className="group w-[42px] h-[42px] border-2 border-[#2b2b2b] rounded-full flex items-center justify-center relative overflow-hidden" >
                            <img src="/images/Linkedin.svg" className="absolute opacity-100 group-hover:opacity-0 transition duration-300" />
                            <img src="/images/fill_linkedin_icon.svg" className="absolute opacity-0 group-hover:opacity-100 transition duration-300" />
                        </a>
                    </div>
                </div>
            </div>

            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-70" onClick={() => setOpenModal(false)} >
                    <div className="w-[376px] flex flex-col justify-center border border-[#2b2b2b] rounded-xl bg-[#0F0F0F] p-[24px]" onClick={(e) => e.stopPropagation()}>
                        <div className="w-full flex justify-center">
                            <h1 className="text-[18px] text-bold text-white">{t("auth.complete_verification")}</h1>
                        </div>
                        <h5 className="text-[14px] text-bold text-[#a7a7a7] text-center mt-[8px]">{t("auth.register_prompt")}</h5>
                        <Link href="/auth/registration">
                            <button className="w-full h-[48px] bg-[#F94B00] mt-[24px] rounded-xl text-white font-bold text-white">
                                {t("auth.create_account")}
                            </button>
                        </Link>

                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 md:px-[100px] mt-6">
                <div className="flex gap-6 border-b border-[#2b2b2b]">
                    {navItems.map((item) => (
                        <div key={item.id} onClick={() => setSelectedNavId(item.id)} className="cursor-pointer py-2 relative">
                            <h2 style={{ color: selectedNavId === item.id ? "#F94B00" : "#a7a7a7" }}>
                                {item.name}
                            </h2>

                            {selectedNavId === item.id && (
                                <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#F94B00]" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <div className={selectedNavId === 0 ? "block" : "hidden"}>
                        <MenuService />
                    </div>

                    <div className={selectedNavId === 1 ? "block" : "hidden"}>
                        <Reviews />
                    </div>

                    <div className={selectedNavId === 2 ? "block" : "hidden"}>
                        <Details />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}