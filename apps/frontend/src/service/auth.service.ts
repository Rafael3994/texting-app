import { IFormLogin } from "@src/pages/login/Login";
import axios from "axios";
import { BACKEND_URL } from "./service.config";

export interface ITokens {
    access_token: string;
    refresh_token: string;
}

enum ETokens {
    ACCESS_TOKEN = "access_token",
    REFRESH_TOKEN = "refresh_token"
}

const MODULE_NAME_URL: string = `${BACKEND_URL}auth`

export const logIn = (credentials: IFormLogin) => {
    return axios.post(`${MODULE_NAME_URL}/login`, {
        ...credentials
    })
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

}

export const isTokensInLocalStorage = (): boolean => {
    const access = localStorage.getItem(ETokens.ACCESS_TOKEN)
    const refresh = localStorage.getItem(ETokens.REFRESH_TOKEN)
    return access !== null && refresh !== null

}