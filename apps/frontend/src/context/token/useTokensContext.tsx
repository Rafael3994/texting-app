import { ITokens } from "@src/service/auth.service";
import { createContext, useContext, useState } from "react";

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

export function useTokensContext() {
    const context = useContext(TokensContext)
    const [tokens, setTokens] = useState<ITokens>(initialState);

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
        tokens,
        setTokens,
        getTokens,
        hasAccessToken,
        saveTokens,
        deleteTokens,
    }

}