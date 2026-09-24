package com.jobportal.controller;

import com.jobportal.dto.ApplicationDto;
import com.jobportal.dto.AtsUpdateDto;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.UserPrincipal;
import com.jobportal.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    public ApplicationController(ApplicationService applicationService, UserRepository userRepository) {
        this.applicationService = applicationService;
        this.userRepository = userRepository;
    }

    @PostMapping("/jobs/{jobId}/apply")
    @PreAuthorize("hasRole('SEEKER')")
    public ResponseEntity<ApplicationDto> applyToJob(
            @PathVariable Long jobId,
            @RequestBody ApplicationDto request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User seeker = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(applicationService.applyToJob(jobId, request, seeker));
    }

    @GetMapping("/seeker/applications")
    @PreAuthorize("hasRole('SEEKER')")
    public ResponseEntity<List<ApplicationDto>> getSeekerApplications(
            @AuthenticationPrincipal UserPrincipal principal) {
        User seeker = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(applicationService.getSeekerApplications(seeker));
    }

    @GetMapping("/recruiter/jobs/{jobId}/applications")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<List<ApplicationDto>> getJobApplications(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserPrincipal principal) {
        User recruiter = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(applicationService.getJobApplications(jobId, recruiter));
    }

    @PatchMapping("/recruiter/applications/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApplicationDto> updateAtsStatus(
            @PathVariable Long id,
            @RequestBody AtsUpdateDto updateDto,
            @AuthenticationPrincipal UserPrincipal principal) {
        User recruiter = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(applicationService.updateAtsStatus(id, updateDto, recruiter));
    }
}
