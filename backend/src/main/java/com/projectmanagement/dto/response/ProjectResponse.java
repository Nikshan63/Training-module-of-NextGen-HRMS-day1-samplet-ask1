package com.projectmanagement.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private String status;
    private UserResponse owner;
    private int memberCount;
    private long totalTasks;
    private long completedTasks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
