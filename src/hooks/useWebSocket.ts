import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "../context/AuthContext";
import { API_CONFIG } from "../config";

export const useWebSocket = (onMessageReceived: (message: any) => void) => {
  const { user } = useAuth();

  const connect = () => {
    const client = new Client({
      brokerURL: `${API_CONFIG.BASE_URL}/ws`,
      webSocketFactory: () => new SockJS(`${API_CONFIG.BASE_URL}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${user?.token || ""}`,
      },
      debug: (str) => console.debug(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        client.subscribe(
          `/user/${user?.phoneNumber}/queue/messages`,
          (message) => {
            console.log("AQUI" + JSON.parse(message.body));
            onMessageReceived(JSON.parse(message.body));
          }
        );
      },
    });

    client.activate();
    return client;
  };

  return { connect };
};
