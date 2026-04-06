import { useTranslations } from "next-intl";


export default function ErrorPage() {

    const t = useTranslations();

    return (

        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0F0F] text-white px-4">

            <div className="absolute top-5 left-0 w-full max-w-7xl px-4 md:px-[100px]">
                <a href="/" className="flex items-center gap-3 w-fit">
                    <div className="w-[42px] h-[42px] border border-[#2b2b2b] rounded-full flex justify-center items-center">
                        <img src="/images/arrow_left.svg" alt="back" />
                    </div>
                    <h3 className="text-[#a7a7a7]">{t("pages.back")}</h3>
                </a>
            </div>

            <div className="flex flex-col items-center text-center gap-6">

                <img src="/images/error_image.svg" alt="404 error" className="max-w-[320px] md:max-w-[400px]"/>

                <p className="text-[#a7a7a7] text-sm md:text-base max-w-md">{t("pages.error_message")}</p>

                <a href="/">
                    <button className="bg-[#F94B00] hover:bg-orange-600 transition px-[16px] py-[12px] rounded-xl font-medium">
                        {t("pages.main_page")}
                    </button>
                </a>
            </div>
        </div>
    );
}