import ChatMenu from '@src/components/presentational/lobby/chatMenu/ChatMenu'
import Clipboard from '@src/components/presentational/lobby/clipboard/Clipboard'
import SideBar from '@src/components/presentational/lobby/SideBar'
import { isTokensInLocalStorage } from '@src/service/auth.service'
import { Navigate } from 'react-router-dom'

export default function LobbyPage() {
    return (
        isTokensInLocalStorage() ? (
            <div className='h-full w-full overflow-hidden'>
                <div className="h-full w-full flex flex-row">
                    <SideBar />
                    <ChatMenu />
                    <Clipboard />
                </div>
            </div>
        )
            :
            <Navigate to="/" />
    )
}
