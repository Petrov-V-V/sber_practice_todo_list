package ru.sber.project_todo_list.entities;


import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Класс отвечающий за хранение урезанной информации о заданиях
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private long id;

    private String title;

    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime taskDate;

    private EPriority priority;

    private EStatus status;

    private ERepetition repetition;

    public TaskDTO(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.taskDate = task.getTaskDate();
        this.priority = task.getPriority().getName();
        this.status = task.getStatus().getName();
        this.repetition = task.getRepetition().getName();
    }
}
