package com.jobportal.controller;

import com.jobportal.dto.JobDto;
import com.jobportal.dto.ParticipantDto;
import com.jobportal.model.Company;
import com.jobportal.model.RecruiterProfile;
import com.jobportal.model.SeekerProfile;
import com.jobportal.model.User;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.RecruiterProfileRepository;
import com.jobportal.repository.SeekerProfileRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.UserPrincipal;
import com.jobportal.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recruiter")
@PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
public class RecruiterController {

    private final JobService jobService;
    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyRepository companyRepository;
    private final SeekerProfileRepository seekerProfileRepository;

    public RecruiterController(
            JobService jobService,
            UserRepository userRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            CompanyRepository companyRepository,
            SeekerProfileRepository seekerProfileRepository) {
        this.jobService = jobService;
        this.userRepository = userRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.companyRepository = companyRepository;
        this.seekerProfileRepository = seekerProfileRepository;
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDto>> getMyJobs(@AuthenticationPrincipal UserPrincipal principal) {
        User recruiter = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(jobService.getRecruiterJobs(recruiter));
    }

    /**
     * Requirement FR-RC-06 & FR-PV-01:
     * Talent search for resume database. Returns candidates strictly as ParticipantDto with skills,
     * hiding phone numbers and email addresses.
     */
    @GetMapping("/candidates")
    public ResponseEntity<List<Map<String, Object>>> searchCandidates(
            @RequestParam(required = false) String skills,
            @RequestParam(required = false) Integer minExp) {

        List<SeekerProfile> profiles = seekerProfileRepository.searchCandidates(skills, minExp);

        List<Map<String, Object>> result = profiles.stream().map(sp -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", sp.getId());
            map.put("participant", ParticipantDto.fromUser(sp.getUser(), null));
            map.put("skills", sp.getSkills());
            map.put("experienceYears", sp.getExperienceYears());
            map.put("completenessScore", sp.getCompletenessScore());
            map.put("headline", sp.getHeadline());
            map.put("bio", sp.getBio());
            map.put("exchangeRegistrationNo", sp.getExchangeRegistrationNo());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/company")
    public ResponseEntity<Company> getCompany(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        RecruiterProfile rp = recruiterProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));
        return ResponseEntity.ok(rp.getCompany());
    }

    @PutMapping("/company")
    public ResponseEntity<Company> updateCompany(
            @RequestBody Company updated,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        RecruiterProfile rp = recruiterProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));

        Company company = rp.getCompany();
        if (updated.getName() != null) company.setName(updated.getName());
        if (updated.getLogoUrl() != null) company.setLogoUrl(updated.getLogoUrl());
        if (updated.getBannerUrl() != null) company.setBannerUrl(updated.getBannerUrl());
        if (updated.getDescription() != null) company.setDescription(updated.getDescription());
        if (updated.getWebsite() != null) company.setWebsite(updated.getWebsite());
        if (updated.getIndustry() != null) company.setIndustry(updated.getIndustry());
        if (updated.getSize() != null) company.setSize(updated.getSize());
        if (updated.getLocation() != null) company.setLocation(updated.getLocation());

        return ResponseEntity.ok(companyRepository.save(company));
    }
}
