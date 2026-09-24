package com.jobportal.dto;

import java.time.LocalDateTime;

public class ApplicationDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String companyLogo;
    private String jobLocation;
    
    // Privacy: candidate exposed via ParticipantDto with zero phone/email leak!
    private ParticipantDto seeker;

    private String status; // NEW, SCREENED, SHORTLISTED, INTERVIEW_SCHEDULED, OFFER_SENT, HIRED, REJECTED
    private String resumeUrl;
    private String coverNote;
    private String screeningAnswersJson;
    private String recruiterNotes;
    private Integer rating;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public ApplicationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyLogo() { return companyLogo; }
    public void setCompanyLogo(String companyLogo) { this.companyLogo = companyLogo; }

    public String getJobLocation() { return jobLocation; }
    public void setJobLocation(String jobLocation) { this.jobLocation = jobLocation; }

    public ParticipantDto getSeeker() { return seeker; }
    public void setSeeker(ParticipantDto seeker) { this.seeker = seeker; }

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
