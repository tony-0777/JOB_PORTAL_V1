package com.jobportal.repository;

import com.jobportal.model.Conversation;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c WHERE c.seekerUser = :user OR c.recruiterUser = :user ORDER BY c.lastMessageAt DESC")
    List<Conversation> findByUser(@Param("user") User user);

    Optional<Conversation> findByJobAndSeekerUserAndRecruiterUser(Job job, User seekerUser, User recruiterUser);

    @Query("SELECT c FROM Conversation c WHERE (c.seekerUser = :u1 AND c.recruiterUser = :u2) OR (c.seekerUser = :u2 AND c.recruiterUser = :u1)")
    List<Conversation> findBetweenUsers(@Param("u1") User u1, @Param("u2") User u2);
}
