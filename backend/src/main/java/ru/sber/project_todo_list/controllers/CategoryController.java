package ru.sber.project_todo_list.controllers;

import lombok.extern.slf4j.Slf4j;
import ru.sber.project_todo_list.entities.Category;
import ru.sber.project_todo_list.entities.CategoryDTO;
import ru.sber.project_todo_list.entities.Task;
import ru.sber.project_todo_list.entities.TaskDTO;
import ru.sber.project_todo_list.entities.User;
import ru.sber.project_todo_list.services.CategoryService;
import ru.sber.project_todo_list.services.PriorityService;
import ru.sber.project_todo_list.services.RepetitionService;
import ru.sber.project_todo_list.services.StatusService;
import ru.sber.project_todo_list.services.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Класс отвечающий за обработку запросов о категориях
 */
@Slf4j
@RestController
@RequestMapping("categories")
public class CategoryController {
    private CategoryService categoryService;
    private final TaskService taskService;
    private final PriorityService priorityService;
    private final RepetitionService repetitionService;
    private final StatusService statusService;

    /**
     * Конструктор контроллера категорий
     */
    @Autowired
    public CategoryController(CategoryService categoryService, 
                                TaskService taskService,
                                PriorityService priorityService,
                                RepetitionService repetitionService,
                                StatusService statusService) {
        this.categoryService = categoryService;
        this.taskService = taskService;
        this.priorityService = priorityService;
        this.repetitionService = repetitionService;
        this.statusService = statusService;
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
     * Проверяет является ли категория пустой для указанного пользователя
     */
    @GetMapping("/{id}")
    public boolean isCategoryEmpty(@PathVariable long id) {
        log.info("Проверка является ли категория пустой");

        return categoryService.isCategoryEmpty(id);
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

    /**
     * Удаляет категорию по ее идентификатору и задания в ней
     */
    @DeleteMapping("/with-tasks/{id}")
    public ResponseEntity<?> deleteCategoryAndTasks(@PathVariable long id) {
        log.info("Удаление категории и заданий в ней по id {}", id);
        List<TaskDTO> tasks = taskService.findTasksByCategory(id);
        tasks.stream()
            .map(TaskDTO::getId)
            .forEach(taskService::deleteTaskById);
        boolean isDeleted = categoryService.deleteCategoryById(id);

        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Удаляет категорию по ее идентификатору и переносит задания в ней в архив
     */
    @DeleteMapping("{id}/archiving-tasks/{archiveId}")
    public ResponseEntity<?> deleteCategoryAndArchiveTasks(@PathVariable long id, @PathVariable long archiveId) {
        log.info("Удаление категории и архивирование заданий в ней по id {}", id);
        List<Task> tasks = taskService.findTasksByCategory(id)
                                          .stream()
                                          .map(task ->{
                                            Task newTask = new Task();
                                            newTask.setId(task.getId());
                                            newTask.setTitle(task.getTitle());
                                            newTask.setDescription(task.getDescription());
                                            newTask.setTaskDate(task.getTaskDate());
                                            newTask.setPriority(priorityService.findByName(task.getPriority()));
                                            newTask.setStatus(statusService.findByName(task.getStatus()));
                                            newTask.setRepetition(repetitionService.findByName(task.getRepetition()));
                                            newTask.setCategory(new Category(task.getCategoryDTO().getId(), null, null));
                                            return newTask;
                                        })
                                          .collect(Collectors.toList());
    
        tasks.forEach(task -> task.getCategory().setId(archiveId));
        tasks.forEach(taskService::update);
        boolean isDeleted = categoryService.deleteCategoryById(id);


        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
