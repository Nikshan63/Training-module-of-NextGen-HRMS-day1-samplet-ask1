package com.projectmanagement.service;

import com.projectmanagement.dto.request.ProjectRequest;
import com.projectmanagement.dto.response.ProjectResponse;
import com.projectmanagement.dto.response.UserResponse;
import com.projectmanagement.entity.*;
import com.projectmanagement.exception.ResourceNotFoundException;
import com.projectmanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository memberRepository;
    private final TaskRepository taskRepository;
    private final ProjectConfigRepository configRepository;

    public List<ProjectResponse> getAllProjectsForUser(String email) {
        User user = getUserByEmail(email);
        return projectRepository.findAllAccessibleByUser(user.getId())
                .stream().map(p -> toResponse(p)).collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(Long id, String email) {
        Project project = findProject(id);
        verifyAccess(project, email);
        return toResponse(project);
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, String email) {
        User owner = getUserByEmail(email);

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(Project.Status.ACTIVE)
                .owner(owner)
                .build();

        projectRepository.save(project);

        // Auto-add owner as OWNER member
        ProjectMember ownerMember = ProjectMember.builder()
                .project(project)
                .user(owner)
                .role(ProjectMember.MemberRole.OWNER)
                .build();
        memberRepository.save(ownerMember);

        // Create default config
        ProjectConfig config = ProjectConfig.builder()
                .project(project)
                .build();
        configRepository.save(config);

        return toResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request, String email) {
        Project project = findProject(id);
        verifyOwnerOrManager(project, email);

        project.setTitle(request.getTitle());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            project.setStatus(Project.Status.valueOf(request.getStatus()));
        }

        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(Long id, String email) {
        Project project = findProject(id);
        verifyOwner(project, email);
        projectRepository.delete(project);
    }

    // ── helpers ──────────────────────────────────────────────
    private Project findProject(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private void verifyAccess(Project project, String email) {
        User user = getUserByEmail(email);
        boolean isOwner = project.getOwner().getId().equals(user.getId());
        boolean isMember = memberRepository.existsByProjectIdAndUserId(project.getId(), user.getId());
        if (!isOwner && !isMember) throw new RuntimeException("Access denied");
    }

    private void verifyOwner(Project project, String email) {
        User user = getUserByEmail(email);
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Only the owner can perform this action");
        }
    }

    private void verifyOwnerOrManager(Project project, String email) {
        User user = getUserByEmail(email);
        boolean isOwner = project.getOwner().getId().equals(user.getId());
        boolean isManager = memberRepository.findByProjectIdAndUserId(project.getId(), user.getId())
                .map(m -> m.getRole() == ProjectMember.MemberRole.MANAGER ||
                          m.getRole() == ProjectMember.MemberRole.OWNER)
                .orElse(false);
        if (!isOwner && !isManager) throw new RuntimeException("Insufficient permissions");
    }

    public ProjectResponse toResponse(Project p) {
        long total = taskRepository.countByProjectId(p.getId());
        long done = taskRepository.countByProjectIdAndStatus(p.getId(), Task.Status.DONE);
        int memberCount = p.getMembers() != null ? p.getMembers().size() : 0;

        return ProjectResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .status(p.getStatus().name())
                .owner(toUserResponse(p.getOwner()))
                .memberCount(memberCount)
                .totalTasks(total)
                .completedTasks(done)
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    public UserResponse toUserResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole().name())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
