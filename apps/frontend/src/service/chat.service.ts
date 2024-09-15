import { axiosInstance } from "./service.config"

const MODULE_NAME_URL: string = `chat`

export const getChatsFromUser = async () => {
    try {
        return await axiosInstance.get(
            `${MODULE_NAME_URL}/b7e75a6a-1478-4b73-b200-db4be5917c18`,
        )
    } catch (err) {
        console.log('err', err);
    }
}