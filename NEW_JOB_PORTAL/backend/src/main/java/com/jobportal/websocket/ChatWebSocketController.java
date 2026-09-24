package com.jobportal.websocket;

import com.jobportal.dto.CallSignalDto;
import com.jobportal.dto.MessageDto;
import com.jobportal.dto.SendMessageRequest;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.CallService;
import com.jobportal.service.ChatService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;
    private final CallService callService;
    private final UserRepository userRepository;

    public ChatWebSocketController(
            ChatService chatService,
            CallService callService,
            UserRepository userRepository) {
        this.chatService = chatService;
        this.callService = callService;
        this.userRepository = userRepository;
    }

    /**
     * STOMP Message Handler: /app/chat.send/{conversationId}
     */
    @MessageMapping("/chat.send/{conversationId}")
    public void handleChatMessage(
            @DestinationVariable Long conversationId,
            @Payload SendMessageRequest request,
            Principal principal) {
        if (principal != null) {
            userRepository.findByEmail(principal.getName()).ifPresent(user -> {
                chatService.sendMessage(conversationId, request, user);
            });
        }
    }

    /**
     * STOMP WebRTC Signal Handler: /app/call.signal/{channelName}
     */
    @MessageMapping("/call.signal/{channelName}")
    public void handleCallSignal(
            @DestinationVariable String channelName,
            @Payload CallSignalDto signal,
            Principal principal) {
        User user = null;
        if (principal != null) {
            user = userRepository.findByEmail(principal.getName()).orElse(null);
        }
        callService.relaySignal(channelName, signal, user);
    }
}
