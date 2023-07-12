import axios from "axios";
import { setTasks, setStatuses, setRepetitions, setPriorities } from "../slices/taskSlice";
import authHeader from "./authHeader";
import { message } from "antd";
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
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error(_content)
            dispatch(setTasks([]));
        });
};

export const getTasksWithNotifications = (dispatch) => {
    return axios.get(`${API_URL}/notifications`,  {headers: authHeader()}).then(
        (response) => {
            dispatch(setTasks(response.data));
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

const updateTask = (dispatch, task, index) => {
    return axios.put(`${API_URL}`, task,  {headers: authHeader()}).then(
        (response) => {
            console.log(index)
            if (index === ''){
                getTasks(dispatch);
            } else {
                getTasksByCategory(dispatch, task.category.id);
            }
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();

            console.error(_content)
        });
};

const deleteTask = (dispatch, task) => {
    return axios.delete(`${API_URL}/${task.id}`,  {headers: authHeader()}).then(
        (response) => {
            getTasksByCategory(dispatch, task.categoryDTO.id);
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
    addTask,
    updateTask,
    deleteTask
};



export default taskService;