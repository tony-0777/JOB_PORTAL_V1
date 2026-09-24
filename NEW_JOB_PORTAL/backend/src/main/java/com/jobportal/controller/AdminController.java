package com.jobportal.controller;

import com.jobportal.dto.PlatformStatsDto;
import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<PlatformStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }

    @GetMapping("/kyc/pending")
    public ResponseEntity<List<Company>> getPendingKyc() {
        return ResponseEntity.ok(adminService.getPendingKycCompanies());
    }

    @GetMapping("/companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(adminService.getAllCompanies());
    }

    @PostMapping("/kyc/{companyId}/verify")
    public ResponseEntity<Company> verifyCompany(
            @PathVariable Long companyId,
            @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "VERIFIED");
        return ResponseEntity.ok(adminService.updateCompanyKyc(companyId, status));
    }

    @PostMapping("/jobs/{jobId}/moderate")
    public ResponseEntity<Job> moderateJob(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "ACTIVE");
        return ResponseEntity.ok(adminService.moderateJob(jobId, status));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
}
