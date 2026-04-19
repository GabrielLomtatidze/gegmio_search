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
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [errors, setErrors] = useState<Errors>({});

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

        if (!name.trim()) {
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

    //   const submit = (e: React.FormEvent): void => {
    //     e.preventDefault();

    //     if (!validate()) return;

    //     const payload = {
    //       name,
    //       category_id: selectedCategoryId,
    //       email,
    //     };

    //     console.log("SUBMIT DATA:", payload);
    //   };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className="w-[376px] flex flex-col justify-center border border-[#2b2b2b] rounded-xl bg-[#0F0F0F] p-[24px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full flex justify-center">
                    <h1 className="text-[18px] text-bold text-white">
                        {t("components.become_partner")}
                    </h1>
                </div>

                <h5 className="text-[14px] text-[#a7a7a7] text-center mt-[8px]">
                    {t("components.send_contact_info")}
                </h5>

                <form className="flex flex-col gap-4 mt-[24px]" >
                    <div>
                        <label className="text-sm text-white mb-1 block">
                            {t("components.business_name")}
                        </label>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("components.enter_business_name")} className="w-full h-[48px] rounded-xl px-4 bg-transparent border border-[#2b2b2b] focus:border-[#F94B00] text-[#a7a7a7] focus:outline-none transition" />
                        {errors.name && (
                            <span className="text-red-500 text-sm">{errors.name}</span>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-white mb-1 block">
                            {t("components.business_category")}
                        </label>
                        <div className="relative">

                            <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(Number(e.target.value))} className="border border-[#2b2b2b] bg-[#0f0f0f] py-[10px] px-[12px] rounded-xl w-full text-white appearance-none"          >
                                <option value={0}>{t("components.select_category")}</option>
                                {categories.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[12px] text-white">
                                <img src="/images/arrow_down.svg" alt="arrow_down" />
                            </div>
                        </div>


                        {errors.category && (
                            <span className="text-red-500 text-sm">
                                {errors.category}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-white mb-1 block">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            className="w-full h-[48px] rounded-xl px-4 bg-transparent border border-[#2b2b2b] focus:border-[#F94B00] text-[#a7a7a7] focus:outline-none transition"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">{errors.email}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full h-[52px] mt-3 rounded-xl bg-[#F94B00] text-white flex items-center justify-center font-medium cursor-pointer"
                    >
                        {t("components.send")}
                    </button>
                </form>
            </div>
        </div>
    );
}