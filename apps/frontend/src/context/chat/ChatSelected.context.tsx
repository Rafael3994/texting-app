import { ReactNode } from "react";
import useChatSelectedContext, { ChatSelectedContext } from "./useChatSelectedContext";

export default function ChatSelectedContextProvider({ children }: { children: ReactNode }) {
    const { chatSelected, setChatSelected } = useChatSelectedContext()
    return (
        <ChatSelectedContext.Provider value={{ chatSelected, setChatSelected }}>
            {children}
        </ChatSelectedContext.Provider>
    );
}