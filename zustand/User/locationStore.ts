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
                if (value) {
                    set({
                        locationEnabled: true,
                    });

                    get().getLocation();
                }

                else {
                    set({
                        locationEnabled: false,
                        latitude: null,
                        longitude: null,
                        loading: false,
                    });

                    localStorage.removeItem("location-storage");

                    window.location.reload();
                }
            },

            resetLocation: () => {
                set({
                    latitude: null,
                    longitude: null,
                    locationEnabled: false,
                    loading: false,
                });

                localStorage.removeItem("location-storage");
            },

            getLocation: () => {
                if (!navigator.geolocation) return;

                if (!get().locationEnabled) return;

                set({
                    loading: true,
                });

                navigator.geolocation.getCurrentPosition(
                    ({ coords }) => {
                        if (!get().locationEnabled) {
                            set({
                                loading: false,
                            });

                            return;
                        }

                        set({
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            loading: false,
                        });
                    },

                    (error) => {
                        console.log("Location error:", error);

                        set({
                            latitude: null,
                            longitude: null,
                            loading: false,
                        });

                        if (error.code === 1) {
                            set({
                                locationEnabled: false,
                            });
                        }
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