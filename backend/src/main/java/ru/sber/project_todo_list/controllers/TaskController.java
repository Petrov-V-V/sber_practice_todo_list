package ru.sber.project_todo_list.controllers;

import lombok.extern.slf4j.Slf4j;
import ru.sber.project_todo_list.entities.Category;
import ru.sber.project_todo_list.entities.Priority;
import ru.sber.project_todo_list.entities.Repetition;
import ru.sber.project_todo_list.entities.Status;
import ru.sber.project_todo_list.entities.Task;
import ru.sber.project_todo_list.entities.TaskDTO;
import ru.sber.project_todo_list.entities.User;
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

/**
 * Класс отвечающий за обработку запросов о заданиях
 */
@Slf4j
@RestController
@RequestMapping("tasks")
public class TaskController {
    private TaskService taskService;
    private RepetitionService repetitionService;
    private StatusService statusService;
    private PriorityService priorityService;

    /**
     * Конструктор контроллера заданий
     */
    @Autowired
    public TaskController(TaskService taskService, RepetitionService repetitionService, StatusService statusService, PriorityService priorityService) {
        this.taskService = taskService;
        this.repetitionService = repetitionService;
        this.statusService = statusService;
        this.priorityService = priorityService;
    }

    /**
     * Получает список заданий для указанного пользователя
     */
    @GetMapping
    public List<TaskDTO> getTasks() {
        log.info("Поиск заданий пользователя");

        return taskService.findAllTasks();
    }

    /**
     * Получает список заданий по указанной категории
     */
    @GetMapping("/categories")
    public List<TaskDTO> getTasksByCategory(@RequestParam long categoryId) {
        log.info("Поиск задач по категории");
        return taskService.findTasksByCategory(categoryId);
    }

    /**
     * Получает список заданий, о которых необходимо уведомлять пользователя
     */
    @GetMapping("/notifications")
    public List<TaskDTO> getTasksByNotification() {
        log.info("Поиск задач о которых нужно уведомлять");
        return taskService.findTasksByNotification();
    }

    /**
     * Получает список заданий сегодня
     */
    @GetMapping("/today")
    public List<TaskDTO> getTasksToday() {
        log.info("Поиск задач сегодня");
        return taskService.findTasksToday();
    }


    /**
     * Добавляет новое задание
     */
    @PostMapping
    public ResponseEntity<?> addTask(@RequestBody Task task) {
        log.info("Добавление задания {}", task);
        long id = taskService.add(task);

        if (id != 0){
            return ResponseEntity.created(URI.create("/tasks/"+id)).build();
        } else {
            return ResponseEntity.badRequest().build();
        }

    }

    /**
     * Обновляет информацию о задании
     */
    @PutMapping
    public ResponseEntity<?> updateTask(@RequestBody Task task) {
        log.info("Обновление задания");
        if (taskService.update(task)){
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Удаляет задание по его идентификатору
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable long id) {
        log.info("Удаление задания по id {}", id);
        boolean isDeleted = taskService.deleteTaskById(id);

        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Получает список статусов
     */
    @GetMapping("/statuses")
    public List<Status> getStatuses() {
        log.info("Поиск статутов заданий");

        return statusService.findAllStatuses();
    }

    /**
     * Получает список приоритетов
     */
    @GetMapping("/priorities")
    public List<Priority> getPriorities() {
        log.info("Поиск приоритетов");

        return priorityService.findAllPriorities();
    }

    /**
     * Получает список сроков повторения
     */
    @GetMapping("/repetitions")
    public List<Repetition> getRepetitions() {
        log.info("Поиск сроков повторения");

        return repetitionService.findAllRepetitions();
    }
}
