import useChatSelectedContext from '@src/context/chat/useChatSelectedContext'
import BarText from './bar-text/BarText'
import MessageBubble from './message-bubble/MessageBubble';
import useClipboard from './useClipboard';
import { getUserFromToken } from '@src/service/auth.service';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export default function Clipboard() {
    const { getChatSelected } = useChatSelectedContext()

    const { messages, isLoading } = useClipboard({ chatId: getChatSelected() })

    return (
        <div className="flex-grow h-full bg-clipboard-background">
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


    )
}
