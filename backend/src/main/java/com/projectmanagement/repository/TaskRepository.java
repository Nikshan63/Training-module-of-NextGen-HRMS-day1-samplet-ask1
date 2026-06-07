package com.projectmanagement.repository;

import com.projectmanagement.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByProjectIdAndStatus(Long projectId, Task.Status status);
    List<Task> findByAssigneeId(Long assigneeId);
    long countByProjectId(Long projectId);
    long countByProjectIdAndStatus(Long projectId, Task.Status status);
}
