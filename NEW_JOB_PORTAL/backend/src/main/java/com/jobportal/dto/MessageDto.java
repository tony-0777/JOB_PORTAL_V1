package com.jobportal.dto;

import java.time.LocalDateTime;

public class MessageDto {
    private Long id;
    private Long conversationId;
    private String clientMsgId;
    private ParticipantDto sender; // Masked sender
    private String body; // Contains masked text [contact hidden]
    private String attachmentUrl;
    private String status;
    private boolean isContactMasked;
    private LocalDateTime sentAt;

    public MessageDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public String getClientMsgId() { return clientMsgId; }
    public void setClientMsgId(String clientMsgId) { this.clientMsgId = clientMsgId; }

    public ParticipantDto getSender() { return sender; }
    public void setSender(ParticipantDto sender) { this.sender = sender; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isContactMasked() { return isContactMasked; }
    public void setContactMasked(boolean contactMasked) { isContactMasked = contactMasked; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
