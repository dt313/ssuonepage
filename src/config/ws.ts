import { useAuthStore } from '@/store/use-auth-store';

let socket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;

const MAX_RETRIES = 10;
const BASE_DELAY = 1000; // 1s
const MAX_DELAY = 15000; // 15s

export const getSocket = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        return socket;
    }

    if (socket && socket.readyState === WebSocket.CONNECTING) {
        return socket;
    }

    connect();
    return socket!;
};

const connect = () => {
    socket = new WebSocket('ws://localhost:5555/api/v1/ws');

    socket.onopen = () => {
        console.log('✅ WS connected');
        reconnectAttempts = 0;
    };

    socket.onclose = () => {
        console.warn('❌ WS disconnected');
        scheduleReconnect();
    };

    socket.onerror = () => {
        socket?.close();
    };
};

const scheduleReconnect = () => {
    if (reconnectAttempts >= MAX_RETRIES) {
        console.error('🚫 WS reconnect failed');
        return;
    }

    if (reconnectTimer) return;

    const delay = Math.min(BASE_DELAY * 2 ** reconnectAttempts, MAX_DELAY);

    reconnectAttempts++;

    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        console.log(`🔁 Reconnecting WS (${reconnectAttempts})`);
        connect();
    }, delay);
};

export const closeSocket = () => {
    reconnectTimer && clearTimeout(reconnectTimer);
    reconnectTimer = null;
    reconnectAttempts = 0;
    socket?.close();
    socket = null;
};
