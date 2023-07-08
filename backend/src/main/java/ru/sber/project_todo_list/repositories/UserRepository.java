package ru.sber.project_todo_list.repositories;

import org.springframework.stereotype.Repository;

import ru.sber.project_todo_list.entities.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


/**
 * Репозиторий отвечающий за обращение к базе данных для получения информации о пользователях
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndPassword(String email, String password);
    
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}