import { toastErrorToShow } from "@src/components/NotificacionError";
import { isBackendTurnedOn, logIn, saveTokensInLocalStorage } from "@src/service/auth.service";
import { useNavigate } from "react-router-dom";
import { IFormLogin } from "./Login";
import { useTokensContext } from "@src/context/token/useTokensContext";
import { useState } from "react";
import { registerUser } from "@src/service/user.service";
import { UserCreatedDTO } from "@src/dtos/User.created.dto";
import { AuthDTO } from "@src/dtos/Auth.dto";
import { toastSuccesfulToShow } from "@src/components/NotificacionSuccesful";

export function useLogin() {
    const navigate = useNavigate();

    const [formLogin, setFormLogin] = useState<IFormLogin>(
        {
            email: '',
            password: '',
        }
    )

    const [formRegister, setFormRegister] = useState<UserCreatedDTO>(
        {
            email: '',
            password: '',
            name: '',
        }
    )

    const [isShowLogin, setIsShowLogin] = useState<boolean>(true)


    const { saveTokens } = useTokensContext()

    const handleChangeForm = () => {
        setFormLogin({
            email: '',
            password: '',
        })
        setFormRegister({
            email: '',
            password: '',
            name: '',
        })
        setIsShowLogin(!isShowLogin)
    }

    const handleIsBackendTurnOn = async () => {
        try {
            const {status, data} = await isBackendTurnedOn();
            if (status === 200 && data) return toastSuccesfulToShow('THE BACKEND IS TURNED ON 🚀');
            return toastErrorToShow(`THE BACKEND IS TURNED OFF`);
        } catch (error) {
            return toastErrorToShow(`THE BACKEND IS TURNED OFF`);
        }
    }

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            if (!isSanitatedForm()) return
            const tokens = await userLoginConnection({
                email: formLogin.email,
                password: formLogin.password,
            })

            if (!tokens) return toastErrorToShow(`YOU COULDN'T LOG IN`)
            saveTokens(tokens)
            saveTokensInLocalStorage(tokens)
            return navigate('/lobby');
        } catch (err) {
            console.log('err handleSignIn:', err);

        }
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            if (!isSanitatedForm()) return

            await registerUser(formRegister)
            const tokens = await userLoginConnection({
                email: formRegister.email,
                password: formRegister.password,
            })

            if (!tokens) return toastErrorToShow(`YOU COULDN'T LOG IN`)
            saveTokens(tokens)
            saveTokensInLocalStorage(tokens)
            return navigate('/lobby');
        } catch (err) {
            console.log('err handleSignIn:', err);
            return toastErrorToShow(`YOU COULDN'T REGISTER`)
        }
    }

    const handleChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const _value = value.trim()
        setFormLogin((prevState) => ({
            ...prevState,
            [name]: _value,
        }));
    };

    const handleChangeRegister = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const _value = value.trim()
        setFormRegister((prevState) => ({
            ...prevState,
            [name]: _value,
        }));
    };

    function isSanitatedForm(): boolean {
        if (isShowLogin) return isFormLoginSanitated()
        return isFormRegisterSanitated()
    }

    function isFormLoginSanitated(): boolean {
        let isSanitated = true;
        if (!validateEmail(formLogin.email)) {
            toastErrorToShow('Invalid email address.')
            isSanitated = false
        }
        if (formLogin.password.length < 4) {
            toastErrorToShow('Password must be at least 4 characters long.')
            isSanitated = false
        }
        return isSanitated
    }

    function isFormRegisterSanitated(): boolean {
        let isSanitated = true;
        if (!validateEmail(formRegister.email)) {
            toastErrorToShow('Invalid email address.')
            isSanitated = false
        }
        if (formRegister.password.length < 4) {
            toastErrorToShow('Password must be at least 4 characters long.')
            isSanitated = false
        }
        if (formRegister.name.length < 4) {
            toastErrorToShow('The name must be at least 4 characters long.')
            isSanitated = false
        }
        return isSanitated
    }

    function validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    async function userLoginConnection(user: AuthDTO) {
        try {
            const res = await logIn(user)
            return res.data;
        } catch (err) {
            console.log('err userLoginConnection:', err);
        }
    }

    return {
        handleSignIn,
        handleChangeLogin,
        formLogin,
        formRegister,
        isShowLogin,
        handleRegister,
        handleChangeRegister,
        handleChangeForm,
        handleIsBackendTurnOn
    }
}
