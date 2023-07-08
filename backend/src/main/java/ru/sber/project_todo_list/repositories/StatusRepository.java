package ru.sber.project_todo_list.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ru.sber.project_todo_list.entities.ERole;
import ru.sber.project_todo_list.entities.Priority;
import ru.sber.project_todo_list.entities.Repetition;
import ru.sber.project_todo_list.entities.Role;
import ru.sber.project_todo_list.entities.Status;

import java.util.Optional;

/**
 * Репозиторий отвечающий за обращение к базе данных для получения информации о статусах заданий
 */
@Repository
public interface StatusRepository extends JpaRepository<Status, Long> {
}