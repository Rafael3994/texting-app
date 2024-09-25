import { TextPublicDTO } from "@src/dtos/Text.dto"
import { getMessagesFromIdChat } from "@src/service/text.service"
import { EVENTS_NAMES, getSocketConnection } from "@src/service/webSocket"
import { useEffect, useState } from "react"

export default function useClipboard({ chatId }: { chatId: string | null | undefined }) {
    const [messages, setMessages] = useState<TextPublicDTO[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => { }, [messages])

    useEffect(() => {
        if (!chatId) return
        getMessagesFromIdChat(chatId)
            .then(res => {
                setMessages(res?.data)
            }).catch(err => {
                console.log('err', err);
            })
            .finally(() =>
                setIsLoading(false)
            );

        getSocketConnection()?.on(EVENTS_NAMES.MESSAGE_CREATED, (messageWS: TextPublicDTO) => {
            setMessages(prevChats => [...prevChats, messageWS]);
        });

        getSocketConnection()?.on(EVENTS_NAMES.MESSAGE_DELETED, (messageWS: TextPublicDTO) => {
            setMessages(prevMessages => prevMessages.filter((message) => message.id !== messageWS.id));
        });

        return () => {
            setMessages([])
        }
    }, [chatId])

    return {
        messages,
        isLoading
    }
}
