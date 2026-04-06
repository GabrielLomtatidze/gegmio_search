"use client";
import { useEffect } from "react";
import axios from "axios";
import { useAuthPositionStore } from "@/zustand/User/userPositionStore";

export default function ClientAxiosHandler({ locale }: { locale: string }) {

    const { setAuthenticated } = useAuthPositionStore();
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    setAuthenticated(false);
                    window.location.href = `/${locale}/auth/login`;
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [locale]);

    return null;
}