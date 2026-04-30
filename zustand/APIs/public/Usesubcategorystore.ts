import { create } from "zustand";
import axios from "axios";


interface SubCategoryState {
    subCategories: any[] | null;
    loadingSubCategories: boolean;
    fetchSubCategories: (businessCategoryId: number) => Promise<void>;
    clearSubCategories: () => void;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const useSubCategoryStore = create<SubCategoryState>((set) => ({
    subCategories: null,
    loadingSubCategories: false,

    fetchSubCategories: async (businessCategoryId: number) => {
        set({ loadingSubCategories: true });
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.get(`${apiUrl}/api/v1/public/sub-categories/${businessCategoryId}`, {
                ...(accessToken && {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
            });
            set({ subCategories: response.data, loadingSubCategories: false });
        } catch (error) {
            console.error("error fetching sub-categories: ", error);
            set({ loadingSubCategories: false });
        }
    },

    clearSubCategories: () => set({ subCategories: null }),
}));