import { IFormLogin } from "@src/pages/login/Login";
import { axiosInstance } from "./service.config";

export interface ITokens {
    access_token: string;
    refresh_token: string;
}

export enum ETokens {
    ACCESS_TOKEN = "access_token",
    REFRESH_TOKEN = "refresh_token"
}

const MODULE_NAME_URL: string = `auth`

export const logIn = (credentials: IFormLogin) => {
    return axiosInstance.post(`${MODULE_NAME_URL}/login`, {
        ...credentials
    })
}

export const refreshAccessToken = async () => {
    try {
        const { refresh_token } = getTokensFromLocalStorage()
        console.log('refresh_token PASS', refresh_token);

        const response = await axiosInstance.post(
            `${MODULE_NAME_URL}/refresh`,
        );
        saveTokensInLocalStorage(response.data)
        return response.data.access_token
    } catch (error) {
        console.error('Error refreshing token', error);
        throw error;
    }
}


export const saveTokensInLocalStorage = (tokens: ITokens) => {
    localStorage.setItem(ETokens.ACCESS_TOKEN, tokens.access_token);
    localStorage.setItem(ETokens.REFRESH_TOKEN, tokens.refresh_token);
}

export const deleteTokensInLocalStorage = () => {
    localStorage.removeItem(ETokens.ACCESS_TOKEN)
    localStorage.removeItem(ETokens.REFRESH_TOKEN)
}

export const getTokensFromLocalStorage = () => {
    return {
        access_token: localStorage.getItem(ETokens.ACCESS_TOKEN),
        refresh_token: localStorage.getItem(ETokens.REFRESH_TOKEN),
    }
}

export const isTokensInLocalStorage = (): boolean => {
    const access = localStorage.getItem(ETokens.ACCESS_TOKEN)
    const refresh = localStorage.getItem(ETokens.REFRESH_TOKEN)
    return access !== null && refresh !== null

}