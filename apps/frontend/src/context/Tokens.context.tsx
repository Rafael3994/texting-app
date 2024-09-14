import { ITokens } from "@src/service/auth.service";
import { createContext, ReactNode, useContext, useState } from "react";

export interface ITokensContext {
    tokens: ITokens;
    setTokens: (tokens: ITokens) => void;
}

export const TokensContext = createContext<
    ITokensContext
    |
    undefined
>(undefined);

const initialState: ITokens = {
    access_token: '',
    refresh_token: ''
}

// Crear el proveedor del contexto
export default function MyProvider({ children }: { children: ReactNode }) {
    const [tokens, setTokens] = useState<ITokens>(initialState);

    return (
        <TokensContext.Provider value={{ tokens, setTokens }}>
            {children}
        </TokensContext.Provider>
    );
}

export function useTokensContext() {
    const context = useContext(TokensContext)

    const getTokens = () => {
        return context?.tokens;
    }

    const hasAccessToken = (): boolean => {
        return Boolean(context?.tokens.access_token) || Boolean(context?.tokens.refresh_token)
    }

    const saveTokens = (tokens: ITokens) => {
        context?.setTokens(tokens)
    }

    const deleteTokens = () => {
        context?.setTokens(
            initialState
        )
    }

    return {
        getTokens,
        hasAccessToken,
        saveTokens,
        deleteTokens,
    }

}