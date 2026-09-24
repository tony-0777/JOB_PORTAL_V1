package com.jobportal.dto;

public class PlatformStatsDto {
    private long totalUsers;
    private long totalSeekers;
    private long totalRecruiters;
    private long totalJobs;
    private long totalActiveJobs;
    private long totalApplications;
    private long totalHired;
    private long totalExchangeRegistrations;
    private long pendingKycVerifications;
    private long totalConversations;

    public PlatformStatsDto() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalSeekers() { return totalSeekers; }
    public void setTotalSeekers(long totalSeekers) { this.totalSeekers = totalSeekers; }

    public long getTotalRecruiters() { return totalRecruiters; }
    public void setTotalRecruiters(long totalRecruiters) { this.totalRecruiters = totalRecruiters; }

    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

    public long getTotalActiveJobs() { return totalActiveJobs; }
    public void setTotalActiveJobs(long totalActiveJobs) { this.totalActiveJobs = totalActiveJobs; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getTotalHired() { return totalHired; }
    public void setTotalHired(long totalHired) { this.totalHired = totalHired; }

    public long getTotalExchangeRegistrations() { return totalExchangeRegistrations; }
    public void setTotalExchangeRegistrations(long totalExchangeRegistrations) { this.totalExchangeRegistrations = totalExchangeRegistrations; }

    public long getPendingKycVerifications() { return pendingKycVerifications; }
    public void setPendingKycVerifications(long pendingKycVerifications) { this.pendingKycVerifications = pendingKycVerifications; }

    public long getTotalConversations() { return totalConversations; }
    public void setTotalConversations(long totalConversations) { this.totalConversations = totalConversations; }
}
