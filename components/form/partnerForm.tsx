"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
    id: number;
    name: string;
}

interface Errors {
    name?: string;
    category?: string;
    email?: string;
}

export default function PartnerForm() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const t = useTranslations();

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [fullName, setFullName] = useState<string>("");
    const [businesssName, setBusinessName] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const [num, setNum] = useState<string>("+995");

    const handleChangeNum = (text: string) => {
        if (!text.startsWith("+995")) {
            text = "+995";
        }
        const digits = text.slice(4).replace(/\D/g, "");
        setNum("+995" + digits);
    };

    const [errors, setErrors] = useState<Errors>({});
    const [success, setSuccess] = useState(false);

    const getBusinessCategories = async (): Promise<void> => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/v1/public/business-categories`
            );
            setCategories(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBusinessCategories();
    }, []);

    const validate = (): boolean => {
        let newErrors: Errors = {};

        if (!businesssName.trim()) {
            newErrors.name = "Business name is required";
        }

        if (selectedCategoryId === 0) {
            newErrors.category = "Please select a category";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const selectedCategory = categories.find(
            (c) => c.id === selectedCategoryId
        );

        try {
            await axios.post(`${apiUrl}/api/v1/businessapplication`, {
                businessName: businesssName,
                businessCategory: selectedCategory?.name || "",
                ownerFullName: fullName,
                ownerEmail: email,
                ownerPhone: num,
                region: "Tbilisi"
            });

            setSuccess(true);

            setFullName("");
            setBusinessName("");
            setEmail("");
            setNum("+995");
            setSelectedCategoryId(0);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div
                className="w-[376px] flex flex-col justify-center border border-[#2b2b2b] rounded-xl bg-[#0F0F0F] p-[24px]"
                onClick={(e) => e.stopPropagation()}
            >
                {success ? (
                    <div className="w-full flex justify-center">
                        <div className="px-[24px] py-[12px] bg-[#E9FAEF] flex gap-[6px] rounded-[12px] items-center">
                            <img src="/images/green_mark.svg" alt="green_mark" />
                            <h3 className="text-[#008330]">
                                {t("components.request_sent_successfully")}
                            </h3>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-full flex justify-center">
                            <h1 className="text-[18px] text-bold text-white">
                                {t("components.become_partner")}
                            </h1>
                        </div>

                        <h5 className="text-[14px] text-[#a7a7a7] text-center mt-[8px]">
                            {t("components.send_contact_info")}
                        </h5>

                        <form
                            className="flex flex-col gap-4 mt-[24px]"
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <label className="text-sm text-white mb-1 block">
                                    {t("pages.full_name")}
                                </label>
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder={t("pages.full_name")}
                                    className="w-full h-[48px] rounded-xl px-4 bg-transparent border border-[#2b2b2b] focus:border-[#F94B00] text-[#a7a7a7] focus:outline-none transition"
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-sm">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-white mb-1 block">
                                    {t("components.business_name")}
                                </label>
                                <input
                                    value={businesssName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder={t("components.enter_business_name")}
                                    className="w-full h-[48px] rounded-xl px-4 bg-transparent border border-[#2b2b2b] focus:border-[#F94B00] text-[#a7a7a7] focus:outline-none transition"
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-sm">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-white mb-1 block">
                                    {t("components.business_category")}
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedCategoryId}
                                        onChange={(e) =>
                                            setSelectedCategoryId(Number(e.target.value))
                                        }
                                        className="border border-[#2b2b2b] bg-[#0f0f0f] py-[10px] px-[12px] rounded-xl w-full text-white appearance-none"
                                    >
                                        <option value={0}>
                                            {t("components.select_category")}
                                        </option>
                                        {categories.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[12px] text-white">
                                        <img
                                            src="/images/arrow_down.svg"
                                            alt="arrow_down"
                                        />
                                    </div>
                                </div>

                                {errors.category && (
                                    <span className="text-red-500 text-sm">
                                        {errors.category}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-white mb-1 block">
                                    Email
                                </label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    className="w-full h-[48px] rounded-xl px-4 bg-transparent border border-[#2b2b2b] focus:border-[#F94B00] text-[#a7a7a7] focus:outline-none transition"
                                />
                                {errors.email && (
                                    <span className="text-red-500 text-sm">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-white mb-1 block">
                                    {t("pages.mobile_number")}
                                </label>
                                <input
                                    value={num}
                                    onChange={(e) =>
                                        handleChangeNum(e.target.value)
                                    }
                                    placeholder={t("pages.mobile_number")}
                                    className="w-full h-[48px] rounded-xl px-4 bg-transparent border border-[#2b2b2b] focus:border-[#F94B00] text-[#a7a7a7] focus:outline-none transition"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full h-[52px] mt-3 rounded-xl bg-[#F94B00] text-white flex items-center justify-center font-medium cursor-pointer"
                            >
                                {t("components.send")}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </>
    );
}