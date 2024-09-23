import { io, Socket } from "socket.io-client";
import { getUserFromToken } from "./auth.service";
import { BACKEND_URL } from "./service.config";

export const EVENTS_NAMES = {
    CHAT_CREATED: 'chatCreated',
    CHAT_DELETED: 'chatDeleted',
    MESSAGE_CREATED: 'messageCreated',
    MESSAGE_DELETED: 'messageDeleted',
}

let socket: Socket | null = null
export const createConnection = () => {
    socket = io(BACKEND_URL, {
        auth: { userId: getUserFromToken()?.id }
    });
}

export const getSocketConnection = () => {
    return socket
}

export const disconnectSocketConnection = () => {
    socket?.disconnect();
}