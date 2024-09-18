import { ChatCreateDTO } from "@src/dtos/Chat.create.dto"
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

export const createChat = async (newChat: ChatCreateDTO) => {
    try {
        return await axiosInstance.post(
            `${MODULE_NAME_URL}`,
            newChat
        )
    } catch (err) {
        console.log('createChat err:', err);
    }
}

export const deleteChat = async (idChat: string) => {
    try {
        return await axiosInstance.delete(
            `${MODULE_NAME_URL}/${idChat}`,
        )
    } catch (err) {
        console.log('deleteChat err:', err);
    }
}