import { create } from "zustand";
import axios from "axios";

interface BusinessCategory {
  id: number;
  name: string;
}

interface BusinessCategoriesState {
  categories: BusinessCategory[] | null;
  loadingCategories: boolean;
  fetchCategories: () => Promise<void>;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const useBusinessCategoriesStore = create<BusinessCategoriesState>((set) => ({
  categories: null,
  loadingCategories: false,

  fetchCategories: async () => {
    set({ loadingCategories: true });

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.get(
        `${apiUrl}/api/v1/public/business-categories`,
        {
          ...(accessToken && {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        }
      );

      set({
        categories: response.data,
        loadingCategories: false,
      });
    } catch (error) {
      console.error("Error fetching business categories:", error);
      set({ loadingCategories: false });
    }
  },
}));