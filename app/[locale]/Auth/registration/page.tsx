"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/User/authStore";
import { redirect } from "next/navigation"
import Link from "next/link";


type Gender = {
  id: number;
  name: string;
};

type Errors = {
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
  email: string;
  password: string;
  repeatPass: string;
  checkbox: string;
};

export default function RegistrationPage() {

  const t = useTranslations();
  const router = useRouter();
  const { setUserEmail, setUserPassword } = useAuthStore()

  const onlyLettersEnter = /^[a-zA-Zა-ჰ\s]+$/;

  const [genderOptions, setGenderOptions] = useState<Gender[]>([]);
  const [selectedGenderId, setSelectedGenderId] = useState<number | null>(1);

  const [showPass, setShowPass] = useState(false);
  const [showRepeatPass, setShowRepeatPass] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDay] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPass, setRepeatPass] = useState("");

  const [isChecked, setIsChecked] = useState(true);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Errors>({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    email: "",
    password: "",
    repeatPass: "",
    checkbox: "",
  });

  useEffect(() => {
    const getGender = async () => {
      try {
        const res = await axios.get(`https://bookitcrm.runasp.net/api/v1/account/gender-dropdown`);
        setGenderOptions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getGender();
  }, []);

  const sendUserData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const newErrors: Errors = {
      firstName: "",
      lastName: "",
      gender: "",
      age: "",
      email: "",
      password: "",
      repeatPass: "",
      checkbox: "",
    };

    if (!firstName) newErrors.firstName = t("auth.errors.first_name_required");
    else if (!onlyLettersEnter.test(firstName)) newErrors.firstName = t("auth.errors.only_letters");
    else if (firstName.length >= 50) newErrors.firstName = t("auth.errors.first_name_max_50");

    if (!lastName) newErrors.lastName = "Last name required";
    else if (!onlyLettersEnter.test(lastName)) newErrors.lastName = t("auth.errors.only_letters");
    else if (lastName.length >= 50) newErrors.lastName = t("auth.errors.last_name_max_50");

    if (!birthDate) {
      newErrors.age = t("auth.errors.age_required");
    } else {
      const today = new Date();
      const bd = new Date(birthDate);

      const age = today.getFullYear() - bd.getFullYear();
      const m = today.getMonth() - bd.getMonth();
      const d = today.getDate() - bd.getDate();

      if (age < 18 || (age === 18 && (m < 0 || (m === 0 && d < 0)))) {
        newErrors.age = t("auth.errors.age_min_18");
      }
    }

    if (
      !email ||
      email.length < 5 ||
      !email.includes("@") ||
      !email.includes(".") ||
      /\s/.test(email)
    ) {
      newErrors.email = t("auth.errors.valid_email");
    }

    if (!password) newErrors.password = t("auth.errors.password_required");
    else if (password.length < 8 || password.length > 64)
      newErrors.password = t("auth.errors.password_length");
    else if (!/[A-Z]/.test(password))
      newErrors.password = t("auth.errors.password_uppercase");
    else if (!/[a-z]/.test(password))
      newErrors.password = t("auth.errors.password_lowercase");
    else if (!/[0-9]/.test(password))
      newErrors.password = t("auth.errors.password_digit");
    else if (!/[^\w\s]/.test(password))
      newErrors.password = t("auth.errors.password_symbol");
    else if (/\s/.test(password))
      newErrors.password = t("auth.errors.password_whitespace");

    if (repeatPass !== password)
      newErrors.repeatPass = "Password not match";

    if (!isChecked)
      newErrors.checkbox = "Checkbox required";

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (hasError) return;

    setLoading(true);

    try {
      await axios.post(
        `https://bookitcrm.runasp.net/api/v1/account/register`,
        {
          firstName,
          lastName,
          birthDate: new Date(birthDate).toISOString(),
          email,
          genderId: selectedGenderId,
          password,
        },
        {
          headers: {
            "Accept-Language": "en-EN",
            "Content-Type": "application/json",
          },
        }
      );

      setUserEmail(email);
      setUserPassword(password);
      router.push("/auth/otp");
    } catch (error: any) {
      if (error.response?.data?.detail) {
        setErrors((prev) => ({
          ...prev,
          email: t("auth.errors.email_used"),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[400px] max-w-full p-6 rounded-2xl bg-[rgba(20,20,20,0.75)] backdrop-blur-xl border border-[#2B2B2B] shadow-2xl text-white overflow-auto">
      <h1 className="text-center text-[20px] font-semibold">
        {t("auth.create_profile")}
      </h1>

      <p className="text-center text-sm text-gray-400 mt-1 mb-5">
        {t("auth.subtitle")}
      </p>

      <form className="flex flex-col gap-4" onSubmit={sendUserData}>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm mb-1 block">{t("auth.first_name")}</label>
            <input
              className="w-full h-[48px] rounded-xl px-4 bg-transparent border border-[#2b2b2b]"
              onChange={(e) => setFirstName(e.target.value.replace(/\s/g, ""))}
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>

          <div>
            <label className="text-sm mb-1 block">{t("auth.last_name")}</label>
            <input
              className="w-full h-[48px] rounded-xl px-4 bg-transparent border border-[#2b2b2b]"
              onChange={(e) => setLastName(e.target.value.replace(/\s/g, ""))}
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm mb-1 block">{t("auth.birth_date")}</label>
            <input
              type="date"
              className="w-full h-[48px] rounded-xl px-4 bg-transparent border border-[#2b2b2b]"
              onChange={(e) => setBirthDay(e.target.value)}
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          <div>
            <label className="text-sm mb-1 block">{t("auth.gender")}</label>
            <select
              className="w-full h-[48px] rounded-xl px-4  bg-[rgba(20,20,20,0.75)] backdrop-blur-xl border border-[#2b2b2b] "
              onChange={(e) => setSelectedGenderId(Number(e.target.value))}
            >
              <option value="">{t("auth.select_gender")}</option>
              {genderOptions.map((g) => (
                <option key={g.id} value={g.id} >
                  {g.name}
                </option>
              ))}
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>
        </div>

        <div>
          <label className="text-sm mb-1 block">{t("auth.email_label")}</label>
          <input
            className="w-full h-[48px] rounded-xl px-4 bg-transparent border border-[#2b2b2b]"
            onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm mb-1 block">{t("auth.password_label")}</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="w-full h-[48px] rounded-xl px-4 bg-transparent border border-[#2b2b2b]"
              onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div>
          <label className="text-sm mb-1 block">{t("auth.repeat_password")}</label>
          <div className="relative">
            <input
              type={showRepeatPass ? "text" : "password"}
              className="w-full h-[48px] rounded-xl px-4 bg-transparent border border-[#2b2b2b]"
              onChange={(e) => setRepeatPass(e.target.value.replace(/\s/g, ""))}
            />
            <button
              type="button"
              onClick={() => setShowRepeatPass(!showRepeatPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showRepeatPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.repeatPass && <p className="text-red-500 text-sm">{errors.repeatPass}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm mt-2">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="accent-[#F94B00]"
          />
          {t("auth.agree")}{" "}
          <span className="text-[#F94B00] underline cursor-pointer">
            {t("auth.terms")}
          </span>
        </label>
        {errors.checkbox && <p className="text-red-500 text-sm">{errors.checkbox}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-3 h-[52px] rounded-xl bg-[#F94B00] font-medium"
        >
          {loading ? t("auth.loading") : t("auth.create_account")}
        </button>

        <label className="w-full flex justify-center items-center gap-2 text-sm mt-2">
          {t("auth.login_button")}
          <Link href="/auth/login">
            <span className="text-[#F94B00] underline cursor-pointer">
              {t("auth.existing_account")}
            </span>
          </Link>
        </label>
      </form>
    </div>
  );
}