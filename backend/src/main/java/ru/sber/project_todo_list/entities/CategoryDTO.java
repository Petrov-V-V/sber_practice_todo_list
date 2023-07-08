package ru.sber.project_todo_list.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Класс отвечающий за хранение урезанной информации о категориях
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {
    private long id;
  
    private String name;

    private long userid;
}
