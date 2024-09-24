import useChatSelectedContext from '@src/context/chat/useChatSelectedContext'
import BarText from './bar-text/BarText'
import MessageBubble from './message-bubble/MessageBubble';
import useClipboard from './useClipboard';
import { getUserFromToken } from '@src/service/auth.service';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import goBackSVG from '@src/assets/goBack.svg'

export default function Clipboard() {
    const { getChatSelected, deleteChatSelected } = useChatSelectedContext()

    const { messages, isLoading } = useClipboard({ chatId: getChatSelected() })

    return (
        <>
            {/* Landscape */}
            <div className="hidden md:block md:w-8/12 h-full bg-clipboard-background">
                <div className='w-full h-full flex flex-col'>
                    {getChatSelected() && (
                        <div className='h-full w-full'>

                            <div className="flex flex-col h-full w-full">
                                <div className="flex-grow overflow-hidden overflow-y-scroll flex flex-col-reverse">
                                    <div className='flex flex-col p-10'>
                                        {
                                            isLoading ?
                                                Array.from({ length: 10 }, () => Math.random() < 0.5).map((res, i) => (
                                                    <SkeletonTheme key={i} baseColor="#202020" highlightColor="#444">
                                                        <div className={`flex ${res ? 'justify-end' : 'justify-start'} w-full`}>
                                                            <div
                                                                className={`max-w-[80%] p-2.5 m-[5px_0] rounded-lg`}
                                                            >
                                                                <Skeleton height={50} width="10rem" />
                                                            </div>
                                                        </div>
                                                    </SkeletonTheme>
                                                ))
                                                :

                                                messages.length > 0 &&
                                                messages.map((message, index) => (
                                                    <MessageBubble key={index} message={message} isSentByUser={
                                                        getUserFromToken()?.id === message.userId ? true : false
                                                    } />
                                                ))
                                        }
                                    </div>
                                </div>

                                <BarText />
                            </div>

                        </div>
                    )}
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden sm:block w-full h-full bg-clipboard-background">
                <div className='w-full h-20 bg-color-sidebar md:hidden sm:block fixed top-0'>
                    <div onClick={() => deleteChatSelected()} className="w-full h-20 hover:bg-item-menu-selected hover:cursor-pointer">
                        <div className='h-full w-full flex flex-row items-center'>
                            <img src={goBackSVG} alt='bubbleSVG' className='ml-10 h-8 w-8' />
                        </div>
                    </div>
                </div>

                <div className='w-full h-full flex flex-col mt-12'>
                    {getChatSelected() && (
                        <div className='h-full w-full'>

                            <div className="flex flex-col h-full w-full">
                                <div className="h-full overflow-hidden overflow-y-scroll flex flex-col-reverse pb-24">
                                    <div className='flex flex-col p-10'>
                                        {
                                            isLoading ?
                                                Array.from({ length: 10 }, () => Math.random() < 0.5).map((res, i) => (
                                                    <SkeletonTheme key={i} baseColor="#202020" highlightColor="#444">
                                                        <div className={`flex ${res ? 'justify-end' : 'justify-start'} w-full`}>
                                                            <div
                                                                className={`max-w-[80%] p-2.5 m-[5px_0] rounded-lg`}
                                                            >
                                                                <Skeleton height={50} width="10rem" />
                                                            </div>
                                                        </div>
                                                    </SkeletonTheme>
                                                ))
                                                :

                                                messages.length > 0 &&
                                                messages.map((message, index) => (
                                                    <MessageBubble key={index} message={message} isSentByUser={
                                                        getUserFromToken()?.id === message.userId ? true : false
                                                    } />
                                                ))
                                        }
                                    </div>
                                </div>

                                <BarText />
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
