package ru.sber.project_todo_list.repositories;

import org.springframework.stereotype.Repository;

import ru.sber.project_todo_list.entities.Task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


/**
 * Репозиторий отвечающий за обращение к базе данных для получения информации о заданиях
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByCategory_Id(long categoryId);
}