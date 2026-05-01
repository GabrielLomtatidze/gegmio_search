import { create } from "zustand";
import axios from "axios";

export type SubCategory = {
    id: number;
    name: string;
};

interface SubCategoryStore {
    subCategories: SubCategory[];
    loading: boolean;
    fetchSubCategories: (businessCategoryId: number) => Promise<void>;
    clearSubCategories: () => void;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const useSubCategoryStore = create<SubCategoryStore>((set) => ({
    subCategories: [],
    loading: false,

    fetchSubCategories: async (businessCategoryId) => {
        set({ loading: true });
        try {
            const response = await axios.get<SubCategory[]>(
                `${apiUrl}/api/v1/public/sub-categories/${businessCategoryId}`,
                {
                    headers: { "Accept-Language": "ka-GE" },
                }
            );
            set({ subCategories: response.data, loading: false });
        } catch {
            set({ loading: false });
        }
    },

    clearSubCategories: () => set({ subCategories: [] }),
}));