import { create } from "zustand";
import axios from "axios";
import qs from "qs";

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
    businessCategoryId?: number;
    isOpen?: boolean;
}

interface BusinessStore {
    businessStore: BusinessInfo[];
    loading: boolean;
    fetchBusiness: (params: FetchBusinessParams) => Promise<void>;
}

function getLocalDateTimeWithOffset() {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    const offset = -now.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = pad(Math.abs(offset) % 60);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const useBusinessStore = create<BusinessStore>((set) => ({
    businessStore: [],
    loading: false,

    fetchBusiness: async ({
        regionId,
        districtIds = [],
        latitude,
        longitude,
        searchKey,
        businessCategoryId,
        isOpen
    }) => {
        set({ loading: true });

        try {
            const accessToken = localStorage.getItem("accessToken");

            const params: any = {
                RegionId: regionId,
                Latitude: latitude,
                Longtitude: longitude,
                DistrictIds: districtIds.length ? districtIds : undefined,
                LocalTime: getLocalDateTimeWithOffset(),
                BusinessCategoryId: businessCategoryId && businessCategoryId !== 0 ? businessCategoryId : undefined,
                IsOpen: isOpen,
            };

            if (searchKey && searchKey.trim().length > 0) {
                params.SearchKey = searchKey.trim();
            }

            const response = await axios.get<BusinessResponse>(
                `${apiUrl}/api/v1/public`,
                {
                    params,
                    paramsSerializer: (params) =>
                        qs.stringify(params, { arrayFormat: "repeat" }),
                    ...(accessToken && {
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
            set({ loading: false });
        }
    },
}));