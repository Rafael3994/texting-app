import { ReactNode } from "react";
import TokenContextProvider from "./token/Tokens.context";

export default function MyContext({ children }: { children: ReactNode }) {

    return (
        <TokenContextProvider>
            {children}
        </TokenContextProvider>
    );
}