import { create } from "zustand";
import axios from "axios";

type Regions = {
    id: number,
    name: string
};

type RegionsStore = {
    regionsStore: Regions[];
    regionsCount: number;
    fetchRegionsInfo: () => Promise<void>;
};

export const useRegionsStore = create<RegionsStore>((set, get) => ({
    regionsStore: [],
    regionsCount: 0,


    fetchRegionsInfo: async () => {
        if (get().regionsStore.length > 0) {
            return;
        };
        try {
            const accessToken = await localStorage.getItem("accessToken");
            const response = await axios.get("https://bookitcrm.runasp.net/api/v1/public/regions", {
                ...(accessToken && {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
            });

            const data: Regions[] = response.data;

            set({ regionsStore: data, regionsCount: data.length, });

        } catch (error) {
            console.error("error proilei info:", error);
        }
    },
}));