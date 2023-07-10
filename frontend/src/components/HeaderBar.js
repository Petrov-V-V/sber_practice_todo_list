import React, { useState, useRef } from 'react';
import { Row, Col, Input, Button, Layout, Card, AutoComplete, Modal, Select, message, Menu } from 'antd';
import LogoImage from "../img/LogoImageNew.png"



const { Header } = Layout;

const HeaderBar = () => {
  const [clickCount, setClickCount] = useState(1);
  const clickTimeoutRef = useRef(null);

  const handleEasterEgg = () => {
    if (clickCount === 0) {
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2000);
    }

    setClickCount((prevCount) => {
      clearTimeout(clickTimeoutRef.current);

      if (prevCount === 100) {
        message.error('Не удалось загрузить пасхалку');
        return 0;
      }

      if (prevCount === 10 ) {
        message.loading('Инициирована загрузка пасхалки, '+ clickCount + "%");
      }

      if (prevCount >= 20 && prevCount % 5 === 0 ) {
        message.loading('Пасхалка загружается, '+ clickCount + "%");
      }

      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2000);

      return prevCount + 1;
    });
  };

  return (
    <Header style={{ backgroundColor: '#181A18', color: "#fff", position: 'fixed', zIndex: 2,  width: '100%',  display: 'flex',  }}>
      <img src={LogoImage} alt="Daily Do Logo" style={{ height: 64, marginRight: 32, cursor: 'pointer' }} onClick={handleEasterEgg} />
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