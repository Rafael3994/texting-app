import useChatSelectedContext from "@src/context/chat/useChatSelectedContext"

export default function Clipboard() {
    const { getChatSelected } = useChatSelectedContext()
    return (
        <div className="flex-grow h-full bg-clipboard-background">
            {getChatSelected()}
        </div>
    )
}
