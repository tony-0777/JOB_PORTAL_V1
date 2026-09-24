package com.jobportal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id")
    private Job job;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id")
    private Application application;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seeker_id", nullable = false)
    private User seekerUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiterUser;

    // ACTIVE, BLOCKED, REPORTED
    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(columnDefinition = "TEXT")
    private String lastMessage;

    private LocalDateTime lastMessageAt = LocalDateTime.now();

    private Integer seekerUnreadCount = 0;
    private Integer recruiterUnreadCount = 0;

    public Conversation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public User getSeekerUser() { return seekerUser; }
    public void setSeekerUser(User seekerUser) { this.seekerUser = seekerUser; }

    public User getRecruiterUser() { return recruiterUser; }
    public void setRecruiterUser(User recruiterUser) { this.recruiterUser = recruiterUser; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public Integer getSeekerUnreadCount() { return seekerUnreadCount; }
    public void setSeekerUnreadCount(Integer seekerUnreadCount) { this.seekerUnreadCount = seekerUnreadCount; }

    public Integer getRecruiterUnreadCount() { return recruiterUnreadCount; }
    public void setRecruiterUnreadCount(Integer recruiterUnreadCount) { this.recruiterUnreadCount = recruiterUnreadCount; }
}
