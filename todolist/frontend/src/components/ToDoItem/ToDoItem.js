import React from 'react';
import './ToDoItem.css';
import getDueDateClass from '../utils/dateUtils';
import { Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';

const ToDoItem = ({ task, onToggle, onDelete, onEdit }) => {
  const { className: dueDateClass, text: dueDateText } = getDueDateClass(task.dueDate);

  return (
    <div className='ToDoItem'>
      <input type='checkbox' checked={task.completed} onChange={() => onToggle(task.id)} />
      <div className={`content ${task.completed ? 'completed' : ''}`}>
        <p className='title'>{task.title}</p>
        <p className='description'>{task.description}</p>
        <p className={`due-date ${dueDateClass}`}><CalendarOutlined /> {dueDateText ? dueDateText : new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
      <button className='edit-btn' onClick={() => onEdit(task)}>
        <EditOutlined />
      </button>
      <Popconfirm
        title="Delete the task"
        description="Are you sure to delete this task?"
        okText="Yes" 
        onConfirm={() => onDelete(task.id)}
        cancelText="No"
      >
        <Button danger><DeleteOutlined /></Button>
      </Popconfirm>
    </div>
  );
};

export default ToDoItem;