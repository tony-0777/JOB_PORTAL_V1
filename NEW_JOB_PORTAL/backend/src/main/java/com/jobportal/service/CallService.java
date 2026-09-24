package com.jobportal.service;

import com.jobportal.dto.CallDto;
import com.jobportal.dto.CallSignalDto;
import com.jobportal.dto.ParticipantDto;
import com.jobportal.model.CallSession;
import com.jobportal.model.Conversation;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.CallSessionRepository;
import com.jobportal.repository.ConversationRepository;
import com.jobportal.repository.RecruiterProfileRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CallService {

    private final CallSessionRepository callSessionRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public CallService(
            CallSessionRepository callSessionRepository,
            ConversationRepository conversationRepository,
            UserRepository userRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.callSessionRepository = callSessionRepository;
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Requirement FR-CL-01, FR-CL-02 & Section 3.4:
     * Starts an in-app WebRTC call inside an existing conversation.
     */
    @Transactional
    public CallDto initiateCall(Long conversationId, boolean isVideo, User caller) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if ("BLOCKED".equalsIgnoreCase(conv.getStatus())) {
            throw new RuntimeException("Cannot initiate call: Conversation is blocked.");
        }

        // Callee is the other user in the conversation
        User callee = conv.getSeekerUser().getId().equals(caller.getId())
                ? conv.getRecruiterUser()
                : conv.getSeekerUser();

        String channelName = "room-" + UUID.randomUUID().toString();

        CallSession session = new CallSession();
        session.setConversation(conv);
        session.setCallerUser(caller);
        session.setCalleeUser(callee);
        session.setChannelName(channelName);
        session.setOutcome("RINGING");
        session.setStartedAt(LocalDateTime.now());
        session.setDurationSec(0);

        CallSession saved = callSessionRepository.save(session);
        CallDto dto = toCallDto(saved);

        // Notify callee via WebSocket signaling
        CallSignalDto signal = new CallSignalDto();
        signal.setType("CALL_REQUEST");
        signal.setCallId(saved.getId());
        signal.setConversationId(conversationId);
        signal.setCaller(dto.getCaller());
        signal.setCallee(dto.getCallee());
        signal.setChannelName(channelName);
        signal.setVideo(isVideo);

        // Send to conversation channel and callee's queue
        messagingTemplate.convertAndSend("/topic/call." + channelName, signal);
        messagingTemplate.convertAndSend("/topic/calls.user." + callee.getId(), signal);

        return dto;
    }

    @Transactional
    public void relaySignal(String channelName, CallSignalDto signal, User currentUser) {
        CallSession session = callSessionRepository.findByChannelName(channelName).orElse(null);
        if (session != null) {
            if ("CALL_ACCEPTED".equalsIgnoreCase(signal.getType())) {
                session.setOutcome("ACTIVE");
                callSessionRepository.save(session);
            } else if ("CALL_DECLINED".equalsIgnoreCase(signal.getType())) {
                session.setOutcome("DECLINED");
                session.setEndedAt(LocalDateTime.now());
                callSessionRepository.save(session);
            } else if ("CALL_ENDED".equalsIgnoreCase(signal.getType())) {
                session.setOutcome("COMPLETED");
                session.setEndedAt(LocalDateTime.now());
                if (session.getStartedAt() != null) {
                    long sec = java.time.Duration.between(session.getStartedAt(), session.getEndedAt()).getSeconds();
                    session.setDurationSec((int) sec);
                }
                callSessionRepository.save(session);
            }
        }

        // Broadcast WebRTC SDP offer, answer, or candidate
        messagingTemplate.convertAndSend("/topic/call." + channelName, signal);
    }

    public List<CallDto> getUserCallHistory(User currentUser) {
        return callSessionRepository.findByUser(currentUser)
                .stream()
                .map(this::toCallDto)
                .collect(Collectors.toList());
    }

    public CallDto toCallDto(CallSession session) {
        CallDto dto = new CallDto();
        dto.setId(session.getId());
        dto.setConversationId(session.getConversation().getId());

        String callerCompany = null;
        if (session.getCallerUser().getRole() == Role.ROLE_RECRUITER) {
            callerCompany = recruiterProfileRepository.findByUser(session.getCallerUser())
                    .map(rp -> rp.getCompany().getName()).orElse(null);
        }
        dto.setCaller(ParticipantDto.fromUser(session.getCallerUser(), callerCompany));

        String calleeCompany = null;
        if (session.getCalleeUser().getRole() == Role.ROLE_RECRUITER) {
            calleeCompany = recruiterProfileRepository.findByUser(session.getCalleeUser())
                    .map(rp -> rp.getCompany().getName()).orElse(null);
        }
        dto.setCallee(ParticipantDto.fromUser(session.getCalleeUser(), calleeCompany));

        dto.setChannelName(session.getChannelName());
        dto.setOutcome(session.getOutcome());
        dto.setDurationSec(session.getDurationSec());
        dto.setStartedAt(session.getStartedAt());
        dto.setEndedAt(session.getEndedAt());
        return dto;
    }
}
