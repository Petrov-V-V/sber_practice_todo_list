package ru.sber.project_todo_list.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ru.sber.project_todo_list.entities.ERole;
import ru.sber.project_todo_list.entities.Role;

import java.util.Optional;

/**
 * Репозиторий отвечающий за обращение к базе данных для получения информации о ролях
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(ERole name);
}