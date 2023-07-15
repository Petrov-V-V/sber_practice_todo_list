import axios from "axios";
import { setTasks, setStatuses, setRepetitions, setPriorities } from "../slices/taskSlice";
import { setCurrentCategory, setCategoryNotFromList } from '../slices/categorySlice';
import authHeader from "./authHeader";
import { notification } from "antd";
import { API_URL_STARTER } from "./API_URL";

const API_URL = API_URL_STARTER + "tasks";

export const getStatuses = (dispatch) => {
    return axios.get(`${API_URL}/statuses`,  {headers: authHeader()}).then(
        (response) => {
            dispatch(setStatuses(response.data));
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error(_content)
            dispatch(setStatuses([]));
        });
};

export const getRepetitions = (dispatch) => {
    return axios.get(`${API_URL}/repetitions`,  {headers: authHeader()}).then(
        (response) => {
            dispatch(setRepetitions(response.data));
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error(_content)
            dispatch(setRepetitions([]));
        });
};

export const getPriorities = (dispatch) => {
    return axios.get(`${API_URL}/priorities`,  {headers: authHeader()}).then(
        (response) => {
            dispatch(setPriorities(response.data));
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error(_content)
            dispatch(setPriorities([]));
        });
};

export const getTasks = (dispatch) => {
    return axios.get(`${API_URL}`,  {headers: authHeader()}).then(
        (response) => {
            dispatch(setTasks(response.data));
            dispatch(setCurrentCategory(''));
            dispatch(setCategoryNotFromList(1));
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error(_content)
            dispatch(setTasks([]));
        });
};

export const getTasksByCategory = (dispatch, id) => {
    return axios.get(`${API_URL}/categories?categoryId=${id}`,  {headers: authHeader()}).then(
        (response) => {
            dispatch(setTasks(response.data));
            dispatch(setCurrentCategory(id));
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error(_content)
            dispatch(setTasks([]));
        });
};
export const getTasksWithNotifications = () => {
    return axios.get(`${API_URL}/notifications`,  {headers: authHeader()}).then(
        (response) => {
            if(response.data){
                response.data.forEach(task=> notification.info({
                    message: task.categoryDTO.name,
                    description: `Задание "${task.title}" дожна быть выполнена до ${task.taskDate}`,
            }));
            }
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error(_content)
        });
};

setInterval(getTasksWithNotifications, 60000 );

export const getTodaysTasks = (dispatch) => {
    return axios.get(`${API_URL}/today`,  {headers: authHeader()}).then(
        (response) => {
            dispatch(setTasks(response.data));
            dispatch(setCurrentCategory(''));
            dispatch(setCategoryNotFromList(2));
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error(_content)
            dispatch(setTasks([]));
        });
};

export const addTask = (dispatch, task) => {
    return axios.post(`${API_URL}`, task,  {headers: authHeader()}).then(
        (response) => {
            getTasksByCategory(dispatch, task.category.id);
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();

            console.error(_content)
        });
};

const updateTask = (dispatch, task, index, indexFromOutside) => {
    console.log(task);
    return axios.put(`${API_URL}`, task,  {headers: authHeader()}).then(
        (response) => {
            if (index === ''){
                if (indexFromOutside === 1) {
                    getTasks(dispatch);
                } else if (indexFromOutside === 2) {
                    getTodaysTasks(dispatch);
                }
            } else {
                getTasksByCategory(dispatch, index);
            }
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();

            console.error(_content)
        });
};

const deleteTask = (dispatch, task, index, indexFromOutside) => {
    return axios.delete(`${API_URL}/${task.id}`,  {headers: authHeader()}).then(
        (response) => {
            if (index === ''){
                if (indexFromOutside === 1) {
                    getTasks(dispatch);
                } else if (indexFromOutside === 2) {
                    getTodaysTasks(dispatch);
                }
            } else {
                getTasksByCategory(dispatch, task.categoryDTO.id);
            }
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();

            console.error(_content)
        });
};

const taskService = {
    getStatuses, 
    getRepetitions, 
    getPriorities, 
    getTasks, 
    getTasksByCategory, 
    getTasksWithNotifications, 
    getTodaysTasks,
    addTask,
    updateTask,
    deleteTask,
};



export default taskService;