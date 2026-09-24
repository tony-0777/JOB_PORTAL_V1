package com.jobportal.dto;

import java.time.LocalDateTime;

public class CallDto {
    private Long id;
    private Long conversationId;
    private ParticipantDto caller; // Masked caller info
    private ParticipantDto callee; // Masked callee info
    private String channelName;
    private String outcome;
    private Integer durationSec;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    public CallDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public ParticipantDto getCaller() { return caller; }
    public void setCaller(ParticipantDto caller) { this.caller = caller; }

    public ParticipantDto getCallee() { return callee; }
    public void setCallee(ParticipantDto callee) { this.callee = callee; }

    public String getChannelName() { return channelName; }
    public void setChannelName(String channelName) { this.channelName = channelName; }

    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }

    public Integer getDurationSec() { return durationSec; }
    public void setDurationSec(Integer durationSec) { this.durationSec = durationSec; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getEndedAt() { return endedAt; }
    public void setEndedAt(LocalDateTime endedAt) { this.endedAt = endedAt; }
}
