package ru.sber.project_todo_list.services;


import ru.sber.project_todo_list.entities.Task;
import ru.sber.project_todo_list.entities.TaskDTO;

import java.util.List;
import java.util.Optional;


/**
 * Интерфейс отвечающий за работу с заданиями
 */
public interface TaskServiceInterface {
    long add(Task task);
    Optional<Task> findTaskById(long id);
    List<TaskDTO> findAllTasks(long userId);
    List<TaskDTO> findTasksByCategory(long categoryId);
    List<TaskDTO> findTasksByNotification(long userId);
    boolean update(Task task);
    boolean deleteTaskById(long id);
}