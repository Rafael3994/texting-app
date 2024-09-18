import Avatar from "react-avatar"
import useItemChatMenu from "./useItemChatMenu"
import { ChatDTO } from "@src/dtos/Chat.dto"
import deleteSVG from '@src/assets/delete.svg'

export function ItemChatMenu({ infoChat }: { infoChat: ChatDTO }) {

    const { personToTalk, handleDeleteChatPopup } = useItemChatMenu(infoChat)

    return (
        personToTalk &&
        <div className='relative w-full h-20 hover:bg-item-menu-selected hover:cursor-pointer' >
            <div className='h-full w-full flex items-center px-5 hover:cursor-pointer'>
                <Avatar name={personToTalk.name} size="45" textSizeRatio={2.7} className='rounded-full' />
                <p className='ml-8'>{personToTalk.name}</p>
                <div className="h-full w-full flex flex-row-reverse items-center">
                    <div onClick={() => handleDeleteChatPopup(infoChat.id)} className="h-10 w-10 flex justify-center items-center hover:bg-menu-chats-background hover:border hover:border-[#ffffff53] hover:shadow-white hover:rounded-full">
                        <img src={deleteSVG} alt="delete" className='h-7 w-7' />
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 border-b-[1px] border-white"></div>
        </div >

    )
}