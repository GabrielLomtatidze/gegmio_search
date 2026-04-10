import { create } from "zustand";
import axios from "axios";

type District = {
  id: number;
  name: string;
};

type DistrictStore = {
  districts: District[];
  selectedDistricts: District[];

  setSelectedDistricts: (data: District[]) => void;
  fetchDistricts: (regionId: number | null) => Promise<void>;
};

export const useDistrictStore = create<DistrictStore>((set) => ({
  districts: [],
  selectedDistricts: [],

  setSelectedDistricts: (data) => set({ selectedDistricts: data }),

  fetchDistricts: async (regionId) => {
    if (!regionId) return;

    set({ selectedDistricts: [] });

    try {
      const response = await axios.get<District[]>(
        `https://bookitcrm.runasp.net/api/v1/public/districts/${regionId}`
      );

      set({ districts: response.data });
    } catch (error) {
      console.log("district error:", error);
    }
  },
}));