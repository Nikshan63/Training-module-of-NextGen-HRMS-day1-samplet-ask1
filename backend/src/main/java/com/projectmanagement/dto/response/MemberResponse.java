package com.projectmanagement.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MemberResponse {
    private Long id;
    private UserResponse user;
    private String role;
    private LocalDateTime joinedAt;
}
