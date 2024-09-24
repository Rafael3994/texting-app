import logoutSVG from '@src/assets/logout.svg'
import useChatSelectedContext from '@src/context/chat/useChatSelectedContext'
import { deleteTokensInLocalStorage } from '@src/service/auth.service'
import { useNavigate } from 'react-router-dom'

export default function SideBar() {
    const navigate = useNavigate()
    const { deleteChatSelected } = useChatSelectedContext()
    const handleLogout = () => {
        deleteTokensInLocalStorage()
        deleteChatSelected()
        navigate('/')
    }

    return (
        <>
            {/* LANDSCAPE */}
            <div className="w-1/12 h-full hidden md:block bg-color-sidebar overflow-hidden" >
                <div onClick={handleLogout} className="mt-10 w-full h-20 hover:bg-item-menu-selected hover:cursor-pointer">
                    <div className='h-full w-full flex justify-center items-center'>
                        <img src={logoutSVG} alt='bubbleSVG' className='h-8 w-8' />
                    </div>
                </div>
            </div >

            {/* MOBILE */}
            <div className='w-full h-20 bg-color-sidebar md:hidden sm:block fixed top-0'>
                <div onClick={handleLogout} className="w-full h-20 hover:bg-item-menu-selected hover:cursor-pointer">
                    <div className='h-full w-full flex flex-row-reverse items-center'>
                        <img src={logoutSVG} alt='bubbleSVG' className='mr-10 h-8 w-8' />
                    </div>
                </div>
            </div>

        </>

    )
}
