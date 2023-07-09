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
import java.util.stream.Collectors;

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

    @Override
    public long add(Task task){
        if (categoryService.isCategoryExistsForUser(task.getCategory().getId())){
            Task savedTask = taskRepository.save(task);
            return savedTask.getId();
        } else {
            return 0;
        }
    }

    @Override
    public Optional<Task> findTaskById(long id){
        return taskRepository.findById(id);
    }

    @Override
    public boolean update(Task task){
        if (isTaskExistsForUser(task)){
            taskRepository.save(task);
            return true;
        } else {
            return false;
        }
    }
    
    @Override
    public boolean deleteTaskById(long id){
        if (isTaskExistsForUser(id)){
            taskRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<TaskDTO> findAllTasks() {
        List<CategoryDTO> categories = categoryService.findAllCategories();
        
        return categories.stream()
            .flatMap(category -> findTasksByCategory(category.getId()).stream())
            .collect(Collectors.toList());
    }
    
    @Override
    public List<TaskDTO> findTasksByCategory(long categoryId){
        List<Task> tasks = new ArrayList<>();
        if (categoryService.isCategoryExistsForUser(categoryId)){
            tasks = taskRepository.findAllByCategory_Id(categoryId);
        }
        return tasks.stream()
            .map(TaskDTO::new)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<TaskDTO> findTasksByNotification() {
        List<TaskDTO> tasks = findAllTasks();

        return tasks.stream()
                .filter(TaskService::isNotifiable)
                .collect(Collectors.toList());
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

    /**
     * Проверяет существует ли задача для пользователя
     */
    public boolean isTaskExistsForUser(Task task) {
        return taskRepository.existsById(task.getId()) && categoryService.isCategoryExistsForUser(task.getCategory().getId());
    }

    /**
     * Проверяет существует ли задача для пользователя
     */
    public boolean isTaskExistsForUser(long id) {
        Optional<Task> optionalTask = findTaskById(id);
        if (optionalTask.isPresent()) {
            return categoryService.isCategoryExistsForUser(optionalTask.get().getCategory().getId());
        }
        return false;
    }
}