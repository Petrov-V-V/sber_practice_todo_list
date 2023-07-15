package ru.sber.project_todo_list.services;


import ru.sber.project_todo_list.entities.Category;
import ru.sber.project_todo_list.entities.CategoryDTO;
import ru.sber.project_todo_list.entities.TaskDTO;

import java.util.List;
import java.util.Optional;

/**
 * Интерфейс отвечающий за работу с категориями
 */
public interface CategoryServiceInterface {
    /**
     * Добавляет новую категорию
     */
    long add(Category category);
    /**
     * Обновляет информацию о категории
     */
    boolean update(Category category);
    /**
     * Удаляет категорию по ее идентификатору
     */
    boolean deleteCategoryById(long id);
    /**
     * Находит категорию по ее идентификатору
     */
    Optional<Category> findCategoryById();
    /**
     * Возвращает список всех категорий для указанного пользователя
     */
    List<CategoryDTO> findAllCategories();
    /**
     * Проверяет является ли категория пустой для указанного пользователя
     */
    boolean isCategoryEmpty(long id);
}