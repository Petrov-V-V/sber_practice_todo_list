import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Layout, message, Modal, Input } from 'antd';
import {
  FolderOpenOutlined,
  UserOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import authService from "../services/authService";
import { login, logout } from "../slices/authSlice";


const { Sider } = Layout;
const { SubMenu } = Menu;

const LeftSider = () => {
  const [categories, setCategories] = useState(['Personal', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping', 'Work', 'Shopping']);
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
    });
  };


    return (
    <Sider width={200} theme='light' style={{ position: 'fixed', zIndex: 1, overflowY: 'auto'}} >
        <Menu 
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: 'calc(100vh - 64px)', borderRight: 0, fontWeight: 'bold' }}
        >
          {theMostCurrentUser !== null && (
            <Menu.Item key="1" icon={<UserOutlined />}>
              {theMostCurrentUser.username}
            </Menu.Item>
            )}
            {theMostCurrentUser !== null && (
            <Menu.Item key="2" icon={<FolderOpenOutlined />}>
              Мои задания
            </Menu.Item>
            )}
            {theMostCurrentUser !== null && (
            <SubMenu key="3" icon={<UnorderedListOutlined />} title='Категории'>
              <Menu.Item key="4" icon={<PlusCircleOutlined />}>Добавить</Menu.Item>
              {categories.map((category, index) => (
                <Menu.Item style={{ fontWeight: 'normal' }} key={index + 5}>{category}</Menu.Item>
              ))}
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
          placeholder="Email"
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
    