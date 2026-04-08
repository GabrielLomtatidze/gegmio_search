"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/zustand/User/profileStore";
import { useTranslations } from "next-intl";
import { useAuthPositionStore } from "@/zustand/User/userPositionStore";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
    const t = useTranslations();
    const { userInfo, fetchUserInfo } = useUserStore();
    const setAuthenticated = useAuthPositionStore((state) => state.setAuthenticated);
    const isAuthenticated = useAuthPositionStore((state) => state.isAuthenticated);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setAccessToken(token);

        if (token) {
            fetchUserInfo();
            setAuthenticated(true);
        }
    }, []);

    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const userInitial = userInfo?.firstName?.[0]?.toUpperCase() || "?";

    const logOut = (): void => {
        localStorage.removeItem("accessToken");
        setAuthenticated(false);
        window.location.reload();
    };

    const currentLocale = pathname.split("/")[1] === "ka" ? "ka" : "en";

    const changeLanguage = (lang: string) => {
        const segments = pathname.split("/");
        if (segments[1] === "en" || segments[1] === "ka") {
            segments[1] = lang;
        } else {
            segments.unshift("", lang);
        }
        router.push(segments.join("/"));
    };

    return (
        <>
            <header className="border-b-2 border-b-[#242424] w-full flex justify-center bg-[#0F0F0F] sticky top-0 z-50">
                <div className="text-white flex justify-between items-center max-w-7xl w-full m-auto px-4 py-5 md:px-[100px]">

                    <Link href="/" className="logo">
                        <img src="/images/logo.svg" alt="Gegmio Logo" />
                    </Link>

                    <div className="h-[42px] flex justify-end items-center gap-2">

                        <div className="hidden md:flex w-[102px] h-[42px] border-[1px] border-[#2b2b2b] rounded-xl p-[3px] flex items-center">
                            <div className="relative w-full h-full bg-[#111] rounded-full flex">
                                <div className={`absolute top-0 h-full w-1/2 bg-[#F94B00] rounded-xl transition-all duration-300 ${currentLocale === "en" ? "left-0" : "left-1/2"}`} />

                                <button onClick={() => changeLanguage("en")} className={`w-1/2 z-10 text-sm font-semibold ${currentLocale === "en" ? "text-white" : "text-[#6C6C6C]"}`}>
                                    EN
                                </button>

                                <button onClick={() => changeLanguage("ka")} className={`w-1/2 z-10 text-sm font-semibold ${currentLocale === "ka" ? "text-white" : "text-[#6C6C6C]"}`}>
                                    GE
                                </button>
                            </div>
                        </div>

                        <button className="hidden md:block w-[214px] h-full bg-[#F94B00] rounded-xl text-white font-bold text-sm">
                            {t("components.add_business_button")}
                        </button>

                        <div className="relative hidden md:block">
                            {accessToken ?
                                (<>
                                    <div className="px-[12px] py-[8px] border-[1px] border-[#2b2b2b] flex justify-center items-center rounded-xl gap-[8px] cursor-pointer" onClick={() => setOpenProfileModal(!openProfileModal)} >
                                        <div className="w-[28px] h-[28px] bg-[#242424] rounded-full flex justify-center items-center">
                                            {userInitial}
                                        </div>
                                        <h3 className="font-bold">{userInfo?.firstName}</h3>
                                        <img src="/images/arrow_down.svg" alt="arrow_down" />
                                    </div>
                                </>)
                                :
                                (<>
                                    <Link href="/auth/login" prefetch={false}>
                                        <div className="px-[12px] py-[8px] border-[1px] border-[#2b2b2b] flex justify-center items-center rounded-xl gap-[8px] cursor-pointer">
                                            <img src="/images/white_profile.svg" alt="profile" />
                                            <h3>{t("auth.login_button")}</h3>
                                        </div>
                                    </Link>
                                </>)}

                            {openProfileModal && (
                                <div className="absolute top-full right-0 mt-2 w-[209px] h-[237px] bg-[#0F0F0F] p-[14px] border border-[#2b2b2b] rounded-xl shadow-lg z-50 transition-all duration-300">

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2A2A2A] text-white font-semibold">{userInitial}</div>
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{userInfo?.lastName}</p>
                                            <p className="text-[#9CA3AF] text-xs truncate">{userInfo?.email}</p>
                                        </div>
                                    </div>

                                    <div className="my-3 h-px bg-[#2b2b2b]" />

                                    <div className="flex flex-col gap-2">
                                        <Link href="/page/profile">
                                            <button className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#1A1A1A] transition cursor-pointer" >
                                                <img src="/images/grey_profile.svg" alt="profile" />
                                                <span className="text-[#a7a7a7] text-sm font-bold">{t("components.my_profile")}</span>
                                            </button>
                                        </Link>

                                        <Link href="/page/favorite">
                                            <button className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#1A1A1A] transition cursor-pointer">
                                                <img src="/images/grey_heart.svg" alt="heart" />
                                                <span className="text-[#a7a7a7] text-sm font-bold">{t("components.favorites")}</span>
                                            </button>
                                        </Link>

                                    </div>

                                    <div className="mt-2">
                                        <button className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#1A1A1A] transition w-full cursor-pointer" onClick={logOut} >
                                            <img src="/images/log_out.svg" alt="logout" />
                                            <span className="text-[#FF2A2A] text-sm font-bold">{t("components.logout")}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:hidden">
                            <button onClick={() => setMobileMenuOpen(true)}>
                                <img src="/images/menu_burger.svg" alt="burger" />
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            <div className={`fixed top-0 right-0 w-full h-screen bg-[#0F0F0F] z-[9999] transform transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="h-[92px] flex justify-between items-center px-[16px] border-b border-[#242424]">
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <div className="w-[44px] h-[44px] flex items-center justify-center rounded-full bg-[#2A2A2A] text-white font-semibold">{userInitial}</div>
                                <div className="min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{userInfo?.lastName}</p>
                                    <p className="text-[#9CA3AF] text-xs truncate">{userInfo?.email}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" prefetch={false}>
                                    <div className="px-[12px] py-[8px] border-[1px] border-[#2b2b2b] flex justify-center items-center rounded-xl gap-[8px] cursor-pointer">
                                        <img src="/images/white_profile.svg" alt="profile" />
                                        <h3 className="text-white">{t("auth.login_button")}</h3>
                                    </div>
                                </Link>
                            </>
                        )}

                    </div>

                    <button onClick={() => setMobileMenuOpen(false)} className="w-[41px] h-[42px] border border-[#2b2b2b] rounded-xl">
                        <span className="text-white text-xl">✕</span>
                    </button>
                </div>

                <div className="flex flex-col gap-6 px-[16px] text-white mt-[12px]">
                    {isAuthenticated ? (<></>) : (<></>)}
                    <Link href="/page/profile">
                        <button className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#1A1A1A] transition cursor-pointer">
                            <img src="/images/grey_profile.svg" alt="profile" />
                            <span className="text-[#a7a7a7] text-sm font-bold">{t("components.my_profile")}</span>
                        </button>
                    </Link>

                    <Link href="/page/favorite">
                        <button className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#1A1A1A] transition cursor-pointer">
                            <img src="/images/grey_heart.svg" alt="heart" />
                            <span className="text-[#a7a7a7] text-sm font-bold">{t("components.favorites")}</span>
                        </button>
                    </Link>
                    <button className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#1A1A1A] transition w-full cursor-pointer" onClick={logOut}>
                        <img src="/images/log_out.svg" alt="logout" />
                        <span className="text-[#FF2A2A] text-sm font-bold">{t("components.logout")}</span>
                    </button>

                    <button className="h-[42px] bg-[#F94B00] rounded-xl font-bold">{t("components.add_business_button")}</button>

                    <div className="h-[279px] w-full absolute bottom-[24px] left-0 px-[16px]">
                        <h3 className="text-[#a7a7a7] text-[14px] mt-[12px]">{t("layout.contact_info")}</h3>
                        <div className="flex items-center gap-2 mt-[20px] rounded-lg">
                            <img src="/images/fill_call.svg" alt="profile" />
                            <span className="text-white text-sm font-bold">+995 586 90 24 10</span>
                        </div>
                        <div className="flex items-center gap-1 mt-[20px] rounded-lg">
                            <img src="/images/fill_mail.svg" alt="profile" />
                            <span className="text-white text-sm font-bold">info@gmail.com</span>
                        </div>

                        <div className="h-[42px] mt-[20px] flex gap-5">
                            <a href="https://www.facebook.com/profile.php?id=61583853083725" target="_blank" className="group w-[42px] h-[42px] border-3 border-[#2b2b2b] rounded-full flex items-center justify-center relative overflow-hidden">
                                <img src="/images/facebook-big.svg" alt="Facebook" className="w-[24px] absolute opacity-100" />
                            </a>
                            <a href="#" className="group w-[42px] h-[42px] border-3 border-[#2b2b2b] rounded-full flex items-center justify-center relative overflow-hidden">
                                <img src="/images/tiktok-big.svg" alt="tiktok" className="w-[24px] absolute opacity-100" />
                            </a>
                            <a href="#" className="group w-[42px] h-[42px] border-3 border-[#2b2b2b] rounded-full flex items-center justify-center relative overflow-hidden">
                                <img src="/images/Linkedin.svg" alt="linkedin" className="w-[24px] absolute opacity-100" />
                            </a>
                        </div>

                        <div className="flex w-[102px] h-[42px] border-[1px] border-[#2b2b2b] rounded-xl p-[3px] flex items-center mt-4">
                            <div className="relative w-full h-full bg-[#111] rounded-full flex">
                                <div className={`absolute top-0 h-full w-1/2 bg-[#F94B00] rounded-xl transition-all duration-300 ${currentLocale === "en" ? "left-0" : "left-1/2"}`} />
                                <button onClick={() => changeLanguage("en")} className={`w-1/2 z-10 text-sm font-semibold ${currentLocale === "en" ? "text-white" : "text-[#6C6C6C]"}`}>EN</button>
                                <button onClick={() => changeLanguage("ka")} className={`w-1/2 z-10 text-sm font-semibold ${currentLocale === "ka" ? "text-white" : "text-[#6C6C6C]"}`}>GE</button>
                            </div>
                        </div>

                        <h2 className="text-[12px] text-[#a7a7a7] mt-4">© 2025 Gegmio LLC · Privacy · Terms</h2>
                    </div>
                </div>
            </div>
        </>
    );
}