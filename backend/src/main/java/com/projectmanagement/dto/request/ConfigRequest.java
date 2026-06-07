package com.projectmanagement.dto.request;

import lombok.Data;

@Data
public class ConfigRequest {
    private boolean allowMemberInvite;
    private boolean requireTaskApproval;
    private boolean notificationsEnabled;
    private String visibility;
    private String defaultTaskPriority;
    private String customLabels;
}
