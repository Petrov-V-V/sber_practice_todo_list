package ru.sber.project_todo_list.services;
import java.util.List;
import ru.sber.project_todo_list.entities.Repetition;


/**
 * Интерфейс отвечающий за работу с сроками повторения
 */
public interface RepetitionServiceInterface {
    /**
     * Возвращает список всех сроков повторения
     */
    List<Repetition> findAllRepetitions();
}