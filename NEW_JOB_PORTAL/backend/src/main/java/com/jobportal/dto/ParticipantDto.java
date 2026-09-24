package com.jobportal.dto;

import com.jobportal.model.Role;
import com.jobportal.model.User;

/**
 * Requirement FR-PV-01 & Section 3.1:
 * Dedicated response DTO that excludes email and phone numbers completely.
 * Counterparts only see displayName, avatarUrl, headline, company, and role.
 */
public class ParticipantDto {

    private Long userId;
    private String displayName;
    private String avatarUrl;
    private String headline;
    private String companyName;
    private Role role;
    private boolean isOnline;

    public ParticipantDto() {}

    public ParticipantDto(Long userId, String displayName, String avatarUrl, String headline, String companyName, Role role) {
        this.userId = userId;
        this.displayName = displayName;
        this.avatarUrl = avatarUrl;
        this.headline = headline;
        this.companyName = companyName;
        this.role = role;
    }

    public static ParticipantDto fromUser(User user, String companyName) {
        if (user == null) return null;
        return new ParticipantDto(
                user.getId(),
                user.getDisplayName(),
                user.getAvatarUrl(),
                user.getHeadline(),
                companyName,
                user.getRole()
        );
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isOnline() { return isOnline; }
    public void setOnline(boolean online) { isOnline = online; }
}
