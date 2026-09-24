package com.jobportal.service;

import com.jobportal.dto.PlatformStatsDto;
import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final GovtExchangeRepository govtExchangeRepository;
    private final ConversationRepository conversationRepository;

    public AdminService(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            GovtExchangeRepository govtExchangeRepository,
            ConversationRepository conversationRepository) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.govtExchangeRepository = govtExchangeRepository;
        this.conversationRepository = conversationRepository;
    }

    public PlatformStatsDto getPlatformStats() {
        PlatformStatsDto stats = new PlatformStatsDto();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalSeekers(userRepository.countByRole(Role.ROLE_SEEKER));
        stats.setTotalRecruiters(userRepository.countByRole(Role.ROLE_RECRUITER));
        stats.setTotalJobs(jobRepository.count());
        stats.setTotalActiveJobs(jobRepository.countByStatus("ACTIVE"));
        stats.setTotalApplications(applicationRepository.count());
        stats.setTotalHired(applicationRepository.countByStatus("HIRED"));
        stats.setTotalExchangeRegistrations(govtExchangeRepository.count());
        stats.setPendingKycVerifications(companyRepository.countByKycStatus("PENDING"));
        stats.setTotalConversations(conversationRepository.count());
        return stats;
    }

    public List<Company> getPendingKycCompanies() {
        return companyRepository.findByKycStatus("PENDING");
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Transactional
    public Company updateCompanyKyc(Long companyId, String status) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setKycStatus(status);
        return companyRepository.save(company);
    }

    @Transactional
    public Job moderateJob(Long jobId, String status) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(status);
        return jobRepository.save(job);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
