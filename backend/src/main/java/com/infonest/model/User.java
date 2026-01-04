package com.infonest.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // Will store encrypted hash

    private String role; // STUDENT, FACULTY, ADMIN, OFFICE

    @Column(nullable = true)
    private String clubId; // Null for ADMIN/STUDENT, Required for FACULTY
}