import toast, { Toaster } from "react-hot-toast";

export function toastErrorToShow(message: string ) {
    return toast.error(message, {
        style: {
            borderRadius: '10px',
            border: '1px #f44336 solid',
            background: '#fff',
            color: '#000',
            fontWeight: 500,
            padding: '16px',
            fontSize: '14px',
        },
        icon: '❌', // Custom icon
    });
}

function NotificacionError() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
            }}
        />
    )
}

export default NotificacionError