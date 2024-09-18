import ChatMenu from '@src/components/presentational/lobby/chatMenu/ChatMenu'
import SideBar from '@src/components/presentational/lobby/SideBar'
import { isTokensInLocalStorage } from '@src/service/auth.service'
import { Navigate } from 'react-router-dom'

export default function LobbyPage() {

    return (
        isTokensInLocalStorage() ? (
            <div className='h-full w-full' >
                <div className="h-full w-full flex flex-row">
                    <SideBar />
                    <ChatMenu />
                    <div className="flex-grow h-full bg-clipboard-background"></div>
                </div>
            </div>
        )
            :
            <Navigate to="/" />
    )
}
