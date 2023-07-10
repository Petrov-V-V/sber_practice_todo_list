import React from 'react';
import { Row, Col, Input, Button, Layout, Card, AutoComplete, Modal, Select, message, Menu } from 'antd';
import LogoImage from "../img/LogoImageNew.png"



const { Header } = Layout;

const HeaderBar = () => {

  return (
    <Header style={{ backgroundColor: '#181A18', color: "#fff", position: 'fixed', zIndex: 2,  width: '100%',  display: 'flex',  }}>
      <img src={LogoImage} alt="Daily Do Logo" style={{ height: 64, marginRight: 32 }} />
      <Input.Search
            placeholder="Поиск заданий"
            // value={searchQuery}
            // onSelect={handleSearchQueryChange}
            // onChange={handleSearchQueryChange}
            style={{ width: 290, marginTop: 16, marginLeft: 16 }}
          />
    </Header>
      
  );
}

export default HeaderBar;