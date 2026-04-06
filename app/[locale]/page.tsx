"use client";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useEffect } from "react";
import Main from "./main/page";
import { useUserStore } from "@/zustand/User/profileStore";


// wogofaj349@fftube.com

export default function Home() {
  

  return (
    <div className="bg-[#0F0F0F] min-h-screen">
      <Header />
          <Main />
      < Footer />
    </div>
  );
}
