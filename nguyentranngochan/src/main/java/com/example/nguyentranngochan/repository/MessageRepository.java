package com.example.nguyentranngochan.repository;

import com.example.nguyentranngochan.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    // Lấy tất cả theo thứ tự mới nhất trước
    List<Message> findAllByOrderByCreatedAtDesc();
}