package ru.sber.project_todo_list.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ru.sber.project_todo_list.entities.Category;
import ru.sber.project_todo_list.entities.CategoryDTO;
import ru.sber.project_todo_list.entities.Task;
import ru.sber.project_todo_list.entities.User;
import ru.sber.project_todo_list.repositories.CategoryRepository;
import ru.sber.project_todo_list.security.services.UserDetailsImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    
    @Override
    public long add(Category category){
        category.setUser(new User(getUserIdOutOfSecurityContext()));
        if (isCategoryNameSuitabe(category)){
            Category savedCategory = categoryRepository.save(category);
            return savedCategory.getId();
        } else {
            return 0;
        }
    }
    
    @Override
    public boolean update(Category category){
        if (isCategoryExistsForUser(category.getId()) && isCategoryNameSuitabe(category)){
            category.setUser(new User(getUserIdOutOfSecurityContext()));
            categoryRepository.save(category);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public boolean deleteCategoryById(long id){
        if (isCategoryExistsForUser(id)){
            categoryRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
    
    @Override
    public Optional<Category> findCategoryById(){
        long userId = getUserIdOutOfSecurityContext();
        return categoryRepository.findById(userId);
    }
    
    @Override
    public List<CategoryDTO> findAllCategories() {
        long userId = getUserIdOutOfSecurityContext();
        List<Category> categories = categoryRepository.findAllByUser_Id(userId);
        return categories.stream()
            .map(category -> new CategoryDTO(category))
            .collect(Collectors.toList());
    }

    /**
     * Возвращает идентификатор пользователя из контекста безопасности
     */
    private long getUserIdOutOfSecurityContext() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetailsImpl) {
            return ((UserDetailsImpl)principal).getId();
        } else {
            throw new RuntimeException("Пользователь не найден");
        }
    }

    /**
     * Проверяет существует ли категория для пользователя
     */
    public boolean isCategoryExistsForUser(long id) {
        long userId = getUserIdOutOfSecurityContext();
        return categoryRepository.existsByIdAndUser_Id(id, userId);
    }

    /**
     * Проверяет подходящее ли имя задано для категории
     */
    private boolean isCategoryNameSuitabe(Category category) {
        if (category.getName().equals("Архив") || category.getName().equals("Корзина")){
            return false;
        } else {
            return true;
        }
    }

}