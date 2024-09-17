import { ChatDTO } from '@src/dtos/Chat.dto';
import { getChatsFromUser } from '@src/service/chat.service';
import { useEffect, useState } from 'react';

export default function useChatMenu() {

    const [chats, setChats] = useState<ChatDTO[]>([])

    useEffect(() => {
        getChatsFromUser()
            .then(res => {
                if (!res?.data) return
                setChats(res?.data)
            })
            .catch(err => {
                console.log('getChatsFromUser err:', err);
            })
    }, [])

    return {
        chats
    }
}
