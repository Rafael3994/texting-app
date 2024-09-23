import { TextPublicDTO } from "@src/dtos/Text.dto"
import { getMessagesFromIdChat } from "@src/service/text.service"
import { EVENTS_NAMES, getSocketConnection } from "@src/service/webSocket"
import { useEffect, useState } from "react"

export default function useClipboard({ chatId }: { chatId: string | null | undefined }) {
    const [messages, setMessages] = useState<TextPublicDTO[]>([])

    useEffect(() => {
        if (!chatId) return
        getMessagesFromIdChat(chatId)
            .then(res => {
                setMessages(res?.data)
            }).catch(err => {
                console.log('err', err);
            })

        getSocketConnection()?.on(EVENTS_NAMES.MESSAGE_CREATED, (messageWS: TextPublicDTO) => {
            console.log('messageWS', messageWS);
            setMessages(prevChats => [...prevChats, messageWS]);
        });

        return () => {
            getSocketConnection()?.off(EVENTS_NAMES.MESSAGE_CREATED)
        }
    }, [chatId])

    return {
        messages
    }
}
