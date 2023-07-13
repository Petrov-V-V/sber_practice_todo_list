package ru.sber.project_todo_list.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ru.sber.project_todo_list.entities.EStatus;
import ru.sber.project_todo_list.entities.Status;
import ru.sber.project_todo_list.repositories.StatusRepository;


/**
 * Сервис отвечающий за работу со статусами
 */
@Service
public class StatusService implements StatusServiceInterface{
    private final StatusRepository statusRepository;

    /**
     * Конструктор сервиса статусов
     */
    @Autowired
    public StatusService(StatusRepository statusRepository) {
        this.statusRepository = statusRepository;
    }

    @Override
    public List<Status> findAllStatuses(){
        return statusRepository.findAll();
    }

    @Override
    public Status findByName(EStatus name){
        return statusRepository.findByName(name).get();
    }
}