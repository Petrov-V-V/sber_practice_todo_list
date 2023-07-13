import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Space, Input, Modal, message, Card, Checkbox  } from 'antd';
import '../App.css';
import categoryService from '../services/categoryService';
import taskService from '../services/taskService';
import { setCurrentCategory, setCategoryNotFromList } from '../slices/categorySlice';

import LeftSider from "../components/LeftSider";
import TaskList from "../components/TaskList";


const AppComponent = () => {
  const dispatch = useDispatch();
  const theMostCurrentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (theMostCurrentUser !== null){
      categoryService.getCategories(dispatch);
      taskService.getTasks(dispatch);
      taskService.getStatuses(dispatch);
      taskService.getRepetitions(dispatch);
      taskService.getPriorities(dispatch);
      dispatch(setCurrentCategory(''));
      dispatch(setCategoryNotFromList(1));

    }
  }, [theMostCurrentUser]);

  return (
      <Layout style={{ marginTop: 64}} >
        <TaskList />
        <LeftSider />
      </Layout>
  );
};

export default AppComponent;
