import { Button, Input, Form, Select } from 'antd'
import React from 'react'
const {Option} = Select;

export const NewTodoForm = ({handleCreateTodo}) => {
    return(
        <Form
            layout="vertical"
            onFinish={handleCreateTodo}
        >
            <Form.Item
            label="Todo"
            name="todo"
            rules={[{ required: true, message: 'Please input your todo title!' }]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            label="Todo Priority"
            name="priority"
            rules={[{ required: true, message: 'Please input priority!' }]}
            >
                <Select>
                    <Option value={3}>Low</Option>
                    <Option value={2}>Medium</Option>
                    <Option value={1}>High</Option>
                </Select>
            </Form.Item>

            <Form.Item >
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            </Form.Item>
        </Form>
    );
}

