import { createContext, useContext, useState } from "react";

export interface IChatSelectedContext {
    chatSelected: string | null;
    setChatSelected: (chatSelected: string | null) => void;
}

export const ChatSelectedContext = createContext<
    IChatSelectedContext
    |
    undefined
>(undefined);

export default function useChatSelectedContext() {
    const context = useContext(ChatSelectedContext)
    const [chatSelected, setChatSelected] = useState<string | null>(null);

    const getChatSelected = () => {
        return context?.chatSelected;
    }

    const saveChatSelected = (chatSelected: string) => {
        context?.setChatSelected(chatSelected)
    }

    const deleteChatSelected = () => {
        context?.setChatSelected(null)
    }

    return {
        chatSelected,
        setChatSelected,
        getChatSelected,
        saveChatSelected,
        deleteChatSelected,
    }
}
