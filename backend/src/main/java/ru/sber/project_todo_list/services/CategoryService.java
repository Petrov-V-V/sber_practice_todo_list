package ru.sber.project_todo_list.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ru.sber.project_todo_list.entities.Category;
import ru.sber.project_todo_list.entities.CategoryDTO;
import ru.sber.project_todo_list.entities.Task;
import ru.sber.project_todo_list.repositories.CategoryRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Сервис отвечающий за работу с категориями
 */
@Service
public class CategoryService  implements CategoryServiceInterface {
    private final CategoryRepository categoryRepository;

    /**
     * Конструктор сервиса категорий
     */
    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    /**
     * Добавляет новую категорию
     */
    @Override
    public long add(Category category){
        Category savedCategory = categoryRepository.save(category);
        return savedCategory.getId();
    }
    
    /**
     * Обновляет информацию о категории
     */
    @Override
    public boolean update(Category category){
        if (categoryRepository.existsById(category.getId())){
            categoryRepository.save(category);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Удаляет категорию по ее идентификатору
     */
    @Override
    public boolean deleteCategoryById(long id){
        if (categoryRepository.existsById(id)){
            categoryRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Находит категорию по ее идентификатору
     */
    @Override
    public Optional<Category> findCategoryById(long id){
        return categoryRepository.findById(id);
    }
    
    /**
     * Возвращает список всех категорий для указанного пользователя
     */
    @Override
    public List<CategoryDTO> findAllCategories(long userId){
        List<Category> categories = categoryRepository.findAllByUser_Id(userId);
        List<CategoryDTO> categoriesDTO = new ArrayList<>();
        for (Category category : categories) {
            categoriesDTO.add(new CategoryDTO(category.getId(), category.getName(), category.getUser().getId()));
        }
        return categoriesDTO;
    }
}