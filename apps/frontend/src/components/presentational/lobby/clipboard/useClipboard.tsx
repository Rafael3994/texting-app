import { TextPublicDTO } from "@src/dtos/Text.dto"
import { getMessagesFromIdChat } from "@src/service/text.service"
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
    }, [chatId])

    return {
        messages
    }
}
