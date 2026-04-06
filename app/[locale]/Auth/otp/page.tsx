"use client";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";
import { useAuthStore } from "@/zustand/User/authStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useAuthPositionStore } from "@/zustand/User/userPositionStore";


type Errors = {
    count: string,
    valid: string
}

export default function Otp() {

    const t = useTranslations();
    const { email, password, clear } = useAuthStore();
    const router = useRouter();
    const setAuthenticated = useAuthPositionStore((state) => state.setAuthenticated);
    
    const [otp, setOtp] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({ count: "", valid: "" });

    const finish = async () => {
        if (loading) return;
        setLoading(true);

        try {
            if (otp?.length !== 6) {
                setErrors({ ...errors, count: t("auth.errors.code_6digits") });
                return;
            }

            console.log(otp);


            const confirmResponse = await axios.get(`https://bookitcrm.runasp.net/api/v1/account/confirm-email?ConfirmationCode=${otp}`);

            const loginResponse = await axios.post(`https://bookitcrm.runasp.net/api/v1/account/login`, {
                email,
                phoneNumber: null,
                password
            });

            const { accessToken } = loginResponse.data;

            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
                console.log("Tokeni sheinaxa!");
            }

            clear();

            setAuthenticated(true);


            router.replace("/");

        } catch (err: any) {
            setErrors({ ...errors, valid: err?.response?.data?.detail || "Error OTP verification" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[376px] h-[302px] p-6 rounded-2xl bg-[rgba(20,20,20,0.75)] backdrop-blur-xl border border-[#2B2B2B] shadow-2xl text-white flex flex-col items-center justify-between">
            <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">{t("auth.verification")}</h2>
                <p className="text-[12px] text-[#a7a7a7]">
                    {t("auth.otp_sent")}
                </p>
            </div>

            <InputOTP maxLength={6} onChange={setOtp}>
                <InputOTPGroup className="gap-2">
                    {[0, 1, 2].map((i) => (
                        <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-10 h-12 rounded-lg text-lg border border-[#2B2B2B] bg-transparent text-white outline-none focus:ring-0 data-[active=true]:border-[#F94B00] data-[active=true]:bg-[#F94B00]/10 data-[filled=true]:bg-[#F94B00]/20 data-[filled=true]:text-white" />
                    ))}
                </InputOTPGroup>

                <InputOTPSeparator className="mx-2 text-gray-500" />

                <InputOTPGroup className="gap-2">
                    {[3, 4, 5].map((i) => (
                        <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-10 h-12 rounded-lg text-lg border border-[#2B2B2B] bg-transparent text-white outline-none focus:ring-0 data-[active=true]:border-[#F94B00] data-[active=true]:bg-[#F94B00]/10 data-[filled=true]:bg-[#F94B00]/20 data-[filled=true]:text-white" />
                    ))}
                </InputOTPGroup>
            </InputOTP>

            <button className="w-full h-12 rounded-xl bg-[#F94B00] transition font-medium cursor-pointer" onClick={finish} >
                {t("auth.register_button")}
            </button>

            {errors.count && <p className="text-red-500 text-sm">{errors.count}</p>}
            {errors.valid && <p className="text-red-500 text-sm">{errors.valid}</p>}

            <p className="text-[14px] text-white">
                {t("auth.resend_question")}{" "}
                <span className="text-[#F94B00] cursor-pointer hover:underline">
                    {t("auth.resend")}
                </span>
            </p>
        </div>
    );
}