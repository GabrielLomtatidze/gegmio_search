"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useAuthPositionStore } from "@/zustand/User/userPositionStore";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

interface Errors {
    email: string;
    password: string;
}

export default function Login() {

    const router = useRouter();
    const t = useTranslations();
    const { setAuthenticated } = useAuthPositionStore()

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({ email: "", password: "" });

    const validateInputs = () => {
        const newErrors: Errors = { email: "", password: "" };

        if (!email || email.trim().length < 5) {
            newErrors.email = t("auth.errors.valid_email");
        }

        if (!password || password.length < 6) {
            newErrors.password = t("auth.errors.valid_password");
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((err) => err === "");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateInputs()) return;
        if (loading) return;

        setLoading(true);

        try {
            const response = await axios.post(`https://bookitcrm.runasp.net/api/v1/account/login`, {
                email,
                password,
            });

            const { accessToken } = response.data;

            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);

                setAuthenticated(true);

                router.replace("/");
            } else {
                console.log("No access token returned");
            }
        } catch (error: any) {
            if (error.response?.data?.detail) {
                setErrors({ ...errors, password: t("auth.errors.wrong_email_or_password") });
            } else {
                console.error("Unexpected error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[376px] p-6 rounded-2xl bg-[rgba(20,20,20,0.75)] backdrop-blur-xl border border-[#2B2B2B] shadow-2xl text-white">
            <h1 className="text-center text-[20px] font-semibold">{t("auth.login_title")}</h1>
            <p className="text-center text-sm text-gray-400 mt-1 mb-6">{t("auth.login_subtitle")}</p>

            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                <div>
                    <label className="text-sm text-gray-300 mb-1 block">{t("auth.email_label")}</label>
                    <input
                        placeholder="your@gmail.com"
                        className="w-full h-[52px] rounded-xl px-4 bg-transparent border border-[#2b2b2b] focus:border-[#F94B00] focus:outline-none transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm text-gray-300">{t("auth.password_label")}</label>
                        <span className="text-sm text-[#F94B00] cursor-pointer hover:underline">{t("auth.forgot_password")}</span>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            className="w-full h-[52px] rounded-xl px-4 bg-transparent border border-[#2b2b2b] focus:border-[#F94B00] focus:outline-none transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white" >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <input
                        type="checkbox"
                        className="w-5 h-5 accent-[#F94B00] rounded-xl"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                    />
                    <span className="text-sm text-gray-300">{t("auth.remember_me")}</span>
                </div>

                <button type="submit" className="w-full h-[52px] mt-3 rounded-xl bg-[#F94B00] flex items-center justify-center font-medium cursor-pointer" disabled={loading}>
                    {loading ? <Spinner /> : t("auth.login_button")}
                </button>

                <label className="w-full flex justify-center items-center gap-2 text-sm mt-2">
                    <Link href="/auth/registration">
                        <span className="text-[#F94B00] underline cursor-pointer">
                            {t("auth.create_profile")}
                        </span>
                    </Link>
                </label>
            </form>
        </div>
    );
}