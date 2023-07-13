import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Layout, Select, message } from 'antd';
import LogoImage from "../img/LogoImageNew.png"
import {  searchTasks, setSortType  } from '../slices/taskSlice';

const { Header } = Layout;
const { Option } = Select;

const HeaderBar =  ( {handleRotatePage} ) => {
  const [rotatePage, setRotatePage] = useState(false);
  const [clickCount, setClickCount] = useState(1);
  const clickTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  
  const theMostCurrentUser = useSelector((state) => state.auth.user);
  const theMostCurrentCategory = useSelector((state) => state.category.currentCategory);
  const searchQuery = useSelector((state) => state.task.searchQuery);

  const handleEasterEgg = () => {
    if (clickCount === 0) {
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2000);
    }

    setClickCount((prevCount) => {
      clearTimeout(clickTimeoutRef.current);

      if (prevCount === 50) {
        message.info('Что-то произошло')
        handleRotatePage();
        setRotatePage(!rotatePage);
        return 0;
      }

      if (prevCount === 10 ) {
        message.loading('Инициирована загрузка пасхалки, '+ clickCount * 2 + "%");
      }

      if (prevCount >= 15 && prevCount % 5 === 0 ) {
        message.loading('Пасхалка загружается, '+ clickCount * 2 + "%");
      }

      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2000);

      return prevCount + 1;
    });
  };
  
  const handleSearchQueryChange = (e) => {
    dispatch(searchTasks(e.target.value));
  };

  function handleSortTypeChange(value) {
    switch (value) {
      case 'Без сортировки':
        dispatch(setSortType(1));
        break;
      case 'По приоритету':
        dispatch(setSortType(2));
        break;
      case 'По дате':
        dispatch(setSortType(3));
        break;
      case 'По статусу':
        dispatch(setSortType(4));
        break;
      default:
        break;
    }
  }

  return (
    <Header style={{ backgroundColor: '#181A18', color: "#fff", position: 'fixed', zIndex: 2,  width: '100%',  display: 'flex',  }}>
      <img src={LogoImage} alt="Daily Do Logo" style={{ height: 64, marginRight: 32, cursor: 'pointer', transform: rotatePage ? 'rotate(180deg)' : 'none' }} onClick={handleEasterEgg} />
      {theMostCurrentUser !== null && (
        <div style={{  display: 'flex' }}>
        <Select defaultValue="Сортировать по" style={{ position: 'absolute', width: 160, marginTop: 16, marginLeft: 20 }} onChange={handleSortTypeChange}>
          <Option value="Без сортировки">Без сортировки</Option>
          <Option value="По приоритету">По приоритету</Option>
          <Option value="По дате">По дате</Option>
          <Option value="По статусу">По статусу</Option>
        </Select>
          <Input.Search
            placeholder="Поиск заданий"
            value={searchQuery}
            onSelect={handleSearchQueryChange}
            onChange={handleSearchQueryChange}
            style={{ position: 'absolute', right: 16, width: 290, marginTop: 16, marginLeft: 16 }}
          />
        </div>
          )}
    </Header>
      
  );
}

export default HeaderBar;