package ru.sber.project_todo_list.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ru.sber.project_todo_list.entities.EPriority;
import ru.sber.project_todo_list.entities.ERepetition;
import ru.sber.project_todo_list.entities.Priority;
import ru.sber.project_todo_list.entities.Repetition;
import ru.sber.project_todo_list.repositories.PriorityRepository;


/**
 * Сервис отвечающий за работу с приоритетами
 */
@Service
public class PriorityService implements PriorityServiceInterface {
    private final PriorityRepository priorityRepository;

    /**
     * Конструктор сервиса приоритетов
     */
    @Autowired
    public PriorityService(PriorityRepository priorityRepository) {
        this.priorityRepository = priorityRepository;
    }
    
    @Override
    public List<Priority> findAllPriorities(){
        return priorityRepository.findAll();
    }

    @Override
    public Priority findByName(EPriority name){
        return priorityRepository.findByName(name).get();
    }
}