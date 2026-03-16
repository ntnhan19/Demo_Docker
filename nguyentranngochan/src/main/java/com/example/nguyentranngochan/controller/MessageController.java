package com.example.nguyentranngochan.controller;

import com.example.nguyentranngochan.entity.Message;
import com.example.nguyentranngochan.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageRepository messageRepository;

    // GET /api/messages — lấy tất cả (mới nhất trước)
    @GetMapping
    public List<Message> getAll() {
        return messageRepository.findAllByOrderByCreatedAtDesc();
    }

    // POST /api/messages — gửi lời nhắn mới
    @PostMapping
    public Message create(@RequestBody Message message) {
        // Không cho client tự set id hoặc createdAt
        message.setId(null);
        message.setCreatedAt(null);
        return messageRepository.save(message);
    }

    // DELETE /api/messages/{id} — xóa lời nhắn (admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!messageRepository.existsById(id)) return ResponseEntity.notFound().build();
        messageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}