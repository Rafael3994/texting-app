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

export const isTokensInLocalStorage = (): boolean => {
    const access = localStorage.getItem(ETokens.ACCESS_TOKEN)
    const refresh = localStorage.getItem(ETokens.REFRESH_TOKEN)
    return access !== null && refresh !== null

}

/*

1. Almacena el Access Token en la memoria de la aplicación.
2. Almacena el Refresh Token en una httpOnly cookie.
3. Usa un interceptor para manejar la expiración del Access Token y la solicitud de un nuevo token usando el Refresh Token.
4. Configura Axios para interceptar errores 401 y tratar de obtener un nuevo Access Token.
5. Reintenta la solicitud original después de obtener un nuevo Access Token.

*/