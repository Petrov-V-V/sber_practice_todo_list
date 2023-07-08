package ru.sber.project_todo_list.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ru.sber.project_todo_list.entities.Category;
import ru.sber.project_todo_list.entities.ERole;
import ru.sber.project_todo_list.entities.Role;
import ru.sber.project_todo_list.entities.Task;

import java.util.List;
import java.util.Optional;

/**
 * Репозиторий отвечающий за обращение к базеданных для получения информации о категориях
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByUser_Id(long userId);
}