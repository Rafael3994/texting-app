import { TextCreateDTO } from "@src/dtos/text.create.dto";
import { axiosInstance } from "./service.config";

const MODULE_NAME_URL: string = `text`

export const getMessagesFromIdChat = async (idChat: string) => {
    try {
        return await axiosInstance.get(
            `${MODULE_NAME_URL}/chat/${idChat}`,
        )
    } catch (error) {
        console.error('getMessagesFromIdChat service err:', error);

    }
}

export const createMessage = async (newMessage: TextCreateDTO) => {
    try {
        return await axiosInstance.post(
            `${MODULE_NAME_URL}`,
            newMessage
        )
    } catch (error) {
        console.error('createMessage service err:', error);

    }
}

export const deleteMessage = async (idMessage: string) => {
    try {
        return await axiosInstance.delete(
            `${MODULE_NAME_URL}/${idMessage}`,
        )
    } catch (err) {
        console.log('deleteMessage err:', err);
    }
}