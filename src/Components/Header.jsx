import { useState } from "react";
import logo from "../../public/logo.svg";
import miniLine from "../../public/mini-line.svg";
import searchIcon from "../../public/search.svg";
import cartIcon from "../../public/cart.svg";
import { Link, useNavigate } from 'react-router-dom';
import headerStyle from '../Styles/header.module.scss';

export default function Header() {
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
          <img className={headerStyle.logo} src={logo} alt="Igroteka logo" loading="eager" />
          <span className={headerStyle.logoText}>IGROTEKA</span>
        </Link>
        <nav className={headerStyle.navigation}>
          <Link className={headerStyle.catalogBtn} to={"/catalog"}>
            <img src={miniLine} alt="Catalog icon" />
            <span>Каталог</span>
          </Link>
          <form onSubmit={handleSearch} className={headerStyle.form}>
            <input 
              className={headerStyle.searchPanel}   
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Искать игру мечты тут!" 
            />
            <button type="submit" className={headerStyle.searchBtn}>
              <img src={searchIcon} alt="Search icon" loading="lazy" />
            </button>
          </form>
          <Link className={headerStyle.storeBtn} to={"/store"}>
            <img src={cartIcon} alt="Cart icon" loading="lazy" />
            <span>Корзина</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}