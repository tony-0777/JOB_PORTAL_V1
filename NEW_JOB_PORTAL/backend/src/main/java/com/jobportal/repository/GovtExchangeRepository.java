package com.jobportal.repository;

import com.jobportal.model.GovtExchangeProfile;
import com.jobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GovtExchangeRepository extends JpaRepository<GovtExchangeProfile, Long> {
    Optional<GovtExchangeProfile> findBySeekerUser(User seekerUser);
    Optional<GovtExchangeProfile> findByRegistrationNumber(String registrationNumber);
    boolean existsByRegistrationNumber(String registrationNumber);
}
