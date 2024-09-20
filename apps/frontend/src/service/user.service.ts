import { axiosInstance } from "./service.config"
import { UserCreatedDTO } from "@src/dtos/User.created.dto"

const MODULE_NAME_URL: string = `user`

export const registerUser = (credentials: UserCreatedDTO) => {
    return axiosInstance.post(`${MODULE_NAME_URL}`, {
        ...credentials
    })
}