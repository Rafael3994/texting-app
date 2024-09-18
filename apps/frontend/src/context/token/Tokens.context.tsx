import { ReactNode } from "react";
import { TokensContext, useTokensContext } from "./useTokensContext";

export default function TokenContextProvider({ children }: { children: ReactNode }) {
    const { tokens,
        setTokens, } = useTokensContext()
    return (
        <TokensContext.Provider value={{ tokens, setTokens }}>
            {children}
        </TokensContext.Provider>
    );
}