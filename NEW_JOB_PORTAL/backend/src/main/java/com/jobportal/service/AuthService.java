package com.jobportal.service;

import com.jobportal.dto.AuthRequest;
import com.jobportal.dto.AuthResponse;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.model.*;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.RecruiterProfileRepository;
import com.jobportal.repository.SeekerProfileRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            UserRepository userRepository,
            SeekerProfileRepository seekerProfileRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            CompanyRepository companyRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.seekerProfileRepository = seekerProfileRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String jwt = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        AuthResponse response = new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getRole(),
                user.getAvatarUrl(),
                user.getHeadline()
        );

        if (user.getRole() == Role.ROLE_RECRUITER) {
            recruiterProfileRepository.findByUser(user).ifPresent(rp -> {
                response.setCompanyId(rp.getCompany().getId());
                response.setCompanyName(rp.getCompany().getName());
            });
        }

        return response;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use: " + request.getEmail());
        }

        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_SEEKER;

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setDisplayName(request.getDisplayName());
        user.setPhone(request.getPhone());
        user.setHeadline(request.getHeadline());
        user = userRepository.save(user);

        Long companyId = null;
        String companyName = null;

        if (role == Role.ROLE_SEEKER) {
            SeekerProfile profile = new SeekerProfile();
            profile.setUser(user);
            profile.setHeadline(request.getHeadline() != null ? request.getHeadline() : "Job Seeker");
            profile.setSkills("Java, Spring Boot, Angular, TypeScript, SQL");
            profile.setCompletenessScore(60);
            seekerProfileRepository.save(profile);
        } else if (role == Role.ROLE_RECRUITER) {
            Company company;
            if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
                company = companyRepository.findByNameIgnoreCase(request.getCompanyName())
                        .orElseGet(() -> {
                            Company newComp = new Company();
                            newComp.setName(request.getCompanyName());
                            newComp.setIndustry(request.getCompanyIndustry() != null ? request.getCompanyIndustry() : "Technology");
                            newComp.setLocation(request.getCompanyLocation() != null ? request.getCompanyLocation() : "Bengaluru, India");
                            newComp.setKycStatus("VERIFIED");
                            return companyRepository.save(newComp);
                        });
            } else {
                company = companyRepository.findAll().stream().findFirst()
                        .orElseGet(() -> {
                            Company fallback = new Company();
                            fallback.setName("Global Tech Inc");
                            fallback.setKycStatus("VERIFIED");
                            return companyRepository.save(fallback);
                        });
            }

            RecruiterProfile recruiterProfile = new RecruiterProfile();
            recruiterProfile.setUser(user);
            recruiterProfile.setCompany(company);
            recruiterProfile.setCompanyAdmin(true);
            recruiterProfile.setVerified(true);
            recruiterProfileRepository.save(recruiterProfile);

            companyId = company.getId();
            companyName = company.getName();
        }

        String jwt = tokenProvider.generateTokenForUser(user.getId(), user.getEmail(), user.getRole().name(), user.getDisplayName());
        AuthResponse response = new AuthResponse(jwt, user.getId(), user.getEmail(), user.getDisplayName(), user.getRole(), user.getAvatarUrl(), user.getHeadline());
        response.setCompanyId(companyId);
        response.setCompanyName(companyName);
        return response;
    }
}
