package com.jobportal.controller;

import com.jobportal.dto.JobDto;
import com.jobportal.model.SeekerProfile;
import com.jobportal.model.User;
import com.jobportal.repository.SeekerProfileRepository;
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
@RequestMapping("/api/seeker")
@PreAuthorize("hasAnyRole('SEEKER', 'ADMIN')")
public class SeekerController {

    private final SeekerProfileRepository seekerProfileRepository;
    private final UserRepository userRepository;
    private final JobService jobService;

    public SeekerController(
            SeekerProfileRepository seekerProfileRepository,
            UserRepository userRepository,
            JobService jobService) {
        this.seekerProfileRepository = seekerProfileRepository;
        this.userRepository = userRepository;
        this.jobService = jobService;
    }

    @GetMapping("/profile")
    public ResponseEntity<SeekerProfile> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        SeekerProfile profile = seekerProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    SeekerProfile newProfile = new SeekerProfile();
                    newProfile.setUser(user);
                    return seekerProfileRepository.save(newProfile);
                });
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<SeekerProfile> updateProfile(
            @RequestBody SeekerProfile updated,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SeekerProfile profile = seekerProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    SeekerProfile p = new SeekerProfile();
                    p.setUser(user);
                    return p;
                });

        if (updated.getHeadline() != null) profile.setHeadline(updated.getHeadline());
        if (updated.getBio() != null) profile.setBio(updated.getBio());
        if (updated.getExperienceYears() != null) profile.setExperienceYears(updated.getExperienceYears());
        if (updated.getSkills() != null) profile.setSkills(updated.getSkills());
        if (updated.getEducationJson() != null) profile.setEducationJson(updated.getEducationJson());
        if (updated.getExperienceJson() != null) profile.setExperienceJson(updated.getExperienceJson());
        if (updated.getResumeUrl() != null) profile.setResumeUrl(updated.getResumeUrl());
        if (updated.getPrivacyVisibility() != null) profile.setPrivacyVisibility(updated.getPrivacyVisibility());

        // Calculate completeness score
        int score = 40;
        if (profile.getSkills() != null && !profile.getSkills().isBlank()) score += 20;
        if (profile.getEducationJson() != null && !profile.getEducationJson().isBlank()) score += 15;
        if (profile.getExperienceJson() != null && !profile.getExperienceJson().isBlank()) score += 15;
        if (profile.getResumeUrl() != null && !profile.getResumeUrl().isBlank()) score += 10;
        profile.setCompletenessScore(Math.min(score, 100));

        return ResponseEntity.ok(seekerProfileRepository.save(profile));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<JobDto>> getRecommendedJobs(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Returns featured jobs as top recommendations
        return ResponseEntity.ok(jobService.getFeaturedJobs(user));
    }
}
