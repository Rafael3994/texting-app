import Avatar from "react-avatar"
import useItemChatMenu from "./useItemChatMenu"
import { ChatDTO } from "@src/dtos/Chat.dto"
import deleteSVG from '@src/assets/delete.svg'
import useChatSelectedContext from "@src/context/chat/useChatSelectedContext"

export function ItemChatMenu({ infoChat }: { infoChat: ChatDTO }) {

    const { personToTalk, handleDeleteChatPopup } = useItemChatMenu(infoChat)
    const { saveChatSelected, getChatSelected, deleteChatSelected } = useChatSelectedContext()

    const handleClickChat = () => {
        const chatSelected = getChatSelected()
        if (chatSelected === infoChat.id) {
            return deleteChatSelected()
        }
        return saveChatSelected(infoChat.id)
    }

    return (
        personToTalk &&
        <div onClick={handleClickChat}
            className={
                getChatSelected() === infoChat.id ?
                    'relative w-full h-20 bg-item-menu-selected hover:cursor-pointer'
                    :
                    'relative w-full h-20 hover:bg-item-menu-selected hover:cursor-pointer'
            }
        >
            <div className='h-full w-full flex items-center justify-around px-4 md:px-2'>
                <div className="h-full w-3/4 flex flex-row  items-center ml-2">
                    <Avatar name={personToTalk.name} size="45" textSizeRatio={2.7} className='rounded-full' />
                    <p className="max-h-full overflow-hidden ml-3">{personToTalk.name}</p>
                </div>
                <div className="h-full w-1/4 flex flex-row-reverse items-center">
                    <div onClick={(e: React.MouseEvent<HTMLDivElement>) => handleDeleteChatPopup(e, infoChat.id)} className="h-10 w-10 flex justify-center items-center hover:cursor-pointer hover:bg-menu-chats-background hover:border hover:border-[#ffffff53] hover:shadow-white hover:rounded-full">
                        <img src={deleteSVG} alt="delete" className='h-7 w-7' />
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 border-b-[1px] border-white"></div>
        </div >

    )
}