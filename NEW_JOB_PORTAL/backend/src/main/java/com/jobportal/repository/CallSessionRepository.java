package com.jobportal.repository;

import com.jobportal.model.CallSession;
import com.jobportal.model.Conversation;
import com.jobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CallSessionRepository extends JpaRepository<CallSession, Long> {
    List<CallSession> findByConversationOrderByStartedAtDesc(Conversation conversation);

    @Query("SELECT cs FROM CallSession cs WHERE cs.callerUser = :user OR cs.calleeUser = :user ORDER BY cs.startedAt DESC")
    List<CallSession> findByUser(@Param("user") User user);

    Optional<CallSession> findByChannelName(String channelName);
}
