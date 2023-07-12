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
    public List<CategoryDTO> getCategories() {
        log.info("Поиск категорий пользователя");

        return categoryService.findAllCategories();
    }

    /**
     * Добавляет новую категорию
     */
    @PostMapping
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        log.info("Добавление категории {}", category);
        long id = categoryService.add(category);

        if (id != 0){
            return ResponseEntity.created(URI.create("/categories/"+id)).build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Обновляет информацию о категории
     */
    @PutMapping
    public ResponseEntity<?> updateCategory(@RequestBody Category category) {
        log.info("Обновление категории");
        if (categoryService.update(category)){
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
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
