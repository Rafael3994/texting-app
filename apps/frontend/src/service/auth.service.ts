import axios from "axios";

const URL_BASE: string | undefined = import.meta.env.VITE_BACKEND_URL

export const logIn = () => {
    if (!URL_BASE) return;
    return axios.get(URL_BASE)
}