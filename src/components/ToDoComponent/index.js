import { Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { createTodo, deleteTodo, editTodo, getTodos } from '../../services/todo';
import { NewTodoForm } from './components/NewTodoForm';
import { TodoItem } from './components/TodoItem';
import styles from './ToDoComponent.module.css';

export const ToDoComponent = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadTodos = async () => {
    setLoading(true);
    try{
      const res = await getTodos();
      console.log(res);
      setTodos(res);
    }catch(e){
      console.log(e);
    }finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    loadTodos();
  }, [])

  const handleItemUpdate = async (item, done) => {
    setLoading(true);
    try{
      const id = item._id;
      delete item._id;
      await editTodo({...item, done}, id);
      message.success('Successfully updated todo item!');
      loadTodos();
    }catch(e){
      console.log(e);
    }finally{
      setLoading(false);
    }
  }
  const handleDeleteItem = async (id) => {
    setLoading(true);
    try{
      await deleteTodo(id);
      message.success('Successfully deleted todo item!');
      loadTodos();
    }catch(e){
      console.log(e);
    }finally{
      setLoading(false);
    }
  }

  const handleCreateTodo = async (values) => {
    const dataObj = {...values, done: false};
    setLoading(true);
    try{
      await createTodo(dataObj);
      message.success('Successfully created todo item!');
      loadTodos();
    }catch(e){
      console.log(e);
    }finally{
      setLoading(false);
    }
  }

  return <Spin spinning={loading}>
    <div className={styles.todoContainer}>
      <div>
      {todos.map(item => 
        <TodoItem key={item._id} item={item} handleItemUpdate={handleItemUpdate} handleDeleteItem={handleDeleteItem}/>
      )}
      </div>
      <NewTodoForm handleCreateTodo={handleCreateTodo}/>
    </div>
  </Spin>
};
