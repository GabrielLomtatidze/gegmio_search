import { create } from "zustand";
import axios from "axios";
import qs from "qs"

type File = {
    id: number;
    url: string;
    isProfile: boolean;
};

type BusinessCategory = {
    id: number;
    name: string;
};

export type BusinessInfo = {
    id: string;
    name: string;
    businessCategory: BusinessCategory;
    addressName: string;
    latitude: number | null;
    longtitude: number | null;
    distnace: number | null;
    file: File | null;
    isFavorite: boolean;
};

type BusinessResponse = {
    data: BusinessInfo[];
    totalItemCount: number;
    pageCount: number;
    page: number;
    offset: number;
};

interface FetchBusinessParams {
    regionId?: number;
    districtIds?: number[];
    searchKey?: string;
    latitude?: number;
    longitude?: number;
}

interface BusinessStore {
    businessStore: BusinessInfo[];
    loading: boolean;
    fetchBusiness: (params: FetchBusinessParams) => Promise<void>;
}


export const useBusinessStore = create<BusinessStore>((set) => ({
    businessStore: [],
    loading: false,

    fetchBusiness: async ({
        regionId,
        districtIds = [],
        latitude,
        longitude,
        searchKey,
    }) => {
        set({ loading: true });

        try {
            const accessToken = await localStorage.getItem("accessToken");
            const params: any = {
                RegionId: regionId,
                Latitude: latitude,
                Longtitude: longitude,
                DistrictIds: districtIds.length ? districtIds : undefined,
            };

            if (searchKey && searchKey.trim().length > 0) {
                params.SearchKey = searchKey.trim();
            }
            const response = await axios.get<BusinessResponse>(

                "https://bookitcrm.runasp.net/api/v1/public",
                {
                    params,
                    paramsSerializer: (params) =>
                        qs.stringify(params, { arrayFormat: "repeat" }), ...(accessToken && {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }),
                }

            );


            set({
                businessStore: response.data.data,
                loading: false,
            });
        } catch (error) {
            console.error("Error fetching business data:", error);
            set({ loading: false });
        }
    },
}));