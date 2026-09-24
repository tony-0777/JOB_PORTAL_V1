package com.jobportal.service;

import com.jobportal.dto.ApplicationDto;
import com.jobportal.dto.AtsUpdateDto;
import com.jobportal.dto.ParticipantDto;
import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SeekerProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final SeekerProfileRepository seekerProfileRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            SeekerProfileRepository seekerProfileRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.seekerProfileRepository = seekerProfileRepository;
    }

    @Transactional
    public ApplicationDto applyToJob(Long jobId, ApplicationDto request, User seekerUser) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByJobAndSeekerUser(job, seekerUser)) {
            throw new RuntimeException("You have already applied to this job");
        }

        Application application = new Application();
        application.setJob(job);
        application.setSeekerUser(seekerUser);
        application.setStatus("NEW");
        application.setResumeUrl(request.getResumeUrl() != null ? request.getResumeUrl() : "https://example.com/resumes/default_resume.pdf");
        application.setCoverNote(request.getCoverNote());
        application.setScreeningAnswersJson(request.getScreeningAnswersJson());

        Application saved = applicationRepository.save(application);

        // Increment application count
        job.setApplicationCount(job.getApplicationCount() + 1);
        jobRepository.save(job);

        return toDto(saved);
    }

    public List<ApplicationDto> getSeekerApplications(User seekerUser) {
        return applicationRepository.findBySeekerUser(seekerUser)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getJobApplications(Long jobId, User recruiterUser) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Only the recruiter who posted the job can view the applications
        if (!job.getRecruiterUser().getId().equals(recruiterUser.getId())) {
            throw new RuntimeException("Unauthorized to view applications for this job");
        }

        return applicationRepository.findByJob(job)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDto updateAtsStatus(Long applicationId, AtsUpdateDto updateDto, User recruiterUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getJob().getRecruiterUser().getId().equals(recruiterUser.getId())) {
            throw new RuntimeException("Unauthorized: not your job posting");
        }

        if (updateDto.getStatus() != null) {
            application.setStatus(updateDto.getStatus());
        }
        if (updateDto.getRating() != null) {
            application.setRating(updateDto.getRating());
        }
        if (updateDto.getRecruiterNotes() != null) {
            application.setRecruiterNotes(updateDto.getRecruiterNotes());
        }
        application.setUpdatedAt(LocalDateTime.now());

        return toDto(applicationRepository.save(application));
    }

    public ApplicationDto toDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setJobId(app.getJob().getId());
        dto.setJobTitle(app.getJob().getTitle());
        dto.setCompanyName(app.getJob().getCompany().getName());
        dto.setCompanyLogo(app.getJob().getCompany().getLogoUrl());
        dto.setJobLocation(app.getJob().getLocation());

        // PRIVACY ENFORCEMENT (FR-PV-01):
        // Candidate profile is mapped to ParticipantDto with NO email or phone!
        ParticipantDto seekerParticipant = ParticipantDto.fromUser(app.getSeekerUser(), null);
        dto.setSeeker(seekerParticipant);

        dto.setStatus(app.getStatus());
        dto.setResumeUrl(app.getResumeUrl());
        dto.setCoverNote(app.getCoverNote());
        dto.setScreeningAnswersJson(app.getScreeningAnswersJson());
        dto.setRecruiterNotes(app.getRecruiterNotes());
        dto.setRating(app.getRating());
        dto.setAppliedAt(app.getAppliedAt());
        dto.setUpdatedAt(app.getUpdatedAt());
        return dto;
    }
}
