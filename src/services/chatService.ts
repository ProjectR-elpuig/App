import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { API_CONFIG } from '../config';

let stompClient: Client | null = null;
let subscription: StompSubscription | null = null;

export const connectToChat = (
    token: string,
    contactId: string,
    onMessage: (msg: any) => void
) => {
    if (stompClient?.connected) return;

    stompClient = new Client({
        brokerURL: `${API_CONFIG.BASE_URL_WS}/ws-chat`,
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
            console.log('[WebSocket]', str);
        },
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('[WebSocket] Connected');

            // Suscribirse a los mensajes de ese contacto
            subscription = stompClient?.subscribe(`/topic/messages/${contactId}`, (message: IMessage) => {
                const parsedMessage = JSON.parse(message.body);
                onMessage(parsedMessage);
            });
        },
        onStompError: (frame) => {
            console.error('[WebSocket Error]', frame.headers['message'], frame.body);
        },
    });

    stompClient.activate();
};

export const disconnectChat = () => {
    subscription?.unsubscribe();
    stompClient?.deactivate();
    subscription = null;
    stompClient = null;
};

export const sendMessage = (
    contactId: string,
    content: string,
    receiverPhone: string
) => {
    if (!stompClient?.connected) {
        console.warn('[WebSocket] Not connected');
        return;
    }

    const payload = {
        content,
        receiverPhone,
    };

    stompClient.publish({
        destination: `/app/send-message/${contactId}`,
        body: JSON.stringify(payload),
    });
};
