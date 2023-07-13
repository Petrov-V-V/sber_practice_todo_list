package ru.sber.project_todo_list.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Класс отвечающий за хранение информации о сроках повторения
 */
@Entity
@Table(name = "repetitions", schema = "todo_list_petrov_vv")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Repetition {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;
      
        @Enumerated(EnumType.STRING)
        @Column(length = 20)
        private ERepetition name;       
}
