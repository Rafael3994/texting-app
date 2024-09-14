import addChatSVG from '@src/assets/addChat.svg'
import Avatar from 'react-avatar';

export default function ChatMenu() {
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
                        [...Array(20).keys()].map((item, index) => {
                            return <ItemChatMenu key={index} />
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export function ItemChatMenu() {
    return (
        <div className='relative w-full h-20'>
            <div className='h-full w-full flex items-center px-5'>
                <Avatar name="Foo Bar" size="45" textSizeRatio={2.7} className='rounded-full' />
                <p className='ml-8'>Foo Bar</p>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 border-b-[1px] border-white"></div>
        </div>
    )
}
