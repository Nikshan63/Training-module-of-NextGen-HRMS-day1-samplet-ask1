package com.projectmanagement.repository;

import com.projectmanagement.entity.ProjectConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProjectConfigRepository extends JpaRepository<ProjectConfig, Long> {
    Optional<ProjectConfig> findByProjectId(Long projectId);
}
