package com.jobportal.controller;

import com.jobportal.dto.CallDto;
import com.jobportal.dto.CallSignalDto;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.UserPrincipal;
import com.jobportal.service.CallService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calls")
public class CallController {

    private final CallService callService;
    private final UserRepository userRepository;

    public CallController(CallService callService, UserRepository userRepository) {
        this.callService = callService;
        this.userRepository = userRepository;
    }

    @PostMapping("/initiate")
    public ResponseEntity<CallDto> initiateCall(
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long conversationId = Long.valueOf(payload.get("conversationId").toString());
        boolean isVideo = payload.containsKey("isVideo") && Boolean.parseBoolean(payload.get("isVideo").toString());

        User currentUser = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(callService.initiateCall(conversationId, isVideo, currentUser));
    }

    @PostMapping("/{channelName}/signal")
    public ResponseEntity<Void> sendSignal(
            @PathVariable String channelName,
            @RequestBody CallSignalDto signal,
            @AuthenticationPrincipal UserPrincipal principal) {
        User currentUser = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        callService.relaySignal(channelName, signal, currentUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<CallDto>> getCallHistory(@AuthenticationPrincipal UserPrincipal principal) {
        User currentUser = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(callService.getUserCallHistory(currentUser));
    }
}
