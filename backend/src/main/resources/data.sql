INSERT INTO todo_list_petrov_vv.roles (id, name)
VALUES
    (1, 'ROLE_USER'),
    (2, 'ROLE_ADMIN');
INSERT INTO todo_list_petrov_vv.statuses (id, name)
VALUES
    (1, 'IN_PROGRESS'),
    (2, 'ON_HOLD'),
    (3, 'COMPLETED');
INSERT INTO todo_list_petrov_vv.repetitions (id, name)
VALUES
    (1, 'ONCE'),
    (2, 'DAILY'),
    (3, 'EVERY_OTHER_DAY'),
    (4, 'WEEKLY'),
    (5, 'BIWEEKLY'),
    (6, 'MONTHLY'),
    (7, 'QUARTERLY');
INSERT INTO todo_list_petrov_vv.priorities (id, name)
VALUES
    (1, 'CRITICAL'),
    (2, 'URGENT'),
    (3, 'HIGH'),
    (4, 'MEDIUM'),
    (5, 'LOW');
