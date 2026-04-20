"use client";
import { FaChevronRight } from 'react-icons/fa';
import { useTranslations } from "next-intl";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { useUserStore } from '@/zustand/User/profileStore';
import axios from 'axios';
import { Spinner } from '@/components/ui/spinner';

interface PasswordErrors {
    password: string;
    repeatPassword: string;
}

interface ProfileForm {
    firstName: string;
    lastName: string;
    birthDate: string;
    phoneNumber: string;
    email: string;
}

interface ProfileErrors {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
}

export default function Profile() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const t = useTranslations();
    const { userInfo } = useUserStore();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [repeatNewPassword, setRepeatNewPassword] = useState<string>("");
    const [showRepeatNewPassword, setShowRepeatNewPassword] = useState<boolean>(false);
    const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
    const [profileLoading, setProfileLoading] = useState<boolean>(false);

    const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({ password: "", repeatPassword: "" });

    const [profileForm, setProfileForm] = useState<ProfileForm>({
        firstName: "",
        lastName: "",
        birthDate: "",
        phoneNumber: "",
        email: "",
    });

    const [profileErrors, setProfileErrors] = useState<ProfileErrors>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
    });

    useEffect(() => {
        if (userInfo) {
            setProfileForm({
                firstName: userInfo.firstName || "",
                lastName: userInfo.lastName || "",
                birthDate: userInfo.birthDate ? userInfo.birthDate.split("T")[0] : "",
                phoneNumber: userInfo.phoneNumber || "",
                email: userInfo.email || "",
            });
        }
    }, [userInfo]);

    const handleProfileChange = (field: keyof ProfileForm, value: string) => {
        setProfileForm(prev => ({ ...prev, [field]: value }));
        setProfileErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validateProfile = (): boolean => {
        const newErrors: ProfileErrors = { firstName: "", lastName: "", phoneNumber: "", email: "" };

        if (!profileForm.firstName.trim()) newErrors.firstName = t("auth.errors.first_name_required");
        if (profileForm.firstName.length > 50) newErrors.firstName = t("auth.errors.first_name_max_50");
        if (!profileForm.lastName.trim()) newErrors.lastName = t("auth.errors.last_name_required");
        if (profileForm.lastName.length > 50) newErrors.lastName = t("auth.errors.last_name_max_50");
        if (!profileForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
            newErrors.email = t("auth.errors.valid_email");
        }
        if (profileForm.phoneNumber && !/^\+\d{8,15}$/.test(profileForm.phoneNumber)) {
            newErrors.phoneNumber = t("auth.errors.valid_phone");
        }

        setProfileErrors(newErrors);
        return !Object.values(newErrors).some(err => err !== "");
    };

    const saveProfile = async (e: any) => {
        e.preventDefault();
        if (!validateProfile()) return;

        try {
            setProfileLoading(true);
            const accessToken = localStorage.getItem("accessToken");

            await axios.post(
                `${apiUrl}/api/v1/account/edit-profile`,
                {
                    firstName: profileForm.firstName,
                    lastName: profileForm.lastName,
                    birthDate: profileForm.birthDate ? new Date(profileForm.birthDate).toISOString() : null,
                    phoneNumber: profileForm.phoneNumber,
                    email: profileForm.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }
            );

        } catch (error: any) {
            if (error?.response?.status === 400) {
                setProfileErrors(prev => ({ ...prev, email: t("auth.errors.email_used") }));
            }
        } finally {
            setProfileLoading(false);
        }
    };

    const saveUpdatedPassword = async (e: any) => {
        e.preventDefault();

        const newErrors: PasswordErrors = { password: "", repeatPassword: "" };

        if (newPassword !== repeatNewPassword) {
            newErrors.repeatPassword = t("auth.errors.password_mismatch");
        }

        setPasswordErrors(newErrors);
        if (Object.values(newErrors).some(err => err !== "")) return;

        try {
            setPasswordLoading(true);
            const accessToken = localStorage.getItem("accessToken");

            await axios.post(
                `${apiUrl}/api/v1/account/change-password`,
                {
                    oldPassword,
                    newPassword,
                    newPasswordConfirm: repeatNewPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }
            );

            setOldPassword("");
            setNewPassword("");
            setRepeatNewPassword("");
            setOpenModal(false);

        } catch (error: any) {
            if (error?.response?.status === 500) {
                setPasswordErrors(prev => ({
                    ...prev,
                    password: error?.response?.data?.detail || t("auth.errors.wrong_old_password")
                }));
            }
        } finally {
            setPasswordLoading(false);
        }
    };


    const disabledPassowrdChange = passwordLoading || !oldPassword || !newPassword || !repeatNewPassword

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

                                <form onSubmit={saveProfile}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        <div className="flex flex-col gap-2">
                                            <label className="text-[14px] text-white">{t("auth.first_name")}</label>
                                            <input
                                                type="text"
                                                placeholder={t("auth.first_name")}
                                                value={profileForm.firstName}
                                                onChange={(e) => handleProfileChange("firstName", e.target.value)}
                                                className="bg-transparent h-[48px] text-[14px] border border-[#2b2b2b] rounded-lg p-3 outline-none focus:border-white transition"
                                            />
                                            {profileErrors.firstName && <span className="text-red-500 text-sm">{profileErrors.firstName}</span>}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-[14px] text-white">{t("auth.last_name")}</label>
                                            <input
                                                type="text"
                                                placeholder={t("auth.last_name")}
                                                value={profileForm.lastName}
                                                onChange={(e) => handleProfileChange("lastName", e.target.value)}
                                                className="bg-transparent h-[48px] text-[14px] border border-[#2b2b2b] rounded-lg p-3 outline-none focus:border-white transition"
                                            />
                                            {profileErrors.lastName && <span className="text-red-500 text-sm">{profileErrors.lastName}</span>}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-[14px] text-white">{t("auth.birth_date")}</label>
                                            <input
                                                type="date"
                                                value={profileForm.birthDate}
                                                onChange={(e) => handleProfileChange("birthDate", e.target.value)}
                                                className="bg-transparent h-[48px] text-[14px] border border-[#2b2b2b] rounded-lg p-3 outline-none focus:border-white transition"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-[14px] text-white">{t("auth.email_label")}</label>
                                            <input
                                                type="email"
                                                placeholder="your@gmail.com"
                                                value={profileForm.email}
                                                onChange={(e) => handleProfileChange("email", e.target.value)}
                                                className="bg-transparent h-[48px] text-[14px] border border-[#2b2b2b] rounded-lg p-3 outline-none focus:border-white transition"
                                            />
                                            {profileErrors.email && <span className="text-red-500 text-sm">{profileErrors.email}</span>}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-[14px] text-white">{t("pages.mobile_number")}</label>
                                            <input
                                                type="text"
                                                placeholder="+99555555555"
                                                value={profileForm.phoneNumber}
                                                onChange={(e) => handleProfileChange("phoneNumber", e.target.value)}
                                                className="bg-transparent h-[48px] text-[14px] border border-[#2b2b2b] rounded-lg px-4 py-3 outline-none focus:border-white transition"
                                            />
                                            {profileErrors.phoneNumber && <span className="text-red-500 text-sm">{profileErrors.phoneNumber}</span>}
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
                                        <button type="submit" disabled={profileLoading} className="bg-[#F94B00] text-white px-6 py-3 rounded-lg disabled:opacity-50 text-white disabled:cursor-not-allowed transition cursor-pointer hover:bg-[#C73C00]"  >
                                            {profileLoading ? <Spinner /> : t("pages.save_changes")}
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>

                {openModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpenModal(false)}>
                        <div className="w-[390px] flex flex-col border border-[#2b2b2b] rounded-xl bg-[#0F0F0F] p-[24px]" onClick={(e) => e.stopPropagation()}>

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
                                    <label className="text-sm text-white mb-1 block">
                                        {t("auth.old_password")}
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="********"
                                        className="w-full h-[48px] rounded-xl text-white px-4 bg-transparent border border-[#2b2b2b]"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value.replace(/\s/g, ""))}
                                    />
                                    {passwordErrors.password && <p className="text-red-500 mt-[5px]">{passwordErrors.password}</p>}
                                </div>

                                <div className="relative">
                                    <label className="text-sm text-white mb-1 block">
                                        {t("auth.password_label")}
                                    </label>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="********"
                                        className="w-full h-[48px] rounded-xl text-white px-4 bg-transparent border border-[#2b2b2b]"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-[38px] text-white">
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <label className="text-sm text-white mb-1 block">
                                        {t("auth.repeat_password")}
                                    </label>
                                    <input
                                        type={showRepeatNewPassword ? "text" : "password"}
                                        placeholder="********"
                                        className="w-full h-[48px] rounded-xl text-white px-4 bg-transparent border border-[#2b2b2b]"
                                        value={repeatNewPassword}
                                        onChange={(e) => setRepeatNewPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setShowRepeatNewPassword(!showRepeatNewPassword)} className="absolute right-4 top-[38px] text-white">
                                        {showRepeatNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                    {passwordErrors.repeatPassword && (
                                        <span className="text-red-500 text-sm">{passwordErrors.repeatPassword}</span>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-[48px] mt-3 flex justify-center items-center rounded-xl bg-[#F94B00] text-white transition hover:bg-[#C73C00] hover:cursor-pointer disabled:bg-[#464646] disabled:text-[#A7A7A7] disabled:opacity-100 disabled:cursor-not-allowed"
                                    disabled={disabledPassowrdChange}  >
                                    {passwordLoading ? <Spinner /> : t("auth.change_password")}
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