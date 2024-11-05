import toast, { Toaster } from "react-hot-toast";

export function toastSuccesfulToShow(message: string) {
    return toast.success(message, {
        style: {
            borderRadius: '10px',
            border: '1px #00b894 solid',
            background: '#fff',
            color: '#000',
            fontWeight: 500,
            padding: '16px',
            fontSize: '14px',
        },
        icon: '✅',
    });
}

function NotificacionSuccesful() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
            }}
        />
    )
}

export default NotificacionSuccesful