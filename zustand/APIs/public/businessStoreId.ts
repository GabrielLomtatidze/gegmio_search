import { create } from "zustand";
import axios from "axios";

export type ProfileDetails = {
  id: string;
  name: string;
  description: string;
  phoneNumber: string,
  webSite: string;
  tikTok: string;
  instagram: string;
  facebook: string;
  businessAddressName: string;
  latitude: number;
  longitude: number;
  distnace: number;
  serviceCount: number;
  isFavorite: boolean;
  businessBookingTime: {
    businessBookingTimeTypeId: number;
    name: string;
    bookingStartTime: string;
    bookingEndTime: string;
  }[];
  files: {
    id: number;
    url: string;
    isProfile: boolean;
  }[];
};

type BusinessByIdState = {
  business: ProfileDetails | null;
  loading: boolean;
  error: string | null;
  favorite: boolean;
  currentId: string | null;

  getBusinessById: (id: string) => Promise<void>;
  toggleFavorite: () => void;
  reset: () => void;
};

export const useBusinessStoreId = create<BusinessByIdState>((set, get) => ({
  business: null,
  loading: false,
  error: null,
  favorite: false,
  currentId: null,

  getBusinessById: async (id: string) => {
    const state = get();

    if (state.loading) return;
    if (state.currentId === id) return;

    try {
      set({ loading: true, error: null });

      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(`https://bookitcrm.runasp.net/api/v1/public/${id}`, {
        ...(accessToken && {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      });

      const data = res.data;

      set({
        business: data,
        favorite: data.isFavorite,
        loading: false,
        currentId: id,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Something went wrong",
        loading: false,
      });
    }
  },

  toggleFavorite: () =>
    set((state) => ({
      favorite: !state.favorite,
    })),

  reset: () =>
    set({
      business: null,
      loading: false,
      error: null,
      favorite: false,
      currentId: null,
    }),
}));