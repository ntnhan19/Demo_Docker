package com.example.nguyentranngochan.controller;

import com.example.nguyentranngochan.entity.Profile;
import com.example.nguyentranngochan.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileRepository profileRepository;

    @GetMapping
    public List<Profile> getAll() {
        return profileRepository.findAll();
    }

    @PostMapping
    public Profile create(@RequestBody Profile profile) {
        return profileRepository.save(profile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profile> update(@PathVariable Long id, @RequestBody Profile updated) {
        return profileRepository.findById(id).map(e -> {
            e.setFullName(updated.getFullName());
            e.setRole(updated.getRole());
            e.setBio(updated.getBio());
            e.setEmail(updated.getEmail());
            e.setGithub(updated.getGithub());
            e.setLinkedin(updated.getLinkedin());
            e.setAvatarUrl(updated.getAvatarUrl());
            e.setSkills(updated.getSkills());
            return ResponseEntity.ok(profileRepository.save(e));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!profileRepository.existsById(id)) return ResponseEntity.notFound().build();
        profileRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}