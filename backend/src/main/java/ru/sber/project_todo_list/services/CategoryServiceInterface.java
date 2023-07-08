package ru.sber.project_todo_list.services;


import ru.sber.project_todo_list.entities.Category;
import ru.sber.project_todo_list.entities.CategoryDTO;

import java.util.List;
import java.util.Optional;

/**
 * Интерфейс отвечающий за работу с категориями
 */
public interface CategoryServiceInterface {
    long add(Category category);
    List<CategoryDTO> findAllCategories(long userId);
    Optional<Category> findCategoryById(long id);
    boolean update(Category category);
    boolean deleteCategoryById(long id);
}