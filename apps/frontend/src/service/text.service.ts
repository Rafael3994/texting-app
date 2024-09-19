import { axiosInstance } from "./service.config";

const MODULE_NAME_URL: string = `text`

export const getMessagesFromIdChat = async (idChat: string) => {
    try {
        return await axiosInstance.get(
            `${MODULE_NAME_URL}/chat/${idChat}`,
        )
    } catch (error) {
        console.error('getMessagesFromIdChat serive err:', error);

    }
}