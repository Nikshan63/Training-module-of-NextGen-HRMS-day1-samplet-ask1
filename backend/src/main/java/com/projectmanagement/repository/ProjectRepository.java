package com.projectmanagement.repository;

import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(User owner);

    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.user.id = :userId")
    List<Project> findProjectsByMemberId(@Param("userId") Long userId);

    @Query("SELECT p FROM Project p WHERE p.owner.id = :userId OR EXISTS " +
           "(SELECT m FROM ProjectMember m WHERE m.project = p AND m.user.id = :userId)")
    List<Project> findAllAccessibleByUser(@Param("userId") Long userId);
}
