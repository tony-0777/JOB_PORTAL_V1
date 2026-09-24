package com.jobportal.service;

import com.jobportal.dto.JobDto;
import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.model.RecruiterProfile;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.RecruiterProfileRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final ApplicationRepository applicationRepository;

    public JobService(
            JobRepository jobRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.applicationRepository = applicationRepository;
    }

    public Page<JobDto> searchJobs(
            String keyword,
            String location,
            String workMode,
            String jobType,
            Long minSalary,
            Integer maxExp,
            String category,
            User currentUser,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobs = jobRepository.searchJobs(
                keyword != null && !keyword.isBlank() ? keyword : null,
                location != null && !location.isBlank() ? location : null,
                workMode != null && !workMode.isBlank() ? workMode : null,
                jobType != null && !jobType.isBlank() ? jobType : null,
                minSalary,
                maxExp,
                category != null && !category.isBlank() ? category : null,
                "ACTIVE",
                pageable
        );

        return jobs.map(job -> toDto(job, currentUser));
    }

    public List<JobDto> getFeaturedJobs(User currentUser) {
        return jobRepository.findByIsFeaturedTrueAndStatus("ACTIVE")
                .stream()
                .map(job -> toDto(job, currentUser))
                .collect(Collectors.toList());
    }

    @Transactional
    public JobDto getJobById(Long id, User currentUser) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        job.setViewCount(job.getViewCount() + 1);
        jobRepository.save(job);
        return toDto(job, currentUser);
    }

    @Transactional
    public JobDto createJob(JobDto dto, User recruiterUser) {
        RecruiterProfile rp = recruiterProfileRepository.findByUser(recruiterUser)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));

        Job job = new Job();
        job.setCompany(rp.getCompany());
        job.setRecruiterUser(recruiterUser);
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setRequirements(dto.getRequirements());
        job.setSkills(dto.getSkills());
        job.setExperienceMin(dto.getExperienceMin() != null ? dto.getExperienceMin() : 0);
        job.setExperienceMax(dto.getExperienceMax() != null ? dto.getExperienceMax() : 5);
        job.setSalaryMin(dto.getSalaryMin());
        job.setSalaryMax(dto.getSalaryMax());
        job.setSalaryCurrency(dto.getSalaryCurrency() != null ? dto.getSalaryCurrency() : "INR");
        job.setLocation(dto.getLocation());
        job.setWorkMode(dto.getWorkMode() != null ? dto.getWorkMode() : "REMOTE");
        job.setJobType(dto.getJobType() != null ? dto.getJobType() : "FULL_TIME");
        job.setCategory(dto.getCategory() != null ? dto.getCategory() : "Engineering");
        job.setFeatured(dto.isFeatured());
        job.setUrgent(dto.isUrgent());
        job.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        job.setScreeningQuestionsJson(dto.getScreeningQuestionsJson());

        Job saved = jobRepository.save(job);
        return toDto(saved, recruiterUser);
    }

    @Transactional
    public JobDto updateJob(Long id, JobDto dto, User recruiterUser) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getRecruiterUser().getId().equals(recruiterUser.getId())) {
            throw new RuntimeException("Unauthorized: you did not post this job");
        }

        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setRequirements(dto.getRequirements());
        job.setSkills(dto.getSkills());
        job.setExperienceMin(dto.getExperienceMin());
        job.setExperienceMax(dto.getExperienceMax());
        job.setSalaryMin(dto.getSalaryMin());
        job.setSalaryMax(dto.getSalaryMax());
        job.setLocation(dto.getLocation());
        job.setWorkMode(dto.getWorkMode());
        job.setJobType(dto.getJobType());
        job.setCategory(dto.getCategory());
        job.setFeatured(dto.isFeatured());
        job.setUrgent(dto.isUrgent());
        if (dto.getStatus() != null) job.setStatus(dto.getStatus());
        job.setScreeningQuestionsJson(dto.getScreeningQuestionsJson());

        return toDto(jobRepository.save(job), recruiterUser);
    }

    public List<JobDto> getRecruiterJobs(User recruiterUser) {
        return jobRepository.findByRecruiterUser(recruiterUser)
                .stream()
                .map(job -> toDto(job, recruiterUser))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteJob(Long id, User recruiterUser) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getRecruiterUser().getId().equals(recruiterUser.getId())) {
            throw new RuntimeException("Unauthorized to delete this job");
        }
        job.setStatus("CLOSED");
        jobRepository.save(job);
    }

    public JobDto toDto(Job job, User currentUser) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setCompanyId(job.getCompany().getId());
        dto.setCompanyName(job.getCompany().getName());
        dto.setCompanyLogo(job.getCompany().getLogoUrl());
        dto.setCompanyLocation(job.getCompany().getLocation());
        dto.setCompanyRating(job.getCompany().getRating());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setRequirements(job.getRequirements());
        dto.setSkills(job.getSkills());
        dto.setExperienceMin(job.getExperienceMin());
        dto.setExperienceMax(job.getExperienceMax());
        dto.setSalaryMin(job.getSalaryMin());
        dto.setSalaryMax(job.getSalaryMax());
        dto.setSalaryCurrency(job.getSalaryCurrency());
        dto.setLocation(job.getLocation());
        dto.setWorkMode(job.getWorkMode());
        dto.setJobType(job.getJobType());
        dto.setCategory(job.getCategory());
        dto.setFeatured(job.isFeatured());
        dto.setUrgent(job.isUrgent());
        dto.setStatus(job.getStatus());
        dto.setScreeningQuestionsJson(job.getScreeningQuestionsJson());
        dto.setViewCount(job.getViewCount());
        dto.setApplicationCount(job.getApplicationCount());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setExpiresAt(job.getExpiresAt());

        if (currentUser != null) {
            dto.setHasApplied(applicationRepository.existsByJobAndSeekerUser(job, currentUser));
        }

        return dto;
    }
}
