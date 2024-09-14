import logoutSVG from '@src/assets/logout.svg'
import { deleteTokensInLocalStorage } from '@src/service/auth.service'
import { useNavigate } from 'react-router-dom'

export default function SideBar() {
    const navigate = useNavigate()
    const handleLogout = () => {
        deleteTokensInLocalStorage()
        navigate('/')
    }

    return (
        <div className="w-24 h-full bg-color-sidebar" >
            <div onClick={handleLogout} className="mt-10 w-full h-20 hover:bg-item-menu-selected hover:cursor-pointer">
                <div className='h-full w-full flex justify-center items-center'>
                    <img src={logoutSVG} alt='bubbleSVG' className='h-8 w-8' />
                </div>
            </div>
        </div >

    )
}
