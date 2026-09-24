package com.jobportal.service;

import com.jobportal.dto.ConversationDto;
import com.jobportal.dto.MessageDto;
import com.jobportal.dto.ParticipantDto;
import com.jobportal.dto.SendMessageRequest;
import com.jobportal.model.*;
import com.jobportal.repository.*;
import com.jobportal.util.ContactMaskingUtil;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatService(
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            SeekerProfileRepository seekerProfileRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.seekerProfileRepository = seekerProfileRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Requirement FR-CH-02 & Section 3.2:
     * Check if user is allowed to initiate a conversation.
     */
    public boolean canInitiateConversation(User initiator, User target, Long jobId) {
        if (initiator.getId().equals(target.getId())) {
            return false;
        }

        // If conversation already exists, communication is permitted
        if (!conversationRepository.findBetweenUsers(initiator, target).isEmpty()) {
            return true;
        }

        // Case 1: Seeker contacting Recruiter
        if (initiator.getRole() == Role.ROLE_SEEKER && target.getRole() == Role.ROLE_RECRUITER) {
            if (jobId != null) {
                Job job = jobRepository.findById(jobId).orElse(null);
                if (job != null && applicationRepository.existsByJobAndSeekerUser(job, initiator)) {
                    return true;
                }
            }
            // Check any job applied by seeker under target recruiter
            return false;
        }

        // Case 2: Recruiter contacting Seeker
        if (initiator.getRole() == Role.ROLE_RECRUITER && target.getRole() == Role.ROLE_SEEKER) {
            // Either seeker applied to recruiter's job, OR candidate has public visibility
            Optional<SeekerProfile> seekerProfile = seekerProfileRepository.findByUser(target);
            if (seekerProfile.isPresent() && !"PRIVATE".equalsIgnoreCase(seekerProfile.get().getPrivacyVisibility())) {
                return true;
            }
            if (jobId != null) {
                Job job = jobRepository.findById(jobId).orElse(null);
                return job != null && applicationRepository.existsByJobAndSeekerUser(job, target);
            }
        }

        return initiator.getRole() == Role.ROLE_ADMIN;
    }

    @Transactional
    public ConversationDto getOrCreateConversation(Long targetUserId, Long jobId, User currentUser) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        if (!canInitiateConversation(currentUser, targetUser, jobId)) {
            throw new RuntimeException("Initiation policy violation: Candidate must apply or allow contact (FR-CH-02).");
        }

        User seeker = currentUser.getRole() == Role.ROLE_SEEKER ? currentUser : targetUser;
        User recruiter = currentUser.getRole() == Role.ROLE_RECRUITER ? currentUser : targetUser;

        Job job = jobId != null ? jobRepository.findById(jobId).orElse(null) : null;
        Application application = job != null ? applicationRepository.findByJobAndSeekerUser(job, seeker).orElse(null) : null;

        Conversation conv = conversationRepository.findByJobAndSeekerUserAndRecruiterUser(job, seeker, recruiter)
                .orElseGet(() -> {
                    Conversation newConv = new Conversation();
                    newConv.setJob(job);
                    newConv.setApplication(application);
                    newConv.setSeekerUser(seeker);
                    newConv.setRecruiterUser(recruiter);
                    newConv.setStatus("ACTIVE");
                    newConv.setLastMessage("Conversation started");
                    newConv.setLastMessageAt(LocalDateTime.now());
                    return conversationRepository.save(newConv);
                });

        return toConversationDto(conv, currentUser);
    }

    public List<ConversationDto> getUserConversations(User currentUser) {
        return conversationRepository.findByUser(currentUser)
                .stream()
                .map(conv -> toConversationDto(conv, currentUser))
                .collect(Collectors.toList());
    }

    public List<MessageDto> getConversationMessages(Long conversationId, User currentUser) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        validateParticipant(conv, currentUser);

        // Reset unread counter for current reader
        if (currentUser.getId().equals(conv.getSeekerUser().getId())) {
            conv.setSeekerUnreadCount(0);
        } else {
            conv.setRecruiterUnreadCount(0);
        }
        conversationRepository.save(conv);

        return messageRepository.findByConversationOrderBySentAtAsc(conv)
                .stream()
                .map(this::toMessageDto)
                .collect(Collectors.toList());
    }

    /**
     * Requirement FR-CH-01, FR-CH-05, and FR-PV-02:
     * De-duplicates on clientMsgId, masks contact info, persists, updates unread count,
     * and broadcasts over WebSocket STOMP.
     */
    @Transactional
    public MessageDto sendMessage(Long conversationId, SendMessageRequest request, User currentUser) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        validateParticipant(conv, currentUser);

        if ("BLOCKED".equalsIgnoreCase(conv.getStatus())) {
            throw new RuntimeException("Cannot send message: This conversation is blocked.");
        }

        // FR-CH-05: Deduplication via clientMsgId
        if (request.getClientMsgId() != null && messageRepository.existsByClientMsgId(request.getClientMsgId())) {
            return toMessageDto(messageRepository.findByClientMsgId(request.getClientMsgId()).get());
        }

        // FR-PV-02: Server-side contact masking (phone and email)
        boolean hasContact = ContactMaskingUtil.containsContactInfo(request.getBody());
        String sanitizedBody = ContactMaskingUtil.maskSensitiveContacts(request.getBody());

        Message message = new Message();
        message.setConversation(conv);
        message.setClientMsgId(request.getClientMsgId() != null ? request.getClientMsgId() : java.util.UUID.randomUUID().toString());
        message.setSenderUser(currentUser);
        message.setBody(sanitizedBody);
        message.setAttachmentUrl(request.getAttachmentUrl());
        message.setStatus("SENT");
        message.setContactMasked(hasContact);
        message.setSentAt(LocalDateTime.now());

        Message saved = messageRepository.save(message);

        // Update conversation summary
        conv.setLastMessage(sanitizedBody);
        conv.setLastMessageAt(LocalDateTime.now());
        if (currentUser.getId().equals(conv.getSeekerUser().getId())) {
            conv.setRecruiterUnreadCount(conv.getRecruiterUnreadCount() + 1);
        } else {
            conv.setSeekerUnreadCount(conv.getSeekerUnreadCount() + 1);
        }
        conversationRepository.save(conv);

        MessageDto messageDto = toMessageDto(saved);

        // Real-time broadcast to STOMP destination
        messagingTemplate.convertAndSend("/topic/conversation." + conversationId, messageDto);

        return messageDto;
    }

    @Transactional
    public void markAsRead(Long conversationId, User currentUser) {
        Conversation conv = conversationRepository.findById(conversationId).orElse(null);
        if (conv != null) {
            validateParticipant(conv, currentUser);
            if (currentUser.getId().equals(conv.getSeekerUser().getId())) {
                conv.setSeekerUnreadCount(0);
            } else {
                conv.setRecruiterUnreadCount(0);
            }
            conversationRepository.save(conv);
        }
    }

    private void validateParticipant(Conversation conv, User user) {
        if (!conv.getSeekerUser().getId().equals(user.getId()) &&
            !conv.getRecruiterUser().getId().equals(user.getId()) &&
            user.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("Access denied: Not a participant in this conversation.");
        }
    }

    public ConversationDto toConversationDto(Conversation conv, User currentUser) {
        ConversationDto dto = new ConversationDto();
        dto.setId(conv.getId());
        if (conv.getJob() != null) {
            dto.setJobId(conv.getJob().getId());
            dto.setJobTitle(conv.getJob().getTitle());
        }
        if (conv.getApplication() != null) {
            dto.setApplicationId(conv.getApplication().getId());
        }

        // Determine counterpart and map to ParticipantDto (NO email/phone leak!)
        boolean isSeeker = currentUser.getId().equals(conv.getSeekerUser().getId());
        User counterpartUser = isSeeker ? conv.getRecruiterUser() : conv.getSeekerUser();
        String companyName = null;
        if (counterpartUser.getRole() == Role.ROLE_RECRUITER) {
            companyName = recruiterProfileRepository.findByUser(counterpartUser)
                    .map(rp -> rp.getCompany().getName()).orElse(null);
        }

        dto.setCounterpart(ParticipantDto.fromUser(counterpartUser, companyName));
        dto.setLastMessage(conv.getLastMessage());
        dto.setLastMessageAt(conv.getLastMessageAt());
        dto.setUnreadCount(isSeeker ? conv.getSeekerUnreadCount() : conv.getRecruiterUnreadCount());
        dto.setStatus(conv.getStatus());
        return dto;
    }

    public MessageDto toMessageDto(Message msg) {
        MessageDto dto = new MessageDto();
        dto.setId(msg.getId());
        dto.setConversationId(msg.getConversation().getId());
        dto.setClientMsgId(msg.getClientMsgId());

        String companyName = null;
        if (msg.getSenderUser().getRole() == Role.ROLE_RECRUITER) {
            companyName = recruiterProfileRepository.findByUser(msg.getSenderUser())
                    .map(rp -> rp.getCompany().getName()).orElse(null);
        }
        dto.setSender(ParticipantDto.fromUser(msg.getSenderUser(), companyName));

        dto.setBody(msg.getBody());
        dto.setAttachmentUrl(msg.getAttachmentUrl());
        dto.setStatus(msg.getStatus());
        dto.setContactMasked(msg.isContactMasked());
        dto.setSentAt(msg.getSentAt());
        return dto;
    }
}
