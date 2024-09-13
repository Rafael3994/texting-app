import { IFormLogin } from "@src/pages/login/Login";
import axios from "axios";
import { BACKEND_URL } from "./service.config";

export interface ITokens {
    access_token: string;
    refresh_token: string;
}

const MODULE_NAME_URL: string = `${BACKEND_URL}auth`

export const logIn = (credentials: IFormLogin) => {
    return axios.post(`${MODULE_NAME_URL}/login`, {
        ...credentials
    })
}

export const saveTokensInLocalStorage = (tokens: ITokens) => {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
}