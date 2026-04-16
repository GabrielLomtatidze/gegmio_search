import { useTranslations } from "next-intl";


export default function Footer() {

    const t = useTranslations();

    return (

        <footer className="bg-[#0F0F0F] w-full flex border-t-2 border-t-[#242424] justify-center">
            <div className="footer_wrapper text-white grid grid-cols-1 justify-between max-w-7xl w-full m-auto px-4 md:px-[100px] py-11 lg:grid-cols-2 gap-8">

                <div className="flex-1 flex flex-col gap-6">
                    <div className="logo font-bold text-2xl">
                        <img src="/images/logo.svg" alt="Gegmio" />
                    </div>

                    <p className="footer_text mt-2.5 text-[#A7A7A7]">
                        {t("components.footer_description")}
                    </p>

                    <div className="h-15 flex gap-5">
                        <a href="https://www.facebook.com/profile.php?id=61583853083725" target="_blank" className="group w-15 h-15 border-3 border-[#2b2b2b] rounded-full flex items-center justify-center relative overflow-hidden">
                            <img src="/images/facebook-big.svg" alt="Facebook" className="absolute opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                            <img src="/images/fill_facebook_icon.svg" alt="Facebook Hover" className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </a>

                        <a href="#" className="group w-15 h-15 border-3 border-[#2b2b2b] rounded-full flex items-center justify-center relative overflow-hidden">
                            <img src="/images/tiktok-big.svg" alt="tiktok" className="absolute opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                            <img src="/images/fill_tiktok_icon.svg" alt="tiktok" className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </a>

                        <a href="#" className="group w-15 h-15 border-3 border-[#2b2b2b] rounded-full flex items-center justify-center relative overflow-hidden">
                            <img src="/images/Linkedin.svg" alt="linkedin" className="absolute opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                            <img src="/images/fill_linkedin_icon.svg" alt="linkedin" className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </a>
                    </div>
                </div>

                <div className="links flex lg:justify-end gap-11">

                    <nav className="nav flex">
                        <ul className="font-semibold text-sm flex flex-col gap-3">
                            <li><a href="#">{t("components.company")}</a></li>
                            <li className="mt-2"><a href="#" className="text-[#A7A7A7] font-extralight">{t("components.home")}</a></li>
                            <li className="mt-2"><a href="#about" className="text-[#A7A7A7] font-extralight">{t("components.about_us")}</a></li>
                            <li className="mt-2"><a href="#contact" className="text-[#A7A7A7] font-extralight">{t("components.contact")}</a></li>
                        </ul>
                    </nav>

                    <nav className="nav flex">
                        <ul className="gap-3 flex flex-col font-semibold text-sm">
                            <li><a href="#">{t("components.information")}</a></li>
                            <li className="mt-2">
                                <a href="/page/privacypolicy" className="text-[#A7A7A7] font-extralight">
                                    {t("components.privacy_policy")}
                                </a>
                            </li>
                            <li className="mt-2">
                                <a href="/terms" className="text-[#A7A7A7] font-extralight">
                                    {t("components.terms_conditions")}
                                </a>
                            </li>
                            <li className="mt-2">
                                <a href="#about" className="text-[#A7A7A7] font-extralight">
                                    info@gegmio.com
                                </a>
                            </li>
                            <li className="mt-2">
                                <a href="#contact" className="text-[#A7A7A7] font-extralight">
                                    568-90-24-10
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>

    )
}
