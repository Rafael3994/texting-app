import addChatSVG from '@src/assets/addChat.svg'
import useChatMenu from './useChatMenu';
import { ItemChatMenu } from './Item/ItemChatMenu';

export default function ChatMenu() {

    const { chats } = useChatMenu()

    return (
        <div className="w-96 h-full bg-menu-chats-background">

            <div className='w-full h-full flex flex-col'>

                <div className="w-full h-16 px-12 pt-5 mb-3">
                    <div className="w-full h-full flex flex-row items-center justify-between">
                        <h3 className='font-semibold text-xl'>Chats</h3>
                        <div className='w-12 h-12 rounded-full hover:bg-color-sidebar hover:cursor-pointer hover:drop-shadow-2xl hover:border hover:border-[#ffffff53] hover:shadow-white flex justify-center items-center'>
                            <img src={addChatSVG} alt='addChatSVG' className='h-8 w-8' />
                        </div>
                    </div>
                </div>


                <div className='w-full flex-grow overflow-y-auto'>
                    {
                        chats.length > 0 ?
                            chats.map((item, index) => {
                                return <ItemChatMenu infoChat={item} key={index} />
                            })
                            :
                            <div className='h-full w-full flex justify-center'>
                                <h1 className='font-semibold text-md mt-10'>Without chats</h1>
                            </div>
                    }
                </div>

            </div>
        </div>
    )
}
