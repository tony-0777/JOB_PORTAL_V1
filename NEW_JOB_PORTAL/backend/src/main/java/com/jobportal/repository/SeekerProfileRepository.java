package com.jobportal.repository;

import com.jobportal.model.SeekerProfile;
import com.jobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeekerProfileRepository extends JpaRepository<SeekerProfile, Long> {
    Optional<SeekerProfile> findByUser(User user);
    Optional<SeekerProfile> findByUserId(Long userId);
    Optional<SeekerProfile> findByExchangeRegistrationNo(String exchangeRegistrationNo);

    @Query("SELECT s FROM SeekerProfile s WHERE " +
           "(:skills IS NULL OR LOWER(s.skills) LIKE LOWER(CONCAT('%', :skills, '%'))) AND " +
           "(:minExp IS NULL OR s.experienceYears >= :minExp) AND " +
           "s.privacyVisibility != 'PRIVATE'")
    List<SeekerProfile> searchCandidates(@Param("skills") String skills, @Param("minExp") Integer minExp);
}
