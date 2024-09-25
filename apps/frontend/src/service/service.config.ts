import axios from "axios";
import { getTokensFromLocalStorage, refreshAccessToken } from "./auth.service";

export const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
    baseURL: `${BACKEND_URL}/api/`,
});

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const { config, response } = error;
        if (response && response.status === 401) {
            if (!config._retry) {
                config._retry = true;

                try {
                    const { access_token, refresh_token } = await refreshAccessToken();
                    config.headers['Authorization'] = `Bearer ${access_token}`;
                    config.headers['x-refresh-token'] = refresh_token;
                    return axiosInstance(config);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.request.use(
    (config) => {
        const { access_token, refresh_token } = getTokensFromLocalStorage();
        if (access_token) {
            config.headers['Authorization'] = `Bearer ${access_token}`;
        }
        if (refresh_token) {
            config.headers['x-refresh-token'] = refresh_token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);