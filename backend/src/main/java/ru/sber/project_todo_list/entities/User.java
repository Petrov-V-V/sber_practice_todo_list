package ru.sber.project_todo_list.entities;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

/**
 * Класс отвечающий за хранение информации о пользователях
 */
@Entity
@Data
@NoArgsConstructor
@Table(name = "users", 
        uniqueConstraints = { 
          @UniqueConstraint(columnNames = "username"),
          @UniqueConstraint(columnNames = "email") }
        , schema = "todo_list_petrov_vv")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 255)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 255)
    private String email;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"), schema = "todo_list_petrov_vv")
    private Set<Role> roles = new HashSet<>();

    public User(String username, String email, String password) {
      this.username = username;
      this.email = email;
      this.password = password;
    }

    public User(long id) {
      this.id = id;
    }
}