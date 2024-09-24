import ChatMenu from '@src/components/presentational/lobby/chatMenu/ChatMenu'
import Clipboard from '@src/components/presentational/lobby/clipboard/Clipboard'
import SideBar from '@src/components/presentational/lobby/SideBar'
import useChatSelectedContext from '@src/context/chat/useChatSelectedContext'
import { isTokensInLocalStorage } from '@src/service/auth.service'
import { createConnection } from '@src/service/webSocket'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

export default function LobbyPage() {

    const { getChatSelected } = useChatSelectedContext()
    useEffect(() => {
        createConnection()
    }, [])

    useEffect(() => { }, [getChatSelected])

    return (
        isTokensInLocalStorage() ? (
            <>
                {/* LANDSCAPE */}
                <div className='hidden md:block h-full w-full overflow-hidden'>
                    <div className="h-full w-full flex flex-row">
                        <SideBar />
                        <ChatMenu />
                        <Clipboard />
                    </div>
                </div>

                {/* MOBILE */}
                <div className='h-full w-full bg-purple-200 md:hidden sm:block overflow-hidden'>
                    <div className="h-full w-full flex flex-col">
                        {
                            getChatSelected() === null ?
                                <>
                                    <SideBar />
                                    <ChatMenu />
                                </>
                                :
                                < Clipboard />
                        }
                    </div>
                </div>
            </>
        )
            :
            <Navigate to="/" />
    )
}
