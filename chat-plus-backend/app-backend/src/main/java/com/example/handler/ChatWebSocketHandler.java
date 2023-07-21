package com.example.handler;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@Service
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private List<WebSocketSession> webSocketSessions = new ArrayList<>();

    public List<WebSocketSession> getWebSocketSessions() {
        System.out.println(webSocketSessions);
        return webSocketSessions;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        webSocketSessions.add(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        for(WebSocketSession webSocketSession : webSocketSessions){

            JSONObject jsonObject = new JSONObject(message.getPayload());
            if (  jsonObject.isNull("message") ||  Objects.equals(jsonObject.getString("user"), "") || Objects.equals(jsonObject.getString("user"), " ") || Objects.equals(jsonObject.getString("message"), "") || Objects.equals(jsonObject.getString("message"), " ")  ) {
            }
            else {
                webSocketSession.sendMessage(message);
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        webSocketSessions.remove(session);
    }
}