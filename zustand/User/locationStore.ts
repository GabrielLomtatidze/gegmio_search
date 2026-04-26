"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationState {
    latitude: number | null;
    longitude: number | null;
    locationEnabled: boolean;
    loading: boolean;

    setLocationEnabled: (value: boolean) => void;
    getLocation: () => void;
    resetLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
    persist(
        (set, get) => ({
            latitude: null,
            longitude: null,
            locationEnabled: false,
            loading: false,

            setLocationEnabled: (value) => {
                set({ locationEnabled: value });

                if (!value) {
                    set({
                        latitude: null,
                        longitude: null,
                    });
                }
            },

            resetLocation: () => {
                set({
                    latitude: null,
                    longitude: null,
                });
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
                    (error) => {
                        set({
                            loading: false,
                            latitude: null,
                            longitude: null,
                            locationEnabled: false,
                        });

                        console.log("Location error:", error);
                    },
                    {
                        enableHighAccuracy: true,
                    }
                );
            },
        }),
        {
            name: "location-storage",
        }
    )
);