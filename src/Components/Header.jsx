
import { useState } from "react";
import logo from "../../public/logo.svg";
import { useNavigate } from 'react-router-dom';
import headerStyle from '../Styles/header.module.scss';

export default function Header({ currentRoute }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <header className={headerStyle.header}>
      <div>
        <span id={headerStyle.logo}>
          <img className={headerStyle.logo} src={logo} alt="Igroteka logo" />
          <span className={headerStyle.logoText}>IGROTEKA</span>
        </span>
        <button id={headerStyle.catalogBtn}>
          <img src="public/mini-line.svg" />
          Каталог</button>
        <form onSubmit={handleSearch} className={headerStyle.form}>
          <input   
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Искать игру мечты тут!" 
          />
          <button type="submit">Поиск</button>
        </form>
        <span>
          <img src="public/cart.svg" />
          <span>Корзина</span>
        </span>
      </div>
      <span>{currentRoute}</span>

    </header>
  )
}