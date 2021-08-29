import { RightSquareFilled , DeleteFilled} from '@ant-design/icons'
import styles from '../ToDoComponent.module.css';
import React from 'react'
import { getPriorityColor } from '../utils'


export const TodoItem = ({item, handleItemUpdate, handleDeleteItem}) => {
    
    return <div onClick={() => handleItemUpdate(item, !item.done)} className={styles.todoItemBox} style={item.done ? {textDecoration: 'line-through'} : {}}>
                <RightSquareFilled style={{color: getPriorityColor(item.priority), fontSize: '2rem'}}/>
                <span>{item.todo}</span>
                <DeleteFilled onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item._id);
                }} className={styles.deleteBtn}/>
           </div>
}