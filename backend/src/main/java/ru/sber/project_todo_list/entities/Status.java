package ru.sber.project_todo_list.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Класс отвечающий за хранение информации о статусах заданий
 */
@Entity
@Table(name = "statuses", schema = "todo_list_petrov_vv")
@Data
@NoArgsConstructor
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
  
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EStatus name;    
}
