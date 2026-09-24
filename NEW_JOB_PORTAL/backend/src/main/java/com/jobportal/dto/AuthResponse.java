package com.jobportal.dto;

import com.jobportal.model.Role;

public class AuthResponse {
    private String token;
    private Long userId;
    private String email;
    private String displayName;
    private Role role;
    private String avatarUrl;
    private String headline;
    private Long companyId;
    private String companyName;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String email, String displayName, Role role, String avatarUrl, String headline) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.displayName = displayName;
        this.role = role;
        this.avatarUrl = avatarUrl;
        this.headline = headline;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
}
