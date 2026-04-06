import { create } from "zustand";
import axios from "axios";


interface CurrentServicesState {
    currentServices: any[] | null;
    loadingServices: boolean;
    fetchServices: (currentBusinessId: string, filterId?: number | null, search?: string) => Promise<void>;
}

export const useCurrentServicesStore = create<CurrentServicesState>((set) => ({
    currentServices: null,
    loadingServices: false,

    fetchServices: async (currentBusinessId: string, filterId?: number | null, search?: string) => {
        set({ loadingServices: true });
        try {
            const accessToken = await localStorage.getItem("accessToken");
            const response = await axios.get(`https://bookitcrm.runasp.net/api/v1/public/services/${currentBusinessId}`, {
                params: {
                    categoryId: filterId ?? undefined,
                    filterKey: search || undefined
                }, ...(accessToken && {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
            });
            set({ currentServices: response.data, loadingServices: false });
        } catch (error) {
            console.error("error fetching servicee: ", error);
            set({ loadingServices: false });
        }
    },
}));