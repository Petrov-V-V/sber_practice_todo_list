package ru.sber.project_todo_list.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Класс отвечающий за хранение информации о приоритетах
 */
@Entity
@Table(name = "priorities", schema = "todo_list_petrov_vv")
@Data
@NoArgsConstructor
public class Priority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
  
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EPriority name;     
}
