package com.jobportal.controller;

import com.jobportal.dto.ConversationDto;
import com.jobportal.dto.MessageDto;
import com.jobportal.dto.SendMessageRequest;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.UserPrincipal;
import com.jobportal.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final UserRepository userRepository;

    public ChatController(ChatService chatService, UserRepository userRepository) {
        this.chatService = chatService;
        this.userRepository = userRepository;
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(chatService.getUserConversations(user));
    }

    @PostMapping("/conversations")
    public ResponseEntity<ConversationDto> startConversation(
            @RequestBody Map<String, Long> payload,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long targetUserId = payload.get("targetUserId");
        Long jobId = payload.get("jobId");

        User currentUser = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(chatService.getOrCreateConversation(targetUserId, jobId, currentUser));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User currentUser = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(chatService.getConversationMessages(id, currentUser));
    }

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable Long id,
            @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User currentUser = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(chatService.sendMessage(id, request, currentUser));
    }

    @PostMapping("/conversations/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User currentUser = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        chatService.markAsRead(id, currentUser);
        return ResponseEntity.ok().build();
    }
}
