import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Card, Checkbox, Button, Input, Select, Form , DatePicker, message} from 'antd';
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
  return current && current < dayjs().endOf('day');
};

const TaskList = () => {
  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.task.filteredTasks);
  const statuses = useSelector((state) => state.task.statuses);
  const repetitions = useSelector((state) => state.task.repetitions);
  const priorities = useSelector((state) => state.task.priorities);

  const sortedTasks = tasks.filter(task => (true)).sort((a, b) => a.id - b.id);

  const categories = useSelector((state) => state.category.categories);
  const theMostCurrentUser = useSelector((state) => state.auth.user);
  const theMostCurrentCategory = useSelector((state) => state.category.currentCategory);

  const [selectedTasks, setSelectedTasks] = useState([]);
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
  }, [theMostCurrentCategory]);

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
    taskService.updateTask(dispatch, newTaskToUpdate, theMostCurrentCategory);
    setEditingTask(-2);
  };

  const [selectedDate, setSelectedDate] = useState();
  const handleDateChange = (date) => {
    if (date){
      setEditedTask({
        id: editedTask.id,
        title: editedTask.title,
        description: editedTask.description,
        taskDate: date.format("YYYY-MM-DD HH:mm:ss"),
        status: editedTask.status,
        repetition: editedTask.repetition,
        priority: editedTask.priority,
        category: editedTask.category,
      });
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
  setNewTask({ ...newTask, taskDate: date.format("YYYY-MM-DD HH:mm:ss") });
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
  const tasksToDelete = selectedTasks.map((index) => sortedTasks[index]);
  setSelectedTasks([]);

  tasksToDelete.forEach((task) => {
    taskService.deleteTask(dispatch, task);
  });
  setSelectedTasks([]);
  message.success('Выделенные задания удалены');
};

  return (
    <Content style={{ marginLeft: 220, padding: '0 16px' }}>
      <div>
        {theMostCurrentUser !== null && (
          <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {theMostCurrentCategory !== '' && (
              categories.find(category => category.id === theMostCurrentCategory)?.name
            )}
            {theMostCurrentCategory !== '' && editingTask !== -1 && (
              <>
              {selectedTasks.length > 0 && (
                <Button type="primary" style={{ backgroundColor: '#C71F1F' }} onClick={handleDeleteSelected}>
                  Удалить выделенные
                </Button>
              )}
                <Button type="primary" style={{ backgroundColor: '#181A18' }} onClick={handleAddTask}>
                  Добавить задание
                </Button>
              </>
            )}
          </h1>
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

      {sortedTasks.map((task, index) => {
        let backgroundColor = 'white';
        let selectedColor = '#f0f0f0';

        if (task.status === 'ON_HOLD') {
          backgroundColor = 'lightcoral';
          selectedColor = '#D8B0B0';
        } else if (task.status === 'COMPLETED') {
          backgroundColor = 'lightgreen';
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
                  <h3 style={{ marginLeft: 16 }}>{task.title}</h3>
                ) : (
                  <h3 style={{ marginLeft: 16, marginTop: 0 }}>{task.title}</h3>
                )}
                <p style={{ marginLeft: 16, marginTop: -16, marginBottom: 0, fontSize: 12, color: 'gray' }}>
                {task.repetition === 'ONCE' && task.taskDate ? `До ${task.taskDate}` : task.taskDate ? `С ${task.taskDate}` : null}
              </p>
            </div>
            {theMostCurrentCategory === '' && (
              <p style={{ marginRight: 16, marginTop: 'auto', textAlign: 'right' }}>
                {task.categoryDTO.name}
              </p>
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