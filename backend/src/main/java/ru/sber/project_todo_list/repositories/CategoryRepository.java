package ru.sber.project_todo_list.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ru.sber.project_todo_list.entities.Category;
import java.util.List;

/**
 * Репозиторий отвечающий за обращение к базе данных для получения информации о категориях
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByUser_Id(long userId);

    boolean existsByIdAndUser_Id(long id, long userId);
}