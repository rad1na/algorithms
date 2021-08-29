import { callApi } from "./api";


export const getTodos = async () => {
    return await callApi({url: '/todos'});
}

export const createTodo = async (data) => {
    return await callApi({method: 'POST', url: '/todos', data});
}
export const editTodo = async (data, id) => {
    return await callApi({method: 'PUT', url: `/todos/${id}`, data});
}
export const deleteTodo = async (id) => {
    return await callApi({method: 'DELETE', url: `/todos/${id}`});
}