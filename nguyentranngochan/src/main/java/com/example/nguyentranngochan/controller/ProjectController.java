package com.example.nguyentranngochan.controller;

import com.example.nguyentranngochan.entity.Project;
import com.example.nguyentranngochan.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectRepository projectRepository;

    @GetMapping
    public List<Project> getAll() {
        return projectRepository.findAll();
    }

    @PostMapping
    public Project create(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> update(@PathVariable Long id, @RequestBody Project updated) {
        return projectRepository.findById(id).map(e -> {
            e.setName(updated.getName());
            e.setDescription(updated.getDescription());
            e.setTechStack(updated.getTechStack());
            e.setGithubUrl(updated.getGithubUrl());
            e.setLiveUrl(updated.getLiveUrl());
            e.setImageUrl(updated.getImageUrl());
            return ResponseEntity.ok(projectRepository.save(e));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!projectRepository.existsById(id)) return ResponseEntity.notFound().build();
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}