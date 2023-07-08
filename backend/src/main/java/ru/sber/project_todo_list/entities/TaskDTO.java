package ru.sber.project_todo_list.entities;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;
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
}
