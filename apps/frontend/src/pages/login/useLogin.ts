import { toastErrorToShow } from "@src/components/NotificacionError";
import { logIn } from "@src/service/auth.service";
import { useNavigate } from "react-router-dom";

export function useLogin() {
    const navigate = useNavigate();

    const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        isUserCanAccess()
        // SEND THE AXIOS LOGIN
        // IF IS CORRECT SAVE TOKENS
        isRedirectToLobby(!true)
    }

    async function isUserCanAccess() {
        try {
            const res = await logIn()
            console.log('res', res);
        } catch (err) {
            console.log(err);

        }
    }

    function isRedirectToLobby(isGoToLobby: boolean) {
        if (isGoToLobby) return navigate('/lobby');
        return toastErrorToShow(`YOU COULDN'T LOG IN`)
    }

    return {
        handleSignIn: handleSignIn
    }
}