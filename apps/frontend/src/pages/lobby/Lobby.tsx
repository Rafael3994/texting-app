import SideBar from '@src/components/presentational/SideBar'

export default function LobbyPage() {
    return (
        <div className='h-full w-full bg-purple-200'>
            <div className="h-full w-full flex flex-row">
                <SideBar />
                <div className="w-96 h-full bg-menu-chats-background"></div>
                <div className="flex-grow h-full bg-clipboard-background"></div>
            </div>
        </div>
    )
}
