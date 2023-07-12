package ru.sber.project_todo_list.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Класс отвечающий за хранение информации о категориях
 */
@Entity
@Table(name = "categories", schema = "todo_list_petrov_vv")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
  
    @Column(length = 255)
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false  )
    private User user;
}
