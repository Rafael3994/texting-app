import useChatSelectedContext from '@src/context/chat/useChatSelectedContext';
import { ChatCreateDTO } from '@src/dtos/Chat.create.dto';
import { ChatDTO } from '@src/dtos/Chat.dto';
import { UserDTO } from '@src/dtos/User.dto';
import { getUserFromToken } from '@src/service/auth.service';
import { createChat, getChatsFromUser } from '@src/service/chat.service';
import { EVENTS_NAMES, getSocketConnection } from '@src/service/webSocket';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function useChatMenu() {

    const [chats, setChats] = useState<ChatDTO[]>([])
    const [userLogged] = useState<UserDTO | null>(getUserFromToken())
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { getChatSelected, deleteChatSelected } = useChatSelectedContext()

    useEffect(() => {
        getChatsFromUser()
            .then(res => {
                if (res?.data) {
                    setChats(res.data);
                }
            })
            .catch(err => {
                console.log('getChatsFromUser err:', err);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, []);

    useEffect(() => {
        getSocketConnection()?.on(EVENTS_NAMES.CHAT_CREATED, (chatWS: ChatDTO) => {
            setChats(prevChats => [...prevChats, chatWS]);
        });
        getSocketConnection()?.on(EVENTS_NAMES.CHAT_DELETED, (chatWS: ChatDTO) => {
            if (getChatSelected() === chatWS.id) {
                deleteChatSelected()
            }
            setChats(prevChats => prevChats.filter(chat => chat.id !== chatWS.id));
        });

        return () => {
            getSocketConnection()?.off(EVENTS_NAMES.CHAT_CREATED);
            getSocketConnection()?.off(EVENTS_NAMES.CHAT_DELETED);
        }
    }, [getChatSelected])

    const MySwal = withReactContent(Swal);
    const handleCreateChatPopup = async () => {
        try {
            await MySwal.fire({
                title: "Enter the user id from your friend",
                input: "text",
                inputLabel: "",
                inputValue: "",
                heightAuto: false,
                showCancelButton: true,
                inputAutoFocus: true,
                inputAutoTrim: true,
                inputValidator: (value) => {
                    if (!value) {
                        return "You need to write something!";
                    }
                },
                showLoaderOnConfirm: true,
                preConfirm: async (userId2) => {
                    try {
                        if (!userLogged?.id) return
                        const chatCreated: ChatCreateDTO = {
                            userId1: userLogged?.id,
                            userId2: userId2,
                        }
                        const newChat = await createChat(chatCreated)
                        if (!newChat) {
                            return Swal.showValidationMessage(`The chat couldn't be created.`);
                        }
                        await MySwal.fire({
                            title: `Chat created`,
                            heightAuto: false,
                            width: '20rem'
                        });
                    } catch (err) {
                        console.log('err popup preConfir', err);
                    }
                },
            });
        } catch (error) {
            console.error("Error showing popup handleCreateChatPopup", error);
        }
    };

    return {
        chats,
        userLogged,
        isLoading,
        handleCreateChatPopup,
    }
}
