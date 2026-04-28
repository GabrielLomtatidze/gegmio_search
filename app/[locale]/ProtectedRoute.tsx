// components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Props {
    children: React.ReactNode;
    guest?: boolean;
}

export default function ProtectedRoute({ children, guest = false }: Props) {

    const router = useRouter();
    const { locale } = useParams();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (guest) {
            if (token) {
                router.replace(`/${locale}/page/main`);
            } else {
                setAuthorized(true);
            }
        } else {
            if (!token) {
                router.replace(`/`);
            } else {
                setAuthorized(true);
            }
        }
    }, []);

    if (!authorized) return null;

    return <>{children}</>;
}