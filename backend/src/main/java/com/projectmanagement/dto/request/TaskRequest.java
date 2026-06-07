package com.projectmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotBlank
    private String title;
    private String description;
    private String status;
    private String priority;
    private LocalDate dueDate;
    private Long assigneeId;
}
