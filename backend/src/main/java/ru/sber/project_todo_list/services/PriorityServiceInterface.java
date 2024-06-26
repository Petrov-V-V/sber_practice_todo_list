package ru.sber.project_todo_list.services;
import java.util.List;

import ru.sber.project_todo_list.entities.EPriority;
import ru.sber.project_todo_list.entities.Priority;


/**
 * Интерфейс отвечающий за работу с приоритетами
 */
public interface PriorityServiceInterface {
    /**
     * Возвращает список всех приоритетов
     */
    List<Priority> findAllPriorities();
    /**
     * Ищет приоритет по имени
     */
    Priority findByName(EPriority name);
}