package com.jobportal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seeker_id", nullable = false)
    private User seekerUser;

    // ATS stages: NEW, SCREENED, SHORTLISTED, INTERVIEW_SCHEDULED, OFFER_SENT, HIRED, REJECTED
    @Column(nullable = false)
    private String status = "NEW";

    private String resumeUrl;

    @Column(columnDefinition = "TEXT")
    private String coverNote;

    @Column(columnDefinition = "TEXT")
    private String screeningAnswersJson; // JSON mapping questions to answers

    @Column(columnDefinition = "TEXT")
    private String recruiterNotes;

    private Integer rating = 0; // 0 to 5

    private LocalDateTime appliedAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Application() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public User getSeekerUser() { return seekerUser; }
    public void setSeekerUser(User seekerUser) { this.seekerUser = seekerUser; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getCoverNote() { return coverNote; }
    public void setCoverNote(String coverNote) { this.coverNote = coverNote; }

    public String getScreeningAnswersJson() { return screeningAnswersJson; }
    public void setScreeningAnswersJson(String screeningAnswersJson) { this.screeningAnswersJson = screeningAnswersJson; }

    public String getRecruiterNotes() { return recruiterNotes; }
    public void setRecruiterNotes(String recruiterNotes) { this.recruiterNotes = recruiterNotes; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
