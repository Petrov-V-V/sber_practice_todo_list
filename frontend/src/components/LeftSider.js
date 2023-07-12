import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Layout, message, Modal, Input, Popover, Button } from 'antd';
import {
  FolderOpenOutlined,
  UserOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  PlusCircleOutlined,
  CalendarOutlined,
  InboxOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import authService from "../services/authService";
import { login, logout } from "../slices/authSlice";
import taskService from '../services/taskService';
import { setTasks } from '../slices/taskSlice';
import categoryService from '../services/categoryService';
import { setCurrentCategory } from '../slices/categorySlice';


const { Sider } = Layout;
const { SubMenu } = Menu;

const LeftSider = () => {
  const categories = useSelector((state) => state.category.categories);
  const theMostCurrentUser = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const [switchUserModalVisible, setSwitchUserModalVisible] = useState(false);
  const [logInEmail, setLogInEmail] = useState('');
  const [logInPassword, setLogInPassword] = useState('');  
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');


  const handleAddUser = () => {
    const newUser = {
      username: registerUsername,
      email: registerEmail,
      password: registerPassword,
    };
    authService.register(newUser);
    setAddUserModalVisible(false);
    setRegisterEmail('');
    setRegisterUsername('');
    setRegisterPassword('');
  };

  const handleLogInOperation = (logInEmail, logInPassword) => {
    const newLoginInfo = {
      "username": logInEmail,
      "password": logInPassword
    }
    authService.login(newLoginInfo).then((user) => {
      console.log(user)
      dispatch(login(user))
      categoryService.getCategories(dispatch);
      taskService.getTasks(dispatch);
    },
    (error) => {
      message.error("Данные введены неверно");
        const _content = (error.response && error.response.data) ||
            error.message ||
            error.toString();

        console.error(_content)
    });
    };
  
  const handleClickLogIn = () => {
    handleLogInOperation(logInEmail, logInPassword);
    setSwitchUserModalVisible(false);
    setLogInEmail('');
    setLogInPassword('');
  };

  const handleLogout = () => {
    authService.logout().then(() => {
      dispatch(logout());
      dispatch(setTasks([]));
    });
  };
  

  const getTasksForUser = (id) => {
    taskService.getTasks(dispatch);
    dispatch(setCurrentCategory(''));
  };
  const getTasksFromCategory = (id) => {
    taskService.getTasksByCategory(dispatch, id);
    dispatch(setCurrentCategory(id));
  };
  const sortedCategories = categories
    .filter(category => category.name !== 'Архив')
    .sort((a, b) => a.id - b.id);


  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [open, setOpen] = useState(false);
  const hide = (e) => {
    e.stopPropagation();
    setOpen(false);
    const newCategory = {
      name: newCategoryName
    }
    categoryService.addCategory(dispatch, newCategory);
    setNewCategoryName('');
  };
  const openPopover = () => {
    setOpen(true);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const [editingCategory, setEditingCategory] = useState(null);

  const handleCategoryNameChange = (categoryId, newName) => {
    const oldCategory = categories.find(category => category.id === categoryId);
    if (oldCategory.name !== newName){
      const newCategory = {
        id: categoryId,
        name: newName
      };
      console.log(newCategory);
      categoryService.updateCategory(dispatch, newCategory);
    }
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const handleCategoryDelete = (categoryId) => {
    const newCategory = {
      id: categoryId
    };
    categoryService.deleteCategory(dispatch, newCategory);
    setEditingCategory(null);
  };

    return (
    <Sider width={200} theme='light' style={{ position: 'fixed', zIndex: 1, overflowY: 'auto'}} >
        <Menu 
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: 'calc(100vh - 64px)', borderRight: 0, fontWeight: 'bold' }}
        >
          {theMostCurrentUser !== null && (
            <Menu.Item key="1" icon={<UserOutlined />} onClick={() => getTasksForUser()}>
              {theMostCurrentUser.username}
            </Menu.Item>
            )}
            {theMostCurrentUser !== null && (
            <Menu.Item key="2" icon={<FolderOpenOutlined /> } onClick={() => getTasksForUser()}>
              Мои задания
            </Menu.Item>
            )}
            {theMostCurrentUser !== null && (
            <Menu.Item key="3" icon={<CalendarOutlined />}>
              Сегодня
            </Menu.Item>
            )}
            {theMostCurrentUser !== null && (
            <Menu.Item key="4" icon={<InboxOutlined />} onClick={() => getTasksFromCategory(categories.find(category => category.name === 'Архив').id)}>
              Архив
            </Menu.Item>
            )}
            {theMostCurrentUser !== null && (
            <SubMenu key="6" icon={<UnorderedListOutlined />} title='Категории'>
              <Menu.Item key="7" icon={<PlusCircleOutlined />} onClick={openPopover}>
                <Popover
                  open={open}
                  onOpenChange={handleOpenChange}
                  content={
                    <div 
                    style={{ display: 'flex' }}>
                      <Input
                        placeholder="Название категории"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onPressEnter={(e) => hide(e)}
                        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} 
                      />
                      <Button type="primary" onClick={(e) => hide(e)} 
                        style={{
                        backgroundColor: '#181A18', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, 
                        }}
                      >
                        Добавить
                      </Button>
                    </div>
                  }
                  trigger="click"
                  placement="left"
                >
                    Добавить
                  </Popover>
              </Menu.Item>
              {sortedCategories.map((category, index) => {
                if (category.name !== 'Архив') {
                  const isEditing = editingCategory === category.id;

                  return (
                    <Menu.Item  
                      style={{ fontWeight: 'normal' }}
                      key={index + 8}
                      onClick={() => getTasksFromCategory(category.id)}
                    >
                      {isEditing ? (
                        <div>
                        <Input
                          defaultValue={category.name}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          onPressEnter={(e) => handleCategoryNameChange(category.id, e.target.value)}
                          onBlur={(e) => {
                            if (!e.relatedTarget || !e.relatedTarget.classList.contains('delete-button')) {
                              handleCategoryNameChange(category.id, e.target.value);
                            }
                          }}
                          autoFocus
                          className="input-field"
                          style={{ maxWidth: 'calc(100% - 10px)' }}
                        />
                        <Button
                          type="text"
                          shape="circle"
                          icon={<DeleteOutlined />}
                          size="small"
                          onBlur={(e) => {
                            if (!e.relatedTarget || !e.relatedTarget.classList.contains('input-field')) {
                              handleCategoryNameChange();
                            }
                          }}
                          onClick={(e) => {
                            handleCategoryDelete(category.id);
                            e.stopPropagation();
                          }}
                          className="delete-button"
                          style={{ position: 'absolute', right: '0rem', top: '50%', transform: 'translateY(-50%)' }}
                        />
                      </div>
                      ) : (
                        <>
                        <div style={{ maxWidth: 'calc(100% - 10px)', display: 'inline-block', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {category.name}
                          </div>
                            <Button
                              type="text"
                              shape="circle"
                              icon={<EditOutlined />}
                              size="small"
                              onClick={(e) => {
                                setEditingCategory(category.id); 
                                e.stopPropagation()
                              }}
                              style={{ position: 'absolute', right: '0rem', top: '50%', transform: 'translateY(-50%)' }}
                            />
                        </>
                      )}
                    </Menu.Item>
                  );
                }
                return null;
              })}
            </SubMenu>
            )}
            {theMostCurrentUser !== null && (
            <Menu.Item key="logout" 
                onClick={() => handleLogout()}
                icon={<LogoutOutlined />}>
              Выйти
            </Menu.Item>
            )}
            {theMostCurrentUser === null && (
              <Menu.Item
                key="register"
                onClick={() => setAddUserModalVisible(true)}
                icon={<UserAddOutlined />}
              >
                Регистрация
              </Menu.Item>
            )}
            {theMostCurrentUser === null && (
              <Menu.Item
                key="login"
                onClick={() => setSwitchUserModalVisible(true)}
                icon={<LoginOutlined />}
              >
                Войти
              </Menu.Item>
            )}
        </Menu>
      <Modal
        title="Регистрация"
        visible={addUserModalVisible}
        onOk={handleAddUser}
        onCancel={() => setAddUserModalVisible(false)}
      >
        <Input
          style={{ marginTop: 10 }}
          placeholder="Email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
        <Input
          style={{ marginTop: 10 }}
          placeholder="Логин"
          value={registerUsername}
          onChange={(e) => setRegisterUsername(e.target.value)}
        />
        <Input.Password
          style={{ marginTop: 10 }}
          placeholder="Пароль"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
      </Modal>
      <Modal
        title="Вход"
        visible={switchUserModalVisible}
        onOk={handleClickLogIn}
        onCancel={() => setSwitchUserModalVisible(false)}
      >
        <Input
          style={{ marginTop: 10 }}
          placeholder="Логин"
          value={logInEmail}
          onChange={(e) => setLogInEmail(e.target.value)}
        />
        <Input.Password
          style={{ marginTop: 10 }}
          placeholder="Пароль"
          value={logInPassword}
          onChange={(e) => setLogInPassword(e.target.value)}
        />
      </Modal>
      </Sider>
        );
    };
    
    export default LeftSider;
    