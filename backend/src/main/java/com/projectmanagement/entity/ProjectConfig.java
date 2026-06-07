package com.projectmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_configs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false, unique = true)
    private Project project;

    @Builder.Default
    private boolean allowMemberInvite = true;

    @Builder.Default
    private boolean requireTaskApproval = false;

    @Builder.Default
    private boolean notificationsEnabled = true;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Visibility visibility = Visibility.PRIVATE;

    private String defaultTaskPriority;

    @Column(columnDefinition = "TEXT")
    private String customLabels;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Visibility {
        PUBLIC, PRIVATE, TEAM_ONLY
    }
}
