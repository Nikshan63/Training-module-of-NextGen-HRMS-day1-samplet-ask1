package com.projectmanagement.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ConfigResponse {
    private Long id;
    private Long projectId;
    private boolean allowMemberInvite;
    private boolean requireTaskApproval;
    private boolean notificationsEnabled;
    private String visibility;
    private String defaultTaskPriority;
    private String customLabels;
    private LocalDateTime updatedAt;
}
