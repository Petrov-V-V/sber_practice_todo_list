import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Space, Input, Modal, message, Card, Checkbox  } from 'antd';
import '../App.css';
import categoryService from '../services/categoryService';
import taskService from '../services/taskService';

import LeftSider from "../components/LeftSider";
import TaskList from "../components/TaskList";


const { Sider, Header, Footer, Content } = Layout;

const AppComponent = () => {
  const dispatch = useDispatch();
  const theMostCurrentUser = useSelector((state) => state.auth.user);

  //const tasks = useSelector((state) => state.task.tasks);
  //const categories = useSelector((state) => state.category.categories);

  useEffect(() => {
    categoryService.getCategories(dispatch);
    taskService.getTasks(dispatch);
  }, []);

  return (
      <Layout style={{ marginTop: 64}} >
        <TaskList />
        <LeftSider />
      </Layout>
  );
};

export default AppComponent;