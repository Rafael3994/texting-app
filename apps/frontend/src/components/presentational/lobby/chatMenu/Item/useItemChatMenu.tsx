import { ChatDTO } from "@src/dtos/Chat.dto"
import { UserPublicDTO } from "@src/dtos/User.public.dto"
import { getUserFromToken } from "@src/service/auth.service"
import { deleteChat } from "@src/service/chat.service"
import { useCallback, useEffect, useState } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

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

    const MySwal = withReactContent(Swal);
    const handleDeleteChatPopup = async (idChat: string) => {
        try {
            await MySwal.fire({
                title: "Do you are sure you want to delete the chat?",
                heightAuto: false,
                showCancelButton: true,
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    try {
                        if (!idChat) return
                        const deletedChat = await deleteChat(idChat)

                        if (!deletedChat) {
                            return Swal.showValidationMessage(`The chat couldn't be deleted.`);
                        }
                        await MySwal.fire({
                            title: `Chat deleted`,
                            heightAuto: false,
                            width: '20rem'
                        });
                    } catch (err) {
                        console.log('err popup preConfir handleDeleteChatPopup:', err);
                    }
                },
            });
        } catch (error) {
            console.error("Error showing popup handleDeleteChatPopup", error);
        }
    }

    return {
        personToTalk,
        handleDeleteChatPopup,
    }
}
