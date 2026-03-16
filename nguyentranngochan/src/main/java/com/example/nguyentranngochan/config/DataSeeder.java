package com.example.nguyentranngochan.config;

import com.example.nguyentranngochan.entity.*;
import com.example.nguyentranngochan.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final MessageRepository messageRepository;

    @Override
    public void run(String... args) {

        if (profileRepository.count() == 0) {
            profileRepository.save(Profile.builder()
                .fullName("Nguyen Tran Ngoc Han")
                .role("Full-Stack Developer Intern")
                .bio("4th-year Software Engineering student at HUTECH (GPA 3.30/4.0). Passionate about building modern web applications with PERN Stack & Spring Boot.")
                .email("ngochanpt2018@gmail.com")
                .github("https://github.com/ntnhan19")
                .linkedin("https://linkedin.com/in/nguyentranngochan")
                .skills(List.of("Java", "Spring Boot", "React.js", "Node.js",
                                "PostgreSQL", "SQL Server", "Docker", "Git", "REST API"))
                .build());
        }

        if (projectRepository.count() == 0) {
            projectRepository.saveAll(List.of(
                Project.builder()
                    .name("E-Commerce Platform")
                    .description("Full-stack e-commerce app: product management, cart, order system. Group project with 7 members managed via Jira.")
                    .techStack("React.js · Node.js · PostgreSQL · Express")
                    .githubUrl("https://github.com/nguyentranngochan/ecommerce")
                    .build(),
                Project.builder()
                    .name("Portfolio Website")
                    .description("Bilingual (EN/VI) personal portfolio with i18n system, React Context, and Be Vietnam Pro font support.")
                    .techStack("React.js · Vite · CSS Modules")
                    .githubUrl("https://github.com/nguyentranngochan/portfolio")
                    .build(),
                Project.builder()
                    .name("Spring Boot REST API")
                    .description("Dockerized REST API with Spring Boot + SQL Server. Multi-stage Docker build, deployed to Docker Hub.")
                    .techStack("Spring Boot · SQL Server · Docker · Maven")
                    .githubUrl("https://github.com/nguyentranngochan/spring-api")
                    .build()
            ));
        }

        if (messageRepository.count() == 0) {
            messageRepository.saveAll(List.of(
                Message.builder().visitorName("Anh Tuấn").content("Portfolio rất đẹp! Chúc em sớm tìm được internship nhé 🎉").build(),
                Message.builder().visitorName("Minh Khoa").content("Code sạch, design chuẩn. Ấn tượng với phần Docker setup!").build()
            ));
        }
    }
}