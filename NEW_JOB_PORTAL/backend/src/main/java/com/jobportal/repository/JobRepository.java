package com.jobportal.repository;

import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiterUser(User recruiterUser);
    List<Job> findByCompany(Company company);
    List<Job> findByStatus(String status);
    List<Job> findByIsFeaturedTrueAndStatus(String status);

    @Query("SELECT j FROM Job j WHERE " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "  OR LOWER(j.skills) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "  OR LOWER(j.company.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:workMode IS NULL OR j.workMode = :workMode) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:minSalary IS NULL OR j.salaryMax >= :minSalary) AND " +
           "(:maxExp IS NULL OR j.experienceMin <= :maxExp) AND " +
           "(:category IS NULL OR LOWER(j.category) = LOWER(:category)) " +
           "ORDER BY j.isFeatured DESC, j.createdAt DESC")
    Page<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("workMode") String workMode,
            @Param("jobType") String jobType,
            @Param("minSalary") Long minSalary,
            @Param("maxExp") Integer maxExp,
            @Param("category") String category,
            @Param("status") String status,
            Pageable pageable
    );

    long countByStatus(String status);
}
