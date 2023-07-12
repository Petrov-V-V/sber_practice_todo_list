import './App.css';
import {Layout} from "antd";
import React, { useState } from 'react';
import {Route, Routes} from "react-router-dom";
import {MainPage} from "./pages/MainPage";
import {NotFoundPage} from "./pages/NotFoundPage";
import FooterBar from "./components/FooterBar";
import HeaderBar from "./components/HeaderBar";


function App() {
    return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderBar />
      <Routes>
          <Route index element={<MainPage/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
      <FooterBar />
    </Layout>
    );
}

export default App;

