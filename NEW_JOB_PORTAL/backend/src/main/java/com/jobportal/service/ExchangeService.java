package com.jobportal.service;

import com.jobportal.dto.GovtExchangeDto;
import com.jobportal.model.GovtExchangeProfile;
import com.jobportal.model.SeekerProfile;
import com.jobportal.model.User;
import com.jobportal.repository.GovtExchangeRepository;
import com.jobportal.repository.SeekerProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ExchangeService {

    private final GovtExchangeRepository govtExchangeRepository;
    private final SeekerProfileRepository seekerProfileRepository;

    public ExchangeService(
            GovtExchangeRepository govtExchangeRepository,
            SeekerProfileRepository seekerProfileRepository) {
        this.govtExchangeRepository = govtExchangeRepository;
        this.seekerProfileRepository = seekerProfileRepository;
    }

    @Transactional
    public GovtExchangeDto registerSeeker(GovtExchangeDto request, User seekerUser) {
        Optional<GovtExchangeProfile> existing = govtExchangeRepository.findBySeekerUser(seekerUser);
        if (existing.isPresent()) {
            return toDto(existing.get());
        }

        // Generate unique registration number
        String regNo = "GJ-EXCH-" + LocalDateTime.now().getYear() + "-" + (10000 + new Random().nextInt(90000));

        GovtExchangeProfile profile = new GovtExchangeProfile();
        profile.setSeekerUser(seekerUser);
        profile.setRegistrationNumber(regNo);
        profile.setDistrict(request.getDistrict() != null ? request.getDistrict() : "Ahmedabad");
        profile.setQualificationLevel(request.getQualificationLevel() != null ? request.getQualificationLevel() : "Graduate");
        profile.setEmploymentStatus(request.getEmploymentStatus() != null ? request.getEmploymentStatus() : "Unemployed");
        profile.setPhysicallyChallenged(request.isPhysicallyChallenged());
        profile.setCategoryGroup(request.getCategoryGroup() != null ? request.getCategoryGroup() : "General");
        
        // Link eligible schemes
        List<String> schemes = List.of(
                "Mukhyamantri Yuva Swavalamban Yojana (MYSY)",
                "Skill India Digital - IT & Web Development Apprenticeship",
                "National Apprenticeship Promotion Scheme (NAPS)",
                "Gujarat State Rozgar Setu Yojana"
        );
        profile.setEnrolledSchemesJson("[\"" + String.join("\",\"", schemes) + "\"]");

        GovtExchangeProfile saved = govtExchangeRepository.save(profile);

        // Update seeker profile with exchange number
        seekerProfileRepository.findByUser(seekerUser).ifPresent(sp -> {
            sp.setExchangeRegistrationNo(regNo);
            seekerProfileRepository.save(sp);
        });

        return toDto(saved);
    }

    public Optional<GovtExchangeDto> getProfile(User seekerUser) {
        return govtExchangeRepository.findBySeekerUser(seekerUser).map(this::toDto);
    }

    public List<Map<String, Object>> getAvailableSchemes() {
        return List.of(
                Map.of(
                        "name", "Mukhyamantri Yuva Swavalamban Yojana (MYSY)",
                        "ministry", "Education & Employment Dept, Govt of Gujarat",
                        "subsidy", "Financial grant & exam fee waiver",
                        "eligibility", "Graduates and Diploma holders with >80 percentile"
                ),
                Map.of(
                        "name", "Skill India Digital - IT Apprenticeship",
                        "ministry", "Ministry of Skill Development & Entrepreneurship",
                        "subsidy", "Rs 10,000 / month stipend",
                        "eligibility", "Any recognized degree/diploma in Tech/Engineering"
                ),
                Map.of(
                        "name", "National Apprenticeship Promotion Scheme (NAPS)",
                        "ministry", "Government of India",
                        "subsidy", "25% stipend sharing by Govt",
                        "eligibility", "All registered exchange job seekers"
                ),
                Map.of(
                        "name", "Gujarat State Rozgar Setu Job Fair Campaign",
                        "ministry", "Directorate of Employment and Training, Gujarat",
                        "subsidy", "Direct recruitment drive with 100+ verified employers",
                        "eligibility", "Open for all candidates with GJ-EXCH registration"
                )
        );
    }

    public List<Map<String, Object>> getJobFairs() {
        return List.of(
                Map.of(
                        "title", "Ahmedabad Mega Rozgar Mela 2026",
                        "location", "Gujarat University Convention Centre, Ahmedabad",
                        "date", "October 15, 2026",
                        "participatingCompanies", 45,
                        "openings", 1200
                ),
                Map.of(
                        "title", "Surat Textile & IT Talent Drive",
                        "location", "Sardar Vallabhbhai National Institute, Surat",
                        "date", "November 02, 2026",
                        "participatingCompanies", 30,
                        "openings", 850
                ),
                Map.of(
                        "title", "Vadodara Engineering & Manufacturing Fair",
                        "location", "MS University Campus, Vadodara",
                        "date", "November 20, 2026",
                        "participatingCompanies", 25,
                        "openings", 600
                )
        );
    }

    private GovtExchangeDto toDto(GovtExchangeProfile profile) {
        GovtExchangeDto dto = new GovtExchangeDto();
        dto.setId(profile.getId());
        dto.setRegistrationNumber(profile.getRegistrationNumber());
        dto.setDistrict(profile.getDistrict());
        dto.setQualificationLevel(profile.getQualificationLevel());
        dto.setEmploymentStatus(profile.getEmploymentStatus());
        dto.setEnrolledSchemesJson(profile.getEnrolledSchemesJson());
        dto.setPhysicallyChallenged(profile.isPhysicallyChallenged());
        dto.setCategoryGroup(profile.getCategoryGroup());
        dto.setRegisteredAt(profile.getRegisteredAt());
        return dto;
    }
}
