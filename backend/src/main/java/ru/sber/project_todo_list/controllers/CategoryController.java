package ru.sber.project_todo_list.controllers;

import lombok.extern.slf4j.Slf4j;
import ru.sber.project_todo_list.entities.Category;
import ru.sber.project_todo_list.entities.CategoryDTO;
import ru.sber.project_todo_list.entities.Task;
import ru.sber.project_todo_list.entities.User;
import ru.sber.project_todo_list.services.CategoryService;
import ru.sber.project_todo_list.services.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.net.URI;
import java.util.List;
import java.util.Optional;

/**
 * Класс отвечающий за обработку запросов о категориях
 */
@Slf4j
@RestController
@RequestMapping("categories")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CategoryController {
    private CategoryService categoryService;

    /**
     * Конструктор контроллера категорий
     */
    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Получает список категорий для указанного пользователя
     */
    @GetMapping
    public List<CategoryDTO> getCategories(@RequestParam long userId) {
        log.info("Поиск категорий пользователя {}", userId);

        return categoryService.findAllCategories(userId);
    }

    /**
     * Добавляет новую категорию
     */
    @PostMapping
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        log.info("Добавление категории {}", category);

        return ResponseEntity.created(URI.create("/tasks/"+categoryService.add(category))).build();
    }

    /**
     * Обновляет информацию о категории
     */
    @PutMapping
    public Category updateCategory(@RequestBody Category category) {
        log.info("Обновление категории");
        categoryService.update(category);
        return category;
    }

    /**
     * Удаляет категорию по ее идентификатору
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable long id) {
        log.info("Удаление категории по id {}", id);
        boolean isDeleted = categoryService.deleteCategoryById(id);

        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
