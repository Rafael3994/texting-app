import bubbleSVG from '@src/assets/bubble.svg';
import CustomInputEmail from '@src/components/presentational/form//CustomInputEmail';
import CustomInputPassword from '@src/components/presentational/form/CustomInputPassword';
import NotificacionError from '@src/components/NotificacionError';
import { useLogin } from './useLogin';
import CustomInputText from '@src/components/presentational/form/CustomInputText';
import { isTokensInLocalStorage } from '@src/service/auth.service'
import { Navigate } from 'react-router-dom';
import { UserCreatedDTO } from '@src/dtos/User.created.dto';


export interface IFormLogin {
    email: string;
    password: string;
}

export interface IPropsCustomInputsFormLogin {
    form: IFormLogin
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IPropsCustomInputsFormRegister {
    form: UserCreatedDTO
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LoginPage() {
    const {
        formLogin,
        formRegister,
        isShowLogin,
        handleSignIn,
        handleChangeLogin,
        handleRegister,
        handleChangeRegister,
        handleChangeForm
    } = useLogin()

    const cardLogin = () => {
        return <section className='h-80 w-4/6 md:w-3/6 lg:w-6/12 xl:w-4/12 bg-white rounded-lg z-10 shadow-2xl mt-[-4rem]'>
            <div className='h-full w-full flex flex-col items-center my-4'>
                <h2 className='text-stone-800 font-bold text-xl md:text-3xl'>LOGIN</h2>
                <div className='h-full w-full'>
                    <form className='w-full h-full flex flex-col items-center' onSubmit={handleSignIn}>
                        <div className='h-1/4 w-10/12 mt-3'>
                            <CustomInputEmail form={formLogin} handleChange={handleChangeLogin} />
                        </div>
                        <div className='h-1/4 w-10/12 mt-3'>
                            <CustomInputPassword form={formLogin} handleChange={handleChangeLogin} />
                        </div>

                        <button
                            className="mt-4 bg-dark-green hover:bg-dark-green-hover text-white font-bold h-10 w-2/5 md:w-3/12 rounded-full">
                            Sing In
                        </button>
                        <p onClick={handleChangeForm} className="text-dark-green pt-3 tracking-widest transition-all duration-300 hover:font-semibold hover:cursor-pointer">
                            register
                        </p>
                    </form>
                </div>
            </div>
        </section>
    }

    const cardRegister = () => {
        return <section className='h-[25rem] w-4/6 md:w-3/6 lg:w-6/12 xl:w-4/12 bg-white rounded-lg z-10 shadow-2xl mt-[-4rem]'>
            <div className='h-full w-full flex flex-col items-center my-4'>
                <h2 className='text-stone-800 font-bold text-xl md:text-3xl'>REGISTER</h2>
                <div className='h-full w-full'>
                    <form className='w-full h-full flex flex-col items-center' onSubmit={handleRegister}>
                        <div className='h-auto w-10/12 mt-3'>
                            <CustomInputText form={formRegister} handleChange={handleChangeRegister} />
                        </div>
                        <div className='h-auto w-10/12 mt-3'>
                            <CustomInputEmail form={formRegister} handleChange={handleChangeRegister} />
                        </div>
                        <div className='h-auto w-10/12 mt-3'>
                            <CustomInputPassword form={formRegister} handleChange={handleChangeRegister} />
                        </div>

                        <button
                            className="mt-4 bg-dark-green hover:bg-dark-green-hover text-white font-bold h-10 w-2/5 md:w-3/12 rounded-full">
                            Register
                        </button>
                        <p onClick={handleChangeForm} className="text-dark-green pt-3 tracking-widest transition-all duration-300 hover:font-semibold hover:cursor-pointer">
                            login
                        </p>
                    </form>
                </div>
            </div>
        </section>
    }

    return (
        isTokensInLocalStorage() ?
            <Navigate to="/lobby" />
            :
            <div className='flex justify-center items-center flex-col' >
                <NotificacionError />
                <header className='h-56 w-full bg-main-green flex justify-center items-center'>
                    <div className="h-1/6 w-3/6 md:w-3/6 lg:w-6/12 xl:w-4/12">
                        <div className='flex flex-row items-center h-full w-full'>
                            <img src={bubbleSVG} alt='bubbleSVG' className='h-10 w-10 mr-4' />
                            <h1 className='font-bold text-xl md:text-3xl whitespace-nowrap'>Texting-App</h1>
                        </div>
                    </div>
                </header>

                {
                    isShowLogin ?
                        cardLogin()
                        :
                        cardRegister()
                }

            </div>
    )
}

