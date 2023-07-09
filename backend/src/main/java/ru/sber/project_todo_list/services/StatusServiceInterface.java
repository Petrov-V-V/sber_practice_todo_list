package ru.sber.project_todo_list.services;
import java.util.List;
import ru.sber.project_todo_list.entities.Status;


/**
 * Интерфейс отвечающий за работу со статусами
 */
public interface StatusServiceInterface {
    /**
     * Возвращает список всех статусов
     */
    List<Status> findAllStatuses();
}