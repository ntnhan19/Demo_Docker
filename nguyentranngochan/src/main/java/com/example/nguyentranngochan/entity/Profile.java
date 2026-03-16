package com.example.nguyentranngochan.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "profiles")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Profile {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String role;

    @Column(length = 1000)
    private String bio;

    private String email;
    private String github;
    private String linkedin;
    private String avatarUrl;

    @ElementCollection
    @CollectionTable(name = "profile_skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill")
    private List<String> skills;
}