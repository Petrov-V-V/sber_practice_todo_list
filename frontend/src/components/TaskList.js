import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Card, Checkbox, Button, Input, Select, Form , DatePicker, message, Empty, Row, Tag, Modal } from 'antd';
import '../App.css';
import {
  EditOutlined,
} from '@ant-design/icons';
import taskService from '../services/taskService';
import dayjs from 'dayjs';


const { TextArea } = Input;
const { Option } = Select;
const { Content } = Layout; 

const dateFormat = "YYYY-MM-DD HH:mm:ss";
const disabledDate = (current) => {
  const yesterday = dayjs().subtract(1, 'day').endOf('day');
  return current && current < yesterday;
};

const TaskList = () => {
  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.task.filteredTasks);
  const statuses = useSelector((state) => state.task.statuses);
  const repetitions = useSelector((state) => state.task.repetitions);
  const priorities = useSelector((state) => state.task.priorities);

  const sortType = useSelector((state) => state.task.sortType);
  const sortedTasks = tasks
    .filter((task) => true)
    .sort((a, b) => {
      if (sortType === 2) {
        const priorityOrder = {
          CRITICAL: 0,
          URGENT: 1,
          HIGH: 2,
          MEDIUM: 3,
          LOW: 4,
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortType === 3) {
        if (a.taskDate === null && b.taskDate === null) {
          return 0;
        } else if (a.taskDate === null) {
          return 1;
        } else if (b.taskDate === null) {
          return -1;
        } else {
          return new Date(a.taskDate) - new Date(b.taskDate);
        }
      } else if (sortType === 4) {
        const statusOrder = {
          IN_PROGRESS: 0,
          COMPLETED: 1,
          ON_HOLD: 2,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      }  else {
        return a.id - b.id;
      }
    });


  const categories = useSelector((state) => state.category.categories);
  const theMostCurrentUser = useSelector((state) => state.auth.user);
  const theMostCurrentCategory = useSelector((state) => state.category.currentCategory);
  const categoryFromTheOutside = useSelector((state) => state.category.categoryNotFromList);

  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(-2);
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
    taskDate: '',
    status: '',
    category: '',
    repetition: '',
    priority: '',
  });


  useEffect(() => {
    setSelectedTasks([]);
    setExpandedTasks([]);
    setEditingTask(null);
  }, [theMostCurrentCategory, sortType]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'magenta';
      case 'URGENT':
        return 'volcano';
      case 'HIGH':
        return 'orange';
      case 'MEDIUM':
        return 'blue';
      case 'LOW':
        return 'cyan';
      default:
        return undefined;
    }
  };

  const handleCardClick = (index) => {
    setExpandedTasks((prevExpandedTasks) => {
      if (prevExpandedTasks.includes(index)) {
        return prevExpandedTasks.filter((taskIndex) => taskIndex !== index);
      } else {
        return [...prevExpandedTasks, index];
      }
    });
  }

  const handleCheckboxChange = (event, index) => {
    event.stopPropagation();
    setSelectedTasks((prevSelectedTasks) => {
      if (prevSelectedTasks.includes(index)) {
        return prevSelectedTasks.filter((taskIndex) => taskIndex !== index);
      } else {
        return [...prevSelectedTasks, index];
      }
    });
  };

  const handleEditTask = (index) => {
    const task = sortedTasks[index];
    setEditingTask(index);
    setEditedTask({
      id: task.id,
      title: task.title,
      description: task.description,
      taskDate: task.taskDate,
      status: task.status,
      repetition: task.repetition,
      priority: task.priority,
      category: task.categoryDTO.id,
    });
    if (expandedTasks.includes(index)) {
      setExpandedTasks(expandedTasks.filter((taskIndex) => taskIndex !== index));
    }
  };

  const handleSaveTask = () => {
    const newTaskToUpdate = {
      id: editedTask.id,
      title: editedTask.title,
      description: editedTask.description,
      taskDate: editedTask.taskDate,
      category: { 
        id: editedTask.category,
      },
      status:  
        statuses.filter(status => status.name === editedTask.status)[0]
      ,
      repetition:  
        repetitions.filter(repetition => repetition.name === editedTask.repetition)[0]
    ,
      priority:  
        priorities.filter(priority => priority.name === editedTask.priority)[0]
    ,
    }
    console.log(theMostCurrentCategory);
    taskService.updateTask(dispatch, newTaskToUpdate, theMostCurrentCategory, categoryFromTheOutside);
    setEditingTask(-2);
  };

  const handleDateChange = (date) => {
    if (date){
      setEditedTask({ ...editedTask, taskDate: date.format("YYYY-MM-DD HH:mm:ss") });
    } else {
      setEditedTask({ ...editedTask, taskDate: null });
    }
};

const [newTask, setNewTask] = useState({
  id: 0,
  title: '',
  description: '',
  taskDate: null,
  repetition: '',
  priority: '',
  category: '',
});

const handleAddTask = () => {
  setNewTask({
    id: 0,
    title: '',
    description: '',
    taskDate: null,
    repetition: 'ONCE',
    priority: 'MEDIUM',
    category: '',
});
  setEditingTask(-1);
};

const handleNewDateChange = (date) => {
  if (date){
    setNewTask({ ...newTask, taskDate: date.format("YYYY-MM-DD HH:mm:ss") });
  } else {
    setNewTask({ ...newTask, taskDate: null });
  }
};

const handleSaveNewTask = () => {
  const newTaskToPost = {
    title: newTask.title,
    description: newTask.description,
    taskDate: newTask.taskDate,
    status:  {
        id: 1
    },
      repetition:  
        repetitions.filter(repetition => repetition.name === newTask.repetition)[0]
    ,
      priority:  
        priorities.filter(priority => priority.name === newTask.priority)[0]
    ,
    category: {
      id: theMostCurrentCategory
    },
  }
  taskService.addTask(dispatch, newTaskToPost);
  setEditingTask(-2);
};

const handleDeleteSelected = () => {
  if (selectedTasks.length > 0) {
    Modal.confirm({
      title: 'Подтверждение удаления',
      content: 'Вы уверены, что хотите удалить выбранные задания?',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => {
      selectedTasks.forEach((index) => {
        const task = sortedTasks[index];
        taskService.deleteTask(dispatch, task, theMostCurrentCategory, categoryFromTheOutside);
      });
      setSelectedTasks([]);
      message.success('Выделенные задания удалены');
      },
    });
  }
};

const handleMoveSelectedToArchive = () => {
  selectedTasks.forEach((index) => {
    const task = sortedTasks[index];
    const updatedTask = {
      ...task,
      category: categories.find((category) => category.name === 'Архив'),
      status: statuses.filter((status) => status.name === task.status)[0],
      repetition: repetitions.filter((repetition) => repetition.name === task.repetition)[0],
      priority: priorities.filter((priority) => priority.name === task.priority)[0],
    };
    taskService.updateTask(dispatch, updatedTask, theMostCurrentCategory, categoryFromTheOutside);
  });
  setSelectedTasks([]);
};

const handleMarkSelectedAsCompleted = () => {
  selectedTasks.forEach((index) => {
    const task = sortedTasks[index];
    const updatedTask = { ...task, status: {
      id: 3
    } ,
    repetition:  
      repetitions.filter(repetition => repetition.name === task.repetition)[0]
    ,
    priority:  
      priorities.filter(priority => priority.name === task.priority)[0]
    ,
    category: task.categoryDTO,
  };
    taskService.updateTask(dispatch, updatedTask, theMostCurrentCategory, categoryFromTheOutside);
  });
  setSelectedTasks([]);
};

const handleMarkSelectedAsOnHold = () => {
  selectedTasks.forEach((index) => {
    const task = sortedTasks[index];
    const updatedTask = { ...task, status: {
      id: 2
    },
    repetition:  
      repetitions.filter(repetition => repetition.name === task.repetition)[0]
    ,
    priority:  
      priorities.filter(priority => priority.name === task.priority)[0]
    ,
    category: task.categoryDTO,
  };
    taskService.updateTask(dispatch, updatedTask, theMostCurrentCategory, categoryFromTheOutside);
  });
  setSelectedTasks([]);
};

const handleMoveSelected = (categoryId) => {
  selectedTasks.forEach((index) => {
    const task = sortedTasks[index];
    const updatedTask = {
      ...task,
      category: categories.find((category) => category.id === categoryId),
      status: statuses.filter((status) => status.name === task.status)[0],
      repetition: repetitions.filter((repetition) => repetition.name === task.repetition)[0],
      priority: priorities.filter((priority) => priority.name === task.priority)[0],
    };
    taskService.updateTask(dispatch, updatedTask, theMostCurrentCategory, categoryFromTheOutside);
  });
  setSelectedTasks([]);
};

const handleSelectAll = () => {
  if (selectedTasks.length === 0) {
    setSelectedTasks(sortedTasks.map((_, index) => index));
    setSelectAll(true);
  }
};

const handleDeselectAll = () => {
  setSelectedTasks([]);
  setSelectAll(false);
};


  return (
    <Content style={{ marginLeft: 220, padding: '0 16px' }}>
      <div>
        {theMostCurrentUser !== null ? (
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ marginBottom: 16, marginTop: 16}}>
            {theMostCurrentCategory !== '' ? (
              categories.find(category => category.id === theMostCurrentCategory)?.name.trim() !== ''
                ? categories.find(category => category.id === theMostCurrentCategory)?.name
                : '\u2001'
            ) : ('\u2001')}
            </h1>
            
            <Row>
              {selectedTasks.length > 0 && (
                <>
                  <Button danger style={{ borderColor: "#015738", color: '#015738', backgroundColor: '#FFF', marginRight: 8, marginBottom: 12, marginTop: 12  }} onClick={handleMarkSelectedAsCompleted}>
                    Выполнить
                  </Button>
                  <Button danger style={{  borderColor: "#8B8000", color: '#8B8000', backgroundColor: '#FFF', marginRight: 8, marginBottom: 12, marginTop: 12  }} onClick={handleMarkSelectedAsOnHold}>
                    Отложить
                  </Button>
                  <Button danger type="primary" style={{ borderColor: "#C71F1F", color: '#C71F1F', backgroundColor: '#FFF', marginRight: 8, marginBottom: 12, marginTop: 12  }} onClick={handleDeleteSelected}>
                    Удалить
                  </Button>
                  <div>
                      <Select
                        defaultValue="Перенести в"
                        style={{ marginRight: 8, marginBottom: 12, marginTop: 12  }}
                        onChange={(categoryId) => handleMoveSelected(categoryId)}
                      >
                        {categories
                          .filter((category) => category.id !== theMostCurrentCategory)
                          .filter((category) => category.name !== 'Архив')
                          .map((category) => (
                            <Option key={category.id} value={category.id}>
                              {category.name !== '' ? (category.name) : ('\u2001')}
                            </Option>
                          ))}
                      </Select>
                    </div>
                  {theMostCurrentCategory !== categories.find((category) => category.name === 'Архив').id && (
                    <Button type="primary" style={{ backgroundColor: '#181A18', marginRight: 8, marginBottom: 12, marginTop: 12  }} onClick={handleMoveSelectedToArchive}>
                      Перенести в архив
                    </Button>  
                  )}
                  </>
              )}
              {selectedTasks.length > 0 && (
                <Button
                  type="primary"
                  style={{ width: 140, backgroundColor: '#181A18', marginRight: 8, marginBottom: 12, marginTop: 12  }}
                  onClick={handleDeselectAll}
                >
                  Снять выделение
                </Button>
              )}
              {selectedTasks.length === 0 && sortedTasks.length !== 0 && (
                <Button type="primary" style={{ width: 140, backgroundColor: '#181A18', marginRight: 8, marginBottom: 12, marginTop: 12 }} onClick={handleSelectAll}>
                  Выделить всё
                </Button>
              )}
              {theMostCurrentCategory !== '' && editingTask !== -1 && (
                <Button type="primary" style={{ backgroundColor: '#181A18', marginBottom: 12, marginTop: 12  }} onClick={handleAddTask}>
                  Новое задание
                </Button>
              )}
            </Row>
            
          </Row>
        ) : (
          <h1>{'\u2001'}</h1>
          )}
      </div>

      {editingTask === -1 && (
        <Card
          style={{ marginBottom: 16 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '8px' }}>
              <label style={{ width: '100px', marginRight: '8px' }}>Название</label>
              <Input
                style={{ marginLeft: '4px' }}
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', marginBottom: '8px' }}>
              <label style={{ width: '100px', marginRight: '8px' }}>Описание</label>
              <Input.TextArea
                style={{ marginLeft: '4px' }}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', marginBottom: '8px' }}>
              <label style={{ width: '100px', marginRight: '8px' }}>Дата</label>
              <DatePicker
                format={dateFormat}
                disabledDate={disabledDate}
                onChange={handleNewDateChange}
                showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
              />
            </div>
            <div style={{ display: 'flex', marginBottom: '8px' }}>
              <label style={{ width: '100px', marginRight: '8px' }}>Повторение</label>
              <Select
                style={{ width: '165px' }}
                value={newTask.repetition}
                onChange={(value) => setNewTask({ ...newTask, repetition: value })}
              >
                {repetitions.map((repetition) => (
                  <option key={repetition.name} value={repetition.name}>
                    {repetition.name}
                  </option>
                ))}
              </Select>
            </div>
            <div style={{ display: 'flex', marginBottom: '8px' }}>
              <label style={{ width: '100px', marginRight: '8px' }}>Приоритет</label>
              <Select
                style={{ width: '165px' }}
                value={newTask.priority}
                onChange={(value) => setNewTask({ ...newTask, priority: value })}
              >
                {priorities.map((priority) => (
                  <option key={priority.name} value={priority.name}>
                    {priority.name}
                  </option>
                ))}
              </Select>
            </div>
            <div  style={{ marginTop: '8px', marginBottom: '8px' }}></div>
            <Button
              style={{
                position: 'absolute',
                bottom: 8,
                left: '40%',
                transform: 'translateX(-50%)',
                borderColor: 'black'
              }}
              onClick={() => setEditingTask(-2)}
            >
              Отмена
            </Button>
            <Button
              type="primary"
              style={{
                position: 'absolute',
                bottom: 8,
                left: '60%',
                transform: 'translateX(-50%)',
                backgroundColor: 'black',
                borderColor: 'black'
              }}
              onClick={handleSaveNewTask}
            >
              Сохранить
            </Button>
            
          </div>
        </Card>
      )}

      {sortedTasks.length === 0 && (
        <div style={{ textAlign: 'center' }}>
          <Empty
            description={<span>Здесь пусто</span>}
          />
        </div>
      )}

      {sortedTasks.map((task, index) => {
        let backgroundColor = 'white';
        let selectedColor = '#f0f0f0';

        if (task.status === 'ON_HOLD') {
          backgroundColor = '#FFF9A6';
          selectedColor = '#e8e5b7';
        } else if (task.status === 'COMPLETED') {
          backgroundColor = '#abedab';
          selectedColor = '#C2DCC1';
        }

        return (
          <Card
            key={index}
            style={{
              cursor: editingTask === index ? 'default' : 'pointer',
              marginBottom: 16,
              backgroundColor: selectedTasks.includes(index) ? selectedColor : backgroundColor,
            }}
            onClick={editingTask === index ? undefined : () => handleCardClick(index)}
          >
          {editingTask === index ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '8px' }}>
              <label style={{ width: '100px', marginRight: '8px' }}>Название</label>
              <Input
                style={{ marginLeft: '4px' }}
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', marginBottom: '8px' }}>
              <label style={{ width: '100px', marginRight: '8px' }}>Описание</label>
              <Input.TextArea
                style={{ marginLeft: '4px' }}
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', marginBottom: '8px' }}>
              <label style={{ width: '100px', marginRight: '8px' }}>Дата</label>
              {editedTask.taskDate ? (
                <DatePicker
                  format={dateFormat}
                  defaultValue={dayjs(editedTask.taskDate, dateFormat)}
                  disabledDate={disabledDate}
                  onChange={handleDateChange}
                  showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                />
              ) : (
                <DatePicker
                  format={dateFormat}
                  disabledDate={disabledDate}
                  onChange={handleDateChange}
                  showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                />
              )}
            </div>
              
            <div style={{ display: 'flex', marginBottom: '8px' }}>
              <label style={{ width: '100px', marginRight: '8px' }}>Статус</label>
              <Select
                style={{ width: '165px' }}
                value={editedTask.status}
                onChange={(value) => setEditedTask({ ...editedTask, status: value })}
              >
                {statuses.map((status) => (
                  <option key={status.name} value={status.name}>
                    {status.name}
                  </option>
                ))}
              </Select>
            </div>

            <div style={{ display: 'flex', marginBottom: '8px' }}>
              <label style={{ width: '100px', marginRight: '8px' }}>Повторение</label>
              <Select
                style={{ width: '165px' }}
                value={editedTask.repetition}
                onChange={(value) => setEditedTask({ ...editedTask, repetition: value })}
              >
                {repetitions.map((repetition) => (
                  <option key={repetition.name} value={repetition.name}>
                    {repetition.name}
                  </option>
                ))}
              </Select>
            </div>

            <div style={{ display: 'flex', marginBottom: '8px' }}>
              <label style={{ width: '100px', marginRight: '8px' }}>Приоритет</label>
              <Select
                style={{ width: '165px' }}
                value={editedTask.priority}
                onChange={(value) => setEditedTask({ ...editedTask, priority: value })}
              >
                {priorities.map((priority) => (
                  <option key={priority.name} value={priority.name}>
                    {priority.name}
                  </option>
                ))}
              </Select>
            </div>
            <div  style={{ marginTop: '8px', marginBottom: '8px' }}></div>
            <Button
              style={{
                position: 'absolute',
                bottom: 8,
                left: '40%',
                transform: 'translateX(-50%)',
                borderColor: 'black',
              }}
              onClick={() => setEditingTask(-2)}
            >
              Отмена
            </Button>
              <Button
                type="primary"
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: '60%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'black',
                  borderColor: 'black',
                }}
                onClick={() => handleSaveTask()}
              >
                Сохранить
              </Button>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: -16,
                marginBottom: -12,
              }}
            >
              <Checkbox
                className="big-checkbox"
                checked={selectedTasks.includes(index)}
                onChange={(e) => handleCheckboxChange(e, index)}
                onClick={(e) => e.stopPropagation()}
              />
              <div style={{ flex: 1 }}>
                {task.taskDate ? (
                  <h3 style={{ marginLeft: 16 }}>
                    {task.title}
                    <Tag style={{ marginLeft: 8 }} color={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Tag>
                  </h3>
                ) : (
                  <h3 style={{ marginLeft: 16, marginTop: 0 }}>
                    {task.title}
                    <Tag style={{ marginLeft: 8 }} color={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Tag>
                  </h3>
                )}
                <p style={{ marginLeft: 16, marginTop: -16, marginBottom: 0, fontSize: 12 }}>
                {task.repetition && task.taskDate ? (
                  <span style={{ color: task.status === 'IN_PROGRESS' && task.repetition === 'ONCE' && dayjs(task.taskDate, dateFormat) < dayjs().endOf('day') ? 'red' : 'gray' }}>
                    {task.taskDate}
                    {task.repetition === 'DAILY' && ' и через день'}
                    {task.repetition === 'EVERY_OTHER_DAY' && ' и через 2 дня'}
                    {task.repetition === 'WEEKLY' && ' и через неделю'}
                    {task.repetition === 'BIWEEKLY' && ' и через 2 недели'}
                    {task.repetition === 'MONTHLY' && ' и через месяц'}
                    {task.repetition === 'QUARTERLY ' && ' и через 3 месяца'}
                  </span> 
                ) : null}

              </p>
            </div>
            {theMostCurrentCategory === '' && (
              task.taskDate ? (
                <p style={{ marginRight: 16, marginTop: 'auto', textAlign: 'right' }}>
                  {task.categoryDTO.name}
                </p>
              ) : (
                <p style={{ marginRight: 16, textAlign: 'right' }}>
                  {task.categoryDTO.name}
                </p>
              )
            )}
              <Button onClick={(e) => {
                handleEditTask(index);
                e.stopPropagation();
              }} icon={<EditOutlined />} />
            </div>
          )}

          {expandedTasks.includes(index) && <p style={{ marginBottom: -8, marginTop: 20 }}>{task.description}</p>}
        </Card>
        );
      })}
    </Content>
  );
};

export default TaskList;