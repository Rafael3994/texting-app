import { TextPublicDTO } from "@src/dtos/Text.dto";
import { deleteMessage } from "@src/service/text.service";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export interface IMessageBubble {
    message: TextPublicDTO;
    isSentByUser: boolean;
}

export default function MessageBubble({ message, isSentByUser }: IMessageBubble) {
    const MySwal = withReactContent(Swal);
    const handleDeleteText = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        try {
            e.preventDefault()
            await MySwal.fire({
                title: "Do you are sure you want to delete the message?",
                heightAuto: false,
                showCancelButton: true,
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    try {
                        if (!message.id) return
                        const deletedChat = await deleteMessage(message.id)
                        if (!deletedChat) {
                            return Swal.showValidationMessage(`The message couldn't be deleted.`);
                        }
                    } catch (err) {
                        console.log('err popup preConfir handleDeleteText:', err);
                    }
                },
            });
        } catch (error) {
            console.error("Error showing popup handleDeleteText", error);
        }
    }
    return (
        <div
            onContextMenu={isSentByUser ? handleDeleteText : undefined}
            className={`max-w-[80%] 
        p-2.5 m-[5px_0] 
        rounded-lg ${isSentByUser ? 'bg-text-background self-end' : 'bg-color-sidebar self-start'}
        shadow-md break-words text-white
        `}
        >
            {message.text}
        </div>

    )
}
