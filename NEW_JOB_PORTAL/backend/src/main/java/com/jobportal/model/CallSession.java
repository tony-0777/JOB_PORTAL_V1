package com.jobportal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "call_sessions")
public class CallSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "caller_id", nullable = false)
    private User callerUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "callee_id", nullable = false)
    private User calleeUser;

    private String channelName; // e.g. room-uuid

    // Outcome: RINGING, ACTIVE, COMPLETED, DECLINED, MISSED, BUSY
    @Column(nullable = false)
    private String outcome = "RINGING";

    private Integer durationSec = 0;

    private LocalDateTime startedAt = LocalDateTime.now();
    private LocalDateTime endedAt;

    public CallSession() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Conversation getConversation() { return conversation; }
    public void setConversation(Conversation conversation) { this.conversation = conversation; }

    public User getCallerUser() { return callerUser; }
    public void setCallerUser(User callerUser) { this.callerUser = callerUser; }

    public User getCalleeUser() { return calleeUser; }
    public void setCalleeUser(User calleeUser) { this.calleeUser = calleeUser; }

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
