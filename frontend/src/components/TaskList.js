// import './App.css';
// import {Layout} from "antd";
// import {Content} from "antd/es/layout/layout";
// import React from "react";
// import {Route, Routes} from "react-router-dom";
// import {MainPage} from "./pages/MainPage";
// import {NotFoundPage} from "./pages/NotFoundPage";
// import NavBar from './components/NavBar';

// function App() {


//     return (
//       <div>
//         <Layout className="layout">
//         <NavBar />
//             <Content style={{padding: '0 50px'}}>
//                 <Routes>
//                     <Route index element={<MainPage/>}/>
//                     <Route path="*" element={<NotFoundPage/>}/>
//                 </Routes>
//             </Content>
//         </Layout>
//         </div>
//     );
// }

// export default App;

import React, { useState } from 'react';
import { Layout, Card, Checkbox, Button  } from 'antd';
import '../App.css';


const { Content } = Layout;

const TaskList = () => {
  
  const [tasks, setTasks] = useState([{id:1, title: "Позвонить", description: "Включить телефон, открыть контакты, выбрать нужный, нажать кнопку", time: "24-05-05", category: "Звонки"},{id:1, title: "Позвонить", description: "Включить телефон, открыть контакты, выбрать нужный, нажать кнопку", time: "24-05-05", category: "Звонки"},{id:1, title: "Позвонить", description: "Включить телефон, открыть контакты, выбрать нужный, нажать кнопку", time: "24-05-05", category: "Звонки"},{id:1, title: "Позвонить", description: "Включить телефон, открыть контакты, выбрать нужный, нажать кнопку", time: "24-05-05", category: "Звонки"},{id:1, title: "Позвонить", description: "Включить телефон, открыть контакты, выбрать нужный, нажать кнопку", time: "24-05-05", category: "Звонки"},{id:1, title: "Позвонить", description: "Включить телефон, открыть контакты, выбрать нужный, нажать кнопку", time: "24-05-05", category: "Звонки"},{id:1, title: "Позвонить", description: "Включить телефон, открыть контакты, выбрать нужный, нажать кнопку", time: "24-05-05", category: "Звонки"},{id:1, title: "Позвонить", description: "Включить телефон, открыть контакты, выбрать нужный, нажать кнопку", time: "24-05-05", category: "Звонки"},]);

  const handleCardClick = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].expanded = !updatedTasks[index].expanded;
    setTasks(updatedTasks);
  };

  const handleCheckboxChange = (e, index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].selected = e.target.checked;
    setTasks(updatedTasks);
  };

  return (
        <Content style={{ marginLeft: 220, padding: '0 16px' }}>
        <div >
          <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>Имя категории <Button type="primary" style={{ backgroundColor: '#181A18' }}>Добавить задание</Button></h1>
          
        </div>

        {tasks.map((task, index) => (
            <Card
              key={index}
              style={{
                cursor: 'pointer',
                marginBottom: 16,
                backgroundColor: task.selected ? '#f0f0f0' : 'white',
              }}
              onClick={() => handleCardClick(index)}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: -16,
                  marginBottom: -12,
                }}
              >
                <Checkbox
                  className="big-checkbox"
                  checked={task.selected}
                  onChange={(e) => handleCheckboxChange(e, index)}
                  onClick={(e) => e.stopPropagation()} 
                />
                <h3 style={{ marginLeft: 16, flex: 1 }}>{task.title}</h3>
              <p style={{ marginTop: 'auto', textAlign: 'right' }}>
                {task.category}
              </p>
              </div>
              {task.expanded && <p style={{marginBottom: -8,}}>{task.description}</p>}
            </Card>
        ))}
      
        </Content>
  );
};

export default TaskList;
