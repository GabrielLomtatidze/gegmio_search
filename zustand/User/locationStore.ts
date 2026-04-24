"use client";
import { create } from "zustand";

interface LocationState {
    latitude: number | null;
    longitude: number | null;
    locationEnabled: boolean;
    loading: boolean;

    setLocationEnabled: (value: boolean) => void;
    getLocation: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
    latitude: null,
    longitude: null,
    locationEnabled: false,
    loading: false,

    setLocationEnabled: (value) => {
        set({ locationEnabled: value });

        if (value) {
            get().getLocation();
        } else {
            set({ latitude: null, longitude: null });
        }
    },

    getLocation: () => {
        if (!navigator.geolocation) return;

        set({ loading: true });

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                set({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    loading: false,
                });
            },
            () => {
                set({ loading: false });
            }
        );
    },
}));