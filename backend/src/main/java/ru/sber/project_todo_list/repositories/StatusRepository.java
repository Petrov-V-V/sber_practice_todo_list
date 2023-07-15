package ru.sber.project_todo_list.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ru.sber.project_todo_list.entities.EStatus;
import ru.sber.project_todo_list.entities.Status;


/**
 * Репозиторий отвечающий за обращение к базе данных для получения информации о статусах заданий
 */
@Repository
public interface StatusRepository extends JpaRepository<Status, Long> {
    Optional<Status> findByName(EStatus name);
}