package com.jobportal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Section 1 & Section 3:
 * WebSocket STOMP endpoint configuration for real-time chat and WebRTC signaling.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Handshake endpoint for Angular STOMP client
        registry.addEndpoint("/ws-jobportal")
                .setAllowedOriginPatterns("*")
                .withSockJS();
        
        // Also support plain websocket for flexibility
        registry.addEndpoint("/ws-jobportal")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Destinations clients can subscribe to
        registry.enableSimpleBroker("/topic", "/queue", "/user");
        
        // Prefix for messages routed to @MessageMapping handlers
        registry.setApplicationDestinationPrefixes("/app");
        
        // Specific prefix for user-targeted notifications and signaling
        registry.setUserDestinationPrefix("/user");
    }
}
