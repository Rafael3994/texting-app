import { ChatDTO } from "@src/dtos/Chat.dto"
import { UserPublicDTO } from "@src/dtos/User.public.dto"
import { getUserFromToken } from "@src/service/auth.service"
import { useCallback, useEffect, useState } from "react"

export default function useItemChatMenu(infoChat: ChatDTO) {
    const [personToTalk, setPersonToTalk] = useState<UserPublicDTO | null>(null)

    const getPersonToTalk = useCallback(() => {
        if (!infoChat.user1 || !infoChat.user2) return
        let userToSave: UserPublicDTO;
        const userIdLogged = getUserFromToken()?.id
        userIdLogged === infoChat.userId1 ?
            userToSave = infoChat.user2
            :
            userToSave = infoChat.user1

        setPersonToTalk(userToSave)
    }, [infoChat])

    useEffect(() => {
        getPersonToTalk()
    }, [getPersonToTalk])

    return {
        personToTalk
    }
}
