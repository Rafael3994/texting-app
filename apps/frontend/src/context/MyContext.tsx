import { ReactNode } from "react";
import TokenContextProvider from "./token/Tokens.context";
import ChatSelectedContextProvider from "./chat/ChatSelected.context";

export default function MyContext({ children }: { children: ReactNode }) {

    return (
        <TokenContextProvider>
            <ChatSelectedContextProvider>
                {children}
            </ChatSelectedContextProvider>
        </TokenContextProvider>
    );
}