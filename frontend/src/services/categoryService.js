import axios from "axios";
import { setCategories } from "../slices/categorySlice";
import authHeader from "./authHeader";
import { API_URL_STARTER } from "./API_URL";
import { message } from "antd";

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

const deleteCategory = (dispatch, category) => {
    return axios.delete(`${API_URL}/${category.id}`, {headers: authHeader()}).then(
        (response) => {
            getCategories(dispatch);
        },
        (error) => {
            message.error('Категория не является пустой');
            const _content = (error.response && error.response.data) ||
                error.message ||
                error.toString();

            console.error(_content)
        });
};

const categoryService = {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory
};



export default categoryService;