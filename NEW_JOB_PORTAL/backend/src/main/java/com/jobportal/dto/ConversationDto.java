package com.jobportal.dto;

import java.time.LocalDateTime;

public class ConversationDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long applicationId;
    private ParticipantDto counterpart; // Masked counterpart info
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private Integer unreadCount;
    private String status;

    public ConversationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public ParticipantDto getCounterpart() { return counterpart; }
    public void setCounterpart(ParticipantDto counterpart) { this.counterpart = counterpart; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public Integer getUnreadCount() { return unreadCount; }
    public void setUnreadCount(Integer unreadCount) { this.unreadCount = unreadCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
