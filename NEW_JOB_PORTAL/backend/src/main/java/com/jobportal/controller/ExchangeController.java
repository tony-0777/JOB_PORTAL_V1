package com.jobportal.controller;

import com.jobportal.dto.GovtExchangeDto;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.UserPrincipal;
import com.jobportal.service.ExchangeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exchange")
public class ExchangeController {

    private final ExchangeService exchangeService;
    private final UserRepository userRepository;

    public ExchangeController(ExchangeService exchangeService, UserRepository userRepository) {
        this.exchangeService = exchangeService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('SEEKER')")
    public ResponseEntity<GovtExchangeDto> register(
            @RequestBody GovtExchangeDto request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User seeker = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(exchangeService.registerSeeker(request, seeker));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('SEEKER')")
    public ResponseEntity<GovtExchangeDto> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        User seeker = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return exchangeService.getProfile(seeker)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @GetMapping("/schemes")
    public ResponseEntity<List<Map<String, Object>>> getSchemes() {
        return ResponseEntity.ok(exchangeService.getAvailableSchemes());
    }

    @GetMapping("/fairs")
    public ResponseEntity<List<Map<String, Object>>> getJobFairs() {
        return ResponseEntity.ok(exchangeService.getJobFairs());
    }
}
