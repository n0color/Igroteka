
import { useState } from "react";
import logo from "../../public/logo.svg";
import { Link, useNavigate } from 'react-router-dom';
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
      <div className={headerStyle.headerContainer}>
        <Link to={"/"} className={headerStyle.logoContainer}>
          <img className={headerStyle.logo} src={logo} alt="Igroteka logo" />
          <span className={headerStyle.logoText}>IGROTEKA</span>
        </Link>
        <Link className={headerStyle.catalogBtn} to={"/catalog"}>
          <img src="public/mini-line.svg" />
          Каталог</Link>
        <form onSubmit={handleSearch} className={headerStyle.form}>
          <input className={headerStyle.searchPanel}   
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Искать игру мечты тут!" 
          />
          <button type="submit" className={headerStyle.searchBtn}><img src="public/search.svg"/></button>
        </form>
        <Link className={headerStyle.storeBtn} to={"/store"}>
          <img src="public/cart.svg" />
          <span>Корзина</span>
        </Link>
      </div>
      <span>{currentRoute}</span>

    </header>
  )
}