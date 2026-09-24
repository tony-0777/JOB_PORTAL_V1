package com.jobportal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "govt_exchange_profiles")
public class GovtExchangeProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User seekerUser;

    @Column(nullable = false, unique = true)
    private String registrationNumber; // e.g. "GJ-EXCH-2026-89412"

    private String district; // e.g. "Ahmedabad", "Surat", "Vadodara"
    private String qualificationLevel; // "Graduate", "Post Graduate", "Diploma", "10th/12th"
    private String employmentStatus; // "Unemployed", "Employed", "Student"

    @Column(columnDefinition = "TEXT")
    private String enrolledSchemesJson; // e.g. ["Mukhyamantri Yuva Swavalamban", "Skill India Digital", "Apprenticeship Yojana"]

    private boolean isPhysicallyChallenged = false;
    private String categoryGroup; // "General", "SEBC/OBC", "SC", "ST", "EWS"

    private LocalDateTime registeredAt = LocalDateTime.now();

    public GovtExchangeProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getSeekerUser() { return seekerUser; }
    public void setSeekerUser(User seekerUser) { this.seekerUser = seekerUser; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getQualificationLevel() { return qualificationLevel; }
    public void setQualificationLevel(String qualificationLevel) { this.qualificationLevel = qualificationLevel; }

    public String getEmploymentStatus() { return employmentStatus; }
    public void setEmploymentStatus(String employmentStatus) { this.employmentStatus = employmentStatus; }

    public String getEnrolledSchemesJson() { return enrolledSchemesJson; }
    public void setEnrolledSchemesJson(String enrolledSchemesJson) { this.enrolledSchemesJson = enrolledSchemesJson; }

    public boolean isPhysicallyChallenged() { return isPhysicallyChallenged; }
    public void setPhysicallyChallenged(boolean physicallyChallenged) { isPhysicallyChallenged = physicallyChallenged; }

    public String getCategoryGroup() { return categoryGroup; }
    public void setCategoryGroup(String categoryGroup) { this.categoryGroup = categoryGroup; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
}
