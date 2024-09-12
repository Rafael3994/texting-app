import bubbleSVG from '@src/assets/bubble.svg';
import CustomInputEmail from '@src/components/presentational/CustomInputEmail';
import CustomInputPassword from '@src/components/presentational/CustomInputPassword';

export default function Login() {
    return (
        <div className='flex justify-center items-center flex-col'>
            <header className='h-56 w-full bg-main-green flex justify-center items-center'>
                <div className="h-1/6 w-3/6 md:w-3/6 lg:w-6/12 xl:w-4/12">
                    <div className='flex flex-row items-center h-full w-full'>
                        <img src={bubbleSVG} alt='bubbleSVG' className='h-10 w-10 mr-4' />
                        <h1 className='font-bold text-xl md:text-3xl whitespace-nowrap'>Texting-App</h1>
                    </div>
                </div>
            </header>
            <section className='h-80 w-4/6 md:w-3/6 lg:w-6/12 xl:w-4/12 bg-white rounded-lg z-10 shadow-2xl mt-[-4rem]'>
                <div className='h-full w-full flex flex-col items-center my-4'>
                    <h2 className='text-stone-800 font-bold text-xl md:text-3xl'>LOGIN</h2>

                    <div className='h-1/4 w-10/12 mt-3'>
                        <CustomInputEmail />
                    </div>
                    <div className='h-1/4 w-10/12 mt-3'>
                        <CustomInputPassword />
                    </div>

                    <button className="mt-4 bg-dark-green hover:bg-dark-green-hover text-white font-bold h-10 w-2/5 md:w-3/12 rounded-full">
                        Sing In
                    </button>

                </div>
            </section >
        </div >
    )
}
