import Avatar from "react-avatar"
import useItemChatMenu from "./useItemChatMenu"
import { ChatDTO } from "@src/dtos/Chat.dto"

export function ItemChatMenu({ infoChat }: { infoChat: ChatDTO }) {

    const { personToTalk } = useItemChatMenu(infoChat)

    return (
        personToTalk &&
        <div className='relative w-full h-20 hover:bg-item-menu-selected hover:cursor-pointer' >
            <div className='h-full w-full flex items-center px-5'>
                <Avatar name={personToTalk.name} size="45" textSizeRatio={2.7} className='rounded-full' />
                <p className='ml-8'>{personToTalk.name}</p>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 border-b-[1px] border-white"></div>
        </div >

    )
}