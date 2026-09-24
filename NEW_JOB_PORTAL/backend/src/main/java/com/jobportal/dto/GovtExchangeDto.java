package com.jobportal.dto;

import java.time.LocalDateTime;

public class GovtExchangeDto {
    private Long id;
    private String registrationNumber;
    private String district;
    private String qualificationLevel;
    private String employmentStatus;
    private String enrolledSchemesJson;
    private boolean isPhysicallyChallenged;
    private String categoryGroup;
    private LocalDateTime registeredAt;

    public GovtExchangeDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
