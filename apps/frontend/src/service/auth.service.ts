import { IFormLogin } from "@src/pages/login/Login";
import { axiosInstance } from "./service.config";
import { jwtDecode } from 'jwt-decode';
import { UserDTO } from "@src/dtos/User.dto";

export interface ITokens {
    access_token: string;
    refresh_token: string;
}

export enum ETokens {
    ACCESS_TOKEN = "access_token",
    REFRESH_TOKEN = "refresh_token"
}

export interface ITokenPayload {
    id: string;
    email: string;
    name: string;
    role: string;
    exp: number;
    iat: number;
}

const MODULE_NAME_URL: string = `auth`

export const logIn = (credentials: IFormLogin) => {
    return axiosInstance.post(`${MODULE_NAME_URL}/login`, {
        ...credentials
    })
}

export const refreshAccessToken = async () => {
    try {
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

export const getUserFromToken = (): UserDTO | null => {
    const token = localStorage.getItem('access_token');
    if (token) {
        const decodedToken: ITokenPayload = jwtDecode(token);
        const user: UserDTO = {
            id: decodedToken.id,
            name: decodedToken.name,
            email: decodedToken.email,
        }
        return user
    }
    return null;
}