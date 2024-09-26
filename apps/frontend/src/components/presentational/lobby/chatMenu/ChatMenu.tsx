import addChatSVG from '@src/assets/addChat.svg'
import useChatMenu from './useChatMenu';
import { ItemChatMenu } from './Item/ItemChatMenu';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export default function ChatMenu() {

    const { chats, userLogged, isLoading, handleCreateChatPopup } = useChatMenu()

    return (
        <>

            {/* LANDSCAPE */}
            <div className="hidden md:block w-3/12 h-full bg-menu-chats-background">
                <div className='w-full h-full flex flex-col'>

                    <div className="w-full h-16 px-3 pt-5 mb-5 flex flex-col items-center">
                        <h3 className='font-semibold text-lg'>{userLogged?.email}</h3>
                        <p className='text-sm lg:w-full md:w-40 min-h-12 text-center'>
                            {userLogged?.id}
                        </p>
                    </div>

                    <div className="w-full h-16 pt-5 mb-3">
                        <div className="w-full h-full flex flex-row items-center justify-around">
                            <h3 className='font-semibold text-xl'>Chats</h3>
                            <div
                                onClick={handleCreateChatPopup}
                                className='w-12 h-12 rounded-full hover:bg-color-sidebar hover:cursor-pointer hover:drop-shadow-2xl hover:border hover:border-[#ffffff53] hover:shadow-white flex justify-center items-center'>
                                <img src={addChatSVG} alt='addChatSVG' className='h-8 w-8' />
                            </div>
                        </div>
                    </div>


                    <div className='w-full flex-grow overflow-y-auto'>
                        {isLoading ? (
                            [...Array(2).keys()].map((i) => {
                                return <SkeletonTheme key={i} baseColor="#202020" highlightColor="#444">
                                    <Skeleton count={1} className='h-20' />
                                </SkeletonTheme>
                            })
                        ) : (
                            chats.length > 0 ?
                                <div>
                                    {chats.map((item, index) => {
                                        return <ItemChatMenu infoChat={item} key={index} />
                                    })}
                                </div>
                                :
                                <div className='h-full w-full flex justify-center'>
                                    <h1 className='font-semibold text-md mt-10'>Without chats</h1>
                                </div>
                        )}
                    </div>

                </div>
            </div >

            {/* MOBILE */}
            <div className='md:hidden sm:block h-full w-full bg-menu-chats-background'>
                <div className='w-full h-36 fixed top-[5rem] z-10 bg-menu-chats-background'>
                    <div className="w-full h-16 px-3 pt-5 mb-5 flex flex-col items-center">
                        <h3 className='font-semibold text-lg'>{userLogged?.email}</h3>
                        <p className='text-sm lg:w-full md:w-40 min-h-12 text-center'>
                            {userLogged?.id}
                        </p>
                    </div>

                    <div className="w-full h-16 pt-5 mb-3">
                        <div className="w-full h-full flex flex-row items-center justify-around">
                            <h3 className='font-semibold text-xl'>Chats</h3>
                            <div
                                onClick={handleCreateChatPopup}
                                className='w-12 h-12 rounded-full hover:bg-color-sidebar hover:cursor-pointer hover:drop-shadow-2xl hover:border hover:border-[#ffffff53] hover:shadow-white flex justify-center items-center'>
                                <img src={addChatSVG} alt='addChatSVG' className='h-8 w-8' />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full h-auto mt-[14rem] overflow-y bg-menu-chats-background'>
                    {isLoading ? (
                        [...Array(2).keys()].map((i) => {
                            return <SkeletonTheme key={i} baseColor="#202020" highlightColor="#444">
                                <Skeleton count={1} className='h-20' />
                            </SkeletonTheme>
                        })
                    ) : (
                        chats.length > 0 ?
                            <div>
                                {chats.map((item, index) => {
                                    return <ItemChatMenu infoChat={item} key={index} />
                                })}
                            </div>
                            :
                            <div className='h-full w-full flex justify-center'>
                                <h1 className='font-semibold text-md mt-10'>Without chats</h1>
                            </div>
                    )}
                </div>

            </div>
        </>
    )
}
