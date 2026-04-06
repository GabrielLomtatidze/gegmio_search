"use client";
import { FaChevronRight } from 'react-icons/fa';
import { useTranslations } from "next-intl";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { useEffect } from 'react';
import { useUserStore } from '@/zustand/User/profileStore';
import axios from 'axios';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, } from "@/components/ui/input-otp";

interface Errors {
    email: string;
    password: string;
    repeatPassword: string;
    otp: string;
}

export default function Profile() {

    const t = useTranslations();
    const { userInfo } = useUserStore()

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [repeatPassword, setRepeatPassword] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({ email: "", password: "", repeatPassword: "", otp: "", });
    const [timecounter, setTimeCounter] = useState<number>(30);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const [showOtpInput, setShowOtpInput] = useState(false);


    useEffect(() => {
        if (isTimerActive && timecounter > 0) {
            const interval = setInterval(() => {
                setTimeCounter((p) => p - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timecounter <= 0) {
            setIsTimerActive(false);
            setTimeCounter(30);
        }
    }, [isTimerActive, timecounter]);

     const getCode = async () => {

        try {
            const accessToken: string | null = await localStorage.getItem("accessToken");

            const newErrors: Errors = {
                email: "",
                password: "",
                repeatPassword: "",
                otp: ""
            }

            if (userInfo?.email === email) {
                await axios.post(
                    `https://bookitcrm.runasp.net/api/v1/account/password-reset?email=${(email)}`, null,
                    {
                        headers: {
                            Accept: "*/*",
                            "Accept-Language": "ka-GE",
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                setIsTimerActive(true);
                setShowOtpInput(true);

            } else {
                newErrors.email = t("auth.errors.valid_email");
            }
            setErrors(newErrors);


        } catch (error) {
            console.log(error);
        };
    };

    const saveUpdatedPassword = async (e: any) => {
        e.preventDefault();

        let newErrors: Errors = { email: "", password: "", repeatPassword: "", otp: "" };

        if (!otp || otp.length < 6) {
            newErrors.otp = "Enter valid code";
        }

        if (password !== repeatPassword) {
            newErrors.repeatPassword = t("auth.errors.password_mismatch");
        }

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some((err) => err !== "");
        if (hasError) return;

        try {
            setLoading(true);

            await axios.post(
                `https://bookitcrm.runasp.net/api/v1/account/password-confirmation`,
                {
                    confirmationCode: otp,
                    newPassword: password,
                    newPasswordConfirm: repeatPassword,
                }
            );

            setEmail("");
            setOtp("");
            setPassword("");
            setRepeatPassword("");
            setShowOtpInput(false);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    return (

        <>
            <div className="min-h-screen flex flex-col bg-[#0F0F0F]">

                <Header />
                <div className="w-full bg-[#0F0F0F] flex justify-center">
                    <div className="text-white flex flex-col w-full max-w-7xl px-4 py-5 md:px-[100px]">

                        <a href="/">
                            <div className="flex items-center gap-3 cursor-pointer mb-6">
                                <div className="w-[42px] h-[42px] border border-[#2b2b2b] rounded-full flex justify-center items-center">
                                    <img src="/images/arrow_left.svg" alt="back" />
                                </div>
                                <h3 className="text-[#a7a7a7]">{t("pages.back")}</h3>
                            </div>
                        </a>

                        <div className="w-full flex justify-start">
                            <div className="w-full border border-[#2b2b2b] rounded-xl p-6 text-white">

                                <div className="mb-6">
                                    <h1 className="text-xl font-semibold">{t("pages.profile_title")}</h1>
                                    <p className="text-[#a7a7a7] text-sm">{t("pages.profile_subtitle")}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[14px] text-white">{t("pages.full_name")}</label>
                                        <input
                                            type="text"
                                            placeholder={t("pages.full_name")}
                                            className="bg-transparent h-[48px] text-[14px] border border-[#2b2b2b] rounded-lg p-3 outline-none focus:border-white transition"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[14px] text-white">
                                            {t("pages.birth_date")}
                                        </label>
                                        <input
                                            type="date"
                                            className="bg-transparent h-[48px] text-[14px] border border-[#2b2b2b] rounded-lg p-3 outline-none focus:border-white transition"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[14px] text-white">{t("pages.email")}</label>
                                        <input
                                            type="email"
                                            placeholder="your@gmail.com"
                                            className="bg-transparent h-[48px] text-[14px] border border-[#2b2b2b] rounded-lg p-3 outline-none focus:border-white transition"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[14px] text-white">{t("pages.mobile_number")}</label>
                                        <input
                                            type="text"
                                            placeholder="555 555 555"
                                            className="bg-transparent h-[48px] text-[14px] border border-[#2b2b2b] rounded-lg px-4 py-3 outline-none focus:border-white transition"
                                        />
                                    </div>

                                </div>

                                <div className="mt-6" onClick={() => setOpenModal(true)}>
                                    <div className="flex items-center justify-between bg-[#22140E] rounded-xl p-4 cursor-pointer hover:bg-[#22120c] transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FFEDE5]">
                                                <img src="/images/lock.svg" alt="lock" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{t("pages.password_section")}</p>
                                                <p className="text-sm text-[#a7a7a7]">{t("pages.password_subtext")}</p>
                                            </div>
                                        </div>

                                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FFEDE5]">
                                            <FaChevronRight color="#F94B00" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button className="bg-[#2b2b2b] text-[#a7a7a7] px-6 py-3 rounded-lg cursor-not-allowed">{t("pages.save_changes")}</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {openModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-70" onClick={() => setOpenModal(false)} >
                        <div className="w-[376px] h-[494px] flex flex-col border border-[#2b2b2b] rounded-xl bg-[#0F0F0F] p-[24px]" onClick={(e) => e.stopPropagation()}>

                            <div className="w-full flex flex-col justify-center items-center">
                                <h3 className="text-white text-[18px] font-bold">
                                    {t("auth.change_password")}
                                </h3>
                                <p className="text-[#a7a7a7] mt-2 text-center">
                                    {t("auth.password_guideline")}
                                </p>
                            </div>

                            <form onSubmit={saveUpdatedPassword} className="flex flex-col gap-4 mt-[32px]">

                                <div>
                                    <label className="text-sm text-gray-300 mb-1 block">
                                        {t("auth.email_label")}
                                    </label>

                                    <div className="relative">
                                        <input placeholder="your@gmail.com" className="w-full h-[48px] rounded-xl text-white px-4 bg-transparent border border-[#2b2b2b]" value={email} onChange={(e) =>setEmail(e.target.value.replace(/\s/g, "")) } />

                                        <button
                                            type="button"
                                            onClick={getCode}
                                            disabled={isTimerActive}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 px-[10px] py-[5px] text-sm bg-[#F94B00] text-white rounded-lg"
                                        >
                                            {isTimerActive ? `${timecounter}s` : t("pages.get_code")}
                                        </button>
                                    </div>

                                    {errors.email && (
                                        <span className="text-red-500 text-sm">{errors.email}</span>
                                    )}
                                </div>

                                {showOtpInput && (
                                    <div>
                                        <InputOTP maxLength={6} onChange={setOtp}>
                                            <InputOTPGroup className="gap-2">
                                                {[0, 1, 2].map((i) => (
                                                    <InputOTPSlot key={i} index={i} className="w-10 h-12 rounded-lg text-lg border border-[#2B2B2B] bg-transparent text-white" />
                                                ))}
                                            </InputOTPGroup>

                                            <InputOTPSeparator className="mx-2 text-gray-500" />

                                            <InputOTPGroup className="gap-2">
                                                {[3, 4, 5].map((i) => (
                                                    <InputOTPSlot key={i} index={i} className="w-10 h-12 rounded-lg text-lg border border-[#2B2B2B] bg-transparent text-white" />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>

                                        {errors.otp && (
                                            <span className="text-red-500 text-sm">{errors.otp}</span>
                                        )}
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        className="w-full h-[48px] rounded-xl text-white px-4 bg-transparent border border-[#2b2b2b]"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showRepeatPassword ? "text" : "password"}
                                        placeholder="********"
                                        className="w-full h-[48px] rounded-xl text-white px-4 bg-transparent border border-[#2b2b2b]"
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
                                    >
                                        {showRepeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-[48px] mt-3 rounded-xl bg-[#F94B00] text-white"
                                    disabled={loading}
                                >
                                    {loading ? "დელოდე..." : t("auth.change_password")}
                                </button>

                            </form>
                        </div>
                    </div>
                )}


                <Footer />
            </div>

        </>
    )
}
