import { getUserFromToken } from "./auth.service"
import { axiosInstance } from "./service.config"

const MODULE_NAME_URL: string = `chat`

export const getChatsFromUser = async () => {
    try {
        const userId = getUserFromToken()?.id
        return await axiosInstance.get(
            `${MODULE_NAME_URL}/user/${userId}`,
        )
    } catch (err) {
        console.log('getChatsFromUser err:', err);
    }
}