package com.jobportal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "seeker_profiles")
public class SeekerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String headline;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private Integer experienceYears = 0;

    @Column(columnDefinition = "TEXT")
    private String skills; // Comma-separated: "Java, Spring Boot, Angular, TypeScript"

    @Column(columnDefinition = "TEXT")
    private String educationJson;

    @Column(columnDefinition = "TEXT")
    private String experienceJson;

    private String resumeUrl;
    private Integer completenessScore = 85;

    // Visibility: PUBLIC, PRIVATE, HIDDEN_FROM_CURRENT
    private String privacyVisibility = "PUBLIC";

    // Government Employment Exchange number (Anubandhan style)
    private String exchangeRegistrationNo;

    public SeekerProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getEducationJson() { return educationJson; }
    public void setEducationJson(String educationJson) { this.educationJson = educationJson; }

    public String getExperienceJson() { return experienceJson; }
    public void setExperienceJson(String experienceJson) { this.experienceJson = experienceJson; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public Integer getCompletenessScore() { return completenessScore; }
    public void setCompletenessScore(Integer completenessScore) { this.completenessScore = completenessScore; }

    public String getPrivacyVisibility() { return privacyVisibility; }
    public void setPrivacyVisibility(String privacyVisibility) { this.privacyVisibility = privacyVisibility; }

    public String getExchangeRegistrationNo() { return exchangeRegistrationNo; }
    public void setExchangeRegistrationNo(String exchangeRegistrationNo) { this.exchangeRegistrationNo = exchangeRegistrationNo; }
}
