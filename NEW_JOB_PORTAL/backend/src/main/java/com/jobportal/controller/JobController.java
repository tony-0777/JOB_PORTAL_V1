package com.jobportal.controller;

import com.jobportal.dto.JobDto;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.UserPrincipal;
import com.jobportal.service.JobService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final UserRepository userRepository;

    public JobController(JobService jobService, UserRepository userRepository) {
        this.jobService = jobService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<Page<JobDto>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String workMode,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) Long minSalary,
            @RequestParam(required = false) Integer maxExp,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal principal) {

        User currentUser = principal != null ? userRepository.findById(principal.getId()).orElse(null) : null;
        return ResponseEntity.ok(jobService.searchJobs(keyword, location, workMode, jobType, minSalary, maxExp, category, currentUser, page, size));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<JobDto>> getFeaturedJobs(@AuthenticationPrincipal UserPrincipal principal) {
        User currentUser = principal != null ? userRepository.findById(principal.getId()).orElse(null) : null;
        return ResponseEntity.ok(jobService.getFeaturedJobs(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User currentUser = principal != null ? userRepository.findById(principal.getId()).orElse(null) : null;
        return ResponseEntity.ok(jobService.getJobById(id, currentUser));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<JobDto> createJob(
            @RequestBody JobDto jobDto,
            @AuthenticationPrincipal UserPrincipal principal) {
        User recruiter = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(jobService.createJob(jobDto, recruiter));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<JobDto> updateJob(
            @PathVariable Long id,
            @RequestBody JobDto jobDto,
            @AuthenticationPrincipal UserPrincipal principal) {
        User recruiter = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(jobService.updateJob(id, jobDto, recruiter));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User recruiter = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        jobService.deleteJob(id, recruiter);
        return ResponseEntity.noContent().build();
    }
}
