import useChatSelectedContext from '@src/context/chat/useChatSelectedContext'
import BarText from './bar-text/BarText'
import MessageBubble from './message-bubble/MessageBubble';
import useClipboard from './useClipboard';
import { getUserFromToken } from '@src/service/auth.service';

export default function Clipboard() {
    const { getChatSelected } = useChatSelectedContext()

    const { messages } = useClipboard({ chatId: getChatSelected() })

    return (
        <div className="flex-grow h-full bg-clipboard-background">
            <div className='w-full h-full flex flex-col'>
                {getChatSelected() && (
                    <div className='h-full w-full'>

                        <div className="flex flex-col h-full w-full">
                            <div className="flex-grow overflow-hidden overflow-y-scroll flex flex-col-reverse">
                                <div className='flex flex-col p-10'>
                                    {messages.length > 0 &&
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
