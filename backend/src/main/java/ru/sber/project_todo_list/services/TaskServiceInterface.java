package ru.sber.project_todo_list.services;


import ru.sber.project_todo_list.entities.Task;
import ru.sber.project_todo_list.entities.TaskDTO;

import java.util.List;
import java.util.Optional;


/**
 * Интерфейс отвечающий за работу с заданиями
 */
public interface TaskServiceInterface {
    /**
     * Добавляет новое задание
     */
    long add(Task task);
    
    /**
     * Находит задание по его идентификатору
     */
    Optional<Task> findTaskById(long id);

    /**
     * Обновляет информацию о задании
     */
    boolean update(Task task);

    /**
     * Удаляет задание по его идентификатору
     */
    boolean deleteTaskById(long id);

    /**
     * Возвращает список всех заданий для указанного пользователя
     */
    List<TaskDTO> findAllTasks();

    /**
     * Возвращает список заданий по указанной категории
     */
    List<TaskDTO> findTasksByCategory(long categoryId);

    /**
     * Возвращает список заданий, о которых необходимо уведомлять пользователя
     */
    List<TaskDTO> findTasksByNotification();
    
    /**
     * Возвращает список заданий которые нужно выполнить сегодня
     */
    List<TaskDTO> findTasksToday();
}