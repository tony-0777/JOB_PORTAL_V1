package com.jobportal.repository;

import com.jobportal.model.Conversation;
import com.jobportal.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);
    Page<Message> findByConversationOrderBySentAtDesc(Conversation conversation, Pageable pageable);
    
    // FR-CH-05: Deduplication by clientMsgId
    boolean existsByClientMsgId(String clientMsgId);
    Optional<Message> findByClientMsgId(String clientMsgId);
}
