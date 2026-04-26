import axios from 'axios';
import _ from 'lodash';
import config from './config';

let store;
export const injectStore = (_store) => {
    store = _store;
};

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true
});


instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const status = error.response?.status || 500;
        if (status === 401) {
            localStorage.removeItem('token');
            if (store) {
                store.dispatch({ type: 'PROCESS_LOGOUT' });
            }
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
export default instance;
