import useChatSelectedContext from '@src/context/chat/useChatSelectedContext'
import BarText from './bar-text/BarText'
import MessageBubble from './message-bubble/MessageBubble';
import useClipboard from './useClipboard';
import { getUserFromToken } from '@src/service/auth.service';

export default function Clipboard() {
    const { getChatSelected } = useChatSelectedContext()

    // const dummyConversation = [
    //     { text: "Hola, ¿cómo estás?", isSentByUser: false },
    //     { text: "¡Hola! Estoy bien, gracias. ¿Y tú?", isSentByUser: true },
    //     { text: "También estoy bien. ¿Qué planes tienes para hoy?", isSentByUser: false },
    //     { text: "Pensaba salir a correr un rato. ¿Y tú?", isSentByUser: true },
    //     { text: "Yo tengo que hacer algunas compras. Luego, si quieres, podemos quedar.", isSentByUser: false },
    //     { text: "¡Perfecto! Me avisas cuando estés libre.", isSentByUser: true },
    //     { text: "Claro, te llamo más tarde.", isSentByUser: false },
    //     { text: "De acuerdo, ¡nos vemos luego!", isSentByUser: true },
    //     { text: "Hasta luego!", isSentByUser: false },
    //     { text: "Hola, ¿cómo estás?", isSentByUser: false },
    //     { text: "¡Hola! Estoy bien, gracias. ¿Y tú?", isSentByUser: true },
    //     { text: "También estoy bien. ¿Qué planes tienes para hoy?", isSentByUser: false },
    //     { text: "Pensaba salir a correr un rato. ¿Y tú?", isSentByUser: true },
    //     { text: "Yo tengo que hacer algunas compras. Luego, si quieres, podemos quedar.", isSentByUser: false },
    //     { text: "¡Perfecto! Me avisas cuando estés libre.", isSentByUser: true },
    //     { text: "Claro, te llamo más tarde.", isSentByUser: false },
    //     { text: "De acuerdo, ¡nos vemos luego!", isSentByUser: true },
    //     { text: "Hasta luego!", isSentByUser: false },
    // ];

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
                                            <MessageBubble key={index} text={message.text} isSentByUser={
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
