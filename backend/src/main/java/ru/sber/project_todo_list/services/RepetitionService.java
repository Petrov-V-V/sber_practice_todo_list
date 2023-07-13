package ru.sber.project_todo_list.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ru.sber.project_todo_list.entities.ERepetition;
import ru.sber.project_todo_list.entities.EStatus;
import ru.sber.project_todo_list.entities.Repetition;
import ru.sber.project_todo_list.entities.Status;
import ru.sber.project_todo_list.repositories.RepetitionRepository;


/**
 * Сервис отвечающий за работу со сроками повторения
 */
@Service
public class RepetitionService implements RepetitionServiceInterface {
    private final RepetitionRepository repetitionRepository;

    /**
     * Конструктор сервиса сроков повторения
     */
    @Autowired
    public RepetitionService(RepetitionRepository repetitionRepository) {
        this.repetitionRepository = repetitionRepository;
    }
    
    @Override
    public List<Repetition> findAllRepetitions(){
        return repetitionRepository.findAll();
    }

    @Override
    public Repetition findByName(ERepetition name){
        return repetitionRepository.findByName(name).get();
    }
}