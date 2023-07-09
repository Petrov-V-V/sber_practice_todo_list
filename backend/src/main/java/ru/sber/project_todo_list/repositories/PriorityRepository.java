package ru.sber.project_todo_list.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ru.sber.project_todo_list.entities.Priority;

/**
 * Репозиторий отвечающий за обращение к базе данных для получения информации о приоритетах
 */
@Repository
public interface PriorityRepository extends JpaRepository<Priority, Long> {
}