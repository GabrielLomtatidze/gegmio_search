import { create } from 'zustand';
import axios from 'axios';

type File = {
    id: number;
    url: string;
    isProfile: boolean;
};

type Gender = {
    id: number;
    name: string;
};

type Role = {
    id: string;
    name: string;
};

type UserInfo = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    phoneNumber: string;
    createDate: string;
    file: File;
    gender: Gender;
    role: Role;
};

type UserStore = {
    userInfo: UserInfo | null;
    fetched: boolean;
    fetchUserInfo: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
    userInfo: null,
    fetched: false,

    fetchUserInfo: async () => {

        if (get().fetched) return;

        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) return;

            const response = await axios.get(
                'https://bookitcrm.runasp.net/api/v1/account/profile',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const data = response.data;

            set({ userInfo: data, fetched: true });
        } catch (error:any) {
            if (error.response?.status === 401) {
                localStorage.removeItem("accessToken");
                set({ userInfo: null, fetched: false });
            }
        }
    },
}));