export interface IMessageBubble {
    text: string;
    isSentByUser: boolean;
}

export default function MessageBubble({ text, isSentByUser }: IMessageBubble) {
    return (
        <div
        className={`max-w-[80%] 
        p-2.5 m-[5px_0] 
        rounded-lg ${isSentByUser ? 'bg-text-background self-end' : 'bg-color-sidebar self-start'}
        shadow-md break-words text-white
        `}
        >
            {text}
        </div>

    )
}
