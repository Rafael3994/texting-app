import { toastErrorToShow } from "@src/components/NotificacionError";
import { logIn, saveTokensInLocalStorage } from "@src/service/auth.service";
import { useNavigate } from "react-router-dom";
import { IFormLogin } from "./Login";

export function useLogin({ formLogin }: { formLogin: IFormLogin }) {
    const navigate = useNavigate();

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            if (!isSanitatedForm()) return
            const tokens = await userLoginConnection()
            if (!tokens) return toastErrorToShow(`YOU COULDN'T LOG IN`)
            saveTokensInLocalStorage(tokens)
            return navigate('/lobby');
        } catch (err) {
            console.log('err handleSignIn:', err);

        }
    }

    function isSanitatedForm(): boolean {
        let isSanitated = true;
        if (!validateEmail(formLogin.email)) {
            toastErrorToShow('Invalid email address.')
            isSanitated = false
        }
        if (formLogin.password.length < 6) {
            toastErrorToShow('Password must be at least 6 characters long.')
            isSanitated = false
        }

        return isSanitated
    }

    function validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    async function userLoginConnection() {
        try {
            const res = await logIn(formLogin)
            return res.data;
        } catch (err) {
            console.log('err userLoginConnection:', err);
        }
    }

    return {
        handleSignIn: handleSignIn
    }
}