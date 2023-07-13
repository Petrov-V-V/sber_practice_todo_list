import axios from "axios";
import { setCategories, setCurrentCategory, setCategoryNotFromList, setIsCategoryForDeleteEmpty } from "../slices/categorySlice";
import { setTasks, searchTasks } from "../slices/taskSlice";
import authHeader from "./authHeader";
import { API_URL_STARTER } from "./API_URL";
import { message } from "antd";
import taskService from '../services/taskService';

const API_URL = API_URL_STARTER + "categories";


export const getCategories = (dispatch) => {
    return axios.get(`${API_URL}`, {
        headers: authHeader(),
        withCredentials: true,
        }).then(
        (response) => {
            dispatch(setCategories(response.data));
        },
        (error) => {
            console.log(authHeader());
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error(_content)
            dispatch(setCategories([]));
        });
};

const isCategoryEmpty = (dispatch, id) => {
    return axios.get(`${API_URL}/${id}`, {headers: authHeader()}).then(
        (response) => {
            return response.data;
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();

            console.error(_content)
        });
};

export const addCategory = (dispatch, category) => {
    return axios.post(`${API_URL}`, category,  {headers: authHeader()}).then(
        (response) => {
            getCategories(dispatch);
        },
        (error) => {
            message.error('Введено неподходящее имя');
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();

            console.error(_content)
        });
};

const updateCategory = (dispatch, category) => {
    return axios.put(`${API_URL}`, category, {headers: authHeader()}).then(
        (response) => {
            getCategories(dispatch);
        },
        (error) => {
            message.error('Введено неподходящее имя');
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();

            console.error(_content)
        });
};

const deleteCategory = (dispatch, category, index) => {
    return axios.delete(`${API_URL}/${category.id}`, {headers: authHeader()}).then(
        (response) => {
            getCategories(dispatch);
            if (index === category.id){
                dispatch(setCurrentCategory(''));
                dispatch(setCategoryNotFromList(0));
            }
            message.success("Категория удалена");
        },
        (error) => {
            message.error('Категория не является пустой');
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();

            console.error(_content)
        });
};

const deleteCategoryAndTasks = (dispatch, category, index, categoryNotFromList) => {
    return axios.delete(`${API_URL}/with-tasks/${category.id}`, {headers: authHeader()}).then(
        (response) => {
            getCategories(dispatch);
            if (index === category.id){
                dispatch(setCurrentCategory(''));
                dispatch(setCategoryNotFromList(0));
                dispatch(setTasks([]));
            } else if (index == '' && categoryNotFromList === 1) {
                taskService.getTasks(dispatch);
            } else if (index == '' && categoryNotFromList === 2) {
                taskService.getTodaysTasks(dispatch);
            }
            message.success("Категория и содержимое удалены");
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();

            console.error(_content)
            message.error('Произошла неизвестная ошибка');
        });
};

const deleteCategoryAndArchiveTasks = (dispatch, category, index, categoryArchive, categoryNotFromList) => {
    return axios.delete(`${API_URL}/${category.id}/archiving-tasks/${categoryArchive.id}`, {headers: authHeader()}).then(
        (response) => {
            getCategories(dispatch);
            if (index === category.id){
                dispatch(setCurrentCategory(''));
                dispatch(setCategoryNotFromList(0));
                dispatch(setTasks([]));
            } else if (index === categoryArchive.id){
                taskService.getTasksByCategory(dispatch, categoryArchive.id);
            } else if (index == '' && categoryNotFromList === 1) {
                taskService.getTasks(dispatch);
            } else if (index == '' && categoryNotFromList === 2) {
                taskService.getTodaysTasks(dispatch);
            }
            message.success("Категория удалена, содержимое перенесено в архив");
        },
        (error) => {
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();

            console.error(_content)
            message.error('Произошла неизвестная ошибка');
        });
};

const categoryService = {
    getCategories,
    isCategoryEmpty,
    addCategory,
    updateCategory,
    deleteCategory,
    deleteCategoryAndTasks,
    deleteCategoryAndArchiveTasks,
};



export default categoryService;