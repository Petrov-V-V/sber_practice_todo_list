package ru.sber.project_todo_list.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ru.sber.project_todo_list.entities.CategoryDTO;
import ru.sber.project_todo_list.entities.Task;
import ru.sber.project_todo_list.entities.TaskDTO;
import ru.sber.project_todo_list.repositories.TaskRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Сервис отвечающий за работу с заданиями
 */
@Service
public class TaskService implements TaskServiceInterface {
    private final TaskRepository taskRepository;
    private final CategoryService categoryService;

    /**
     * Конструктор сервиса заданий
     */
    @Autowired
    public TaskService(TaskRepository taskRepository, CategoryService categoryService) {
        this.taskRepository = taskRepository;
        this.categoryService = categoryService;
    }

    /**
     * Добавляет новое задание
     */
    @Override
    public long add(Task task){
        Task savedTask = taskRepository.save(task);
        return savedTask.getId();
    }
    
    /**
     * Находит задание по его идентификатору
     */
    @Override
    public Optional<Task> findTaskById(long id){
        return taskRepository.findById(id);
    }

    /**
     * Обновляет информацию о задании
     */
    @Override
    public boolean update(Task task){
        if (taskRepository.existsById(task.getId())){
            taskRepository.save(task);
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Удаляет задание по его идентификатору
     */
    @Override
    public boolean deleteTaskById(long id){
        if (taskRepository.existsById(id)){
            taskRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Возвращает список всех заданий для указанного пользователя
     */
    @Override
    public List<TaskDTO> findAllTasks(long userId){
        List<CategoryDTO> categories = categoryService.findAllCategories(userId);
        List<TaskDTO> tasks = new ArrayList<>();
        for (CategoryDTO category : categories) {
            tasks.addAll(findTasksByCategory(category.getId()));
        }
        return tasks;
    }
    
    /**
     * Возвращает список заданий по указанной категории
     */
    @Override
    public List<TaskDTO> findTasksByCategory(long categoryId){
        List<Task> tasks = taskRepository.findAllByCategory_Id(categoryId);
        List<TaskDTO> tasksDTO = new ArrayList<>();
        for (Task task : tasks) {
            tasksDTO.add(new TaskDTO(task.getId(), task.getTitle(), task.getDescription(), task.getTaskDate(), task.getPriority().getName(), task.getStatus().getName(), task.getRepetition().getName()));
        }
        return tasksDTO;
    }
    
    /**
     * Возвращает список заданий, о которых необходимо уведомлять пользователя
     */
    @Override
    public List<TaskDTO> findTasksByNotification(long userId){
        List<TaskDTO> tasks = findAllTasks(userId);
        List<TaskDTO> tasksForNotification = new ArrayList<>();
        for (TaskDTO task : tasks) {
            if (isNotifiable(task)){
                tasksForNotification.add(task);
            }
        }
        return tasksForNotification;
    }

    /**
     * Проверяет, является ли задание подлежащим уведомлению в данный момент времени
     */
    private static boolean isNotifiable(TaskDTO taskDTO) {
        LocalDateTime nowTime = LocalDateTime.now();
        boolean isYear = taskDTO.getTaskDate().getYear() == nowTime.getYear();
        boolean isMonth = taskDTO.getTaskDate().getMonth() == nowTime.getMonth();
        boolean isDay  = taskDTO.getTaskDate().getDayOfMonth() == nowTime.getDayOfMonth();
        long diffTime = taskDTO.getTaskDate().getHour() * 60 + taskDTO.getTaskDate().getMinute()-(nowTime.getHour()* 60 + nowTime.getMinute());
        if(isYear && isMonth && isDay && diffTime < 20 && diffTime >=0){
            return true;
        }
        return false;
    }
}