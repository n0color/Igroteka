import { useState } from "react";
import logo from "../../public/logo.svg";
import miniLine from "../../public/mini-line.svg";
import searchIcon from "../../public/search.svg";
import cartIcon from "../../public/cart.svg";
import { Link, useNavigate } from 'react-router-dom';
import headerStyle from '../Styles/header.module.scss';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
  };

  const validatePasswords = () => {
    if (registerData.password !== registerData.confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return false;
    }
    if (registerData.password.length < 6) {
      setPasswordError('Пароль должен быть не менее 6 символов');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to authenticate
    console.log('Login attempt:', loginData);
    setShowLoginModal(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validatePasswords()) {
      return;
    }
    // Here you would typically make an API call to register
    console.log('Register attempt:', registerData);
    setShowRegisterModal(false);
  };

  const handlePasswordChange = (e) => {
    setRegisterData({...registerData, password: e.target.value});
    if (registerData.confirmPassword) {
      validatePasswords();
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setRegisterData({...registerData, confirmPassword: e.target.value});
    if (registerData.password) {
      validatePasswords();
    }
  };

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
    setPasswordError('');
    setRegisterData({ email: '', password: '', confirmPassword: '' });
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
    setLoginData({ email: '', password: '' });
  };

  return (
    <header className={headerStyle.header}>
      <div className={headerStyle.headerContainer}>
        <Link to={"/"} className={headerStyle.logoContainer}>
          <img className={headerStyle.logo} src={logo} alt="Igroteka logo" />
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
              <img src={searchIcon} alt="Search icon"/>
            </button>
          </form>
          <Link className={headerStyle.storeBtn} to={"/store"}>
            <img src={cartIcon} alt="Cart icon"/>
            <span>Корзина</span>
          </Link>
          <button 
            className={headerStyle.loginBtn}
            onClick={() => setShowLoginModal(true)}
          >
            Войти
          </button>
        </nav>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className={headerStyle.modalOverlay}>
          <div className={headerStyle.modal}>
            <h2>Вход</h2>
            <form onSubmit={handleLogin}>
              <div className={headerStyle.formGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>
              <div className={headerStyle.formGroup}>
                <label>Пароль:</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <div className={headerStyle.modalActions}>
                <button type="submit" className={headerStyle.submitBtn}>Войти</button>
                <button type="button" onClick={() => setShowLoginModal(false)} className={headerStyle.cancelBtn}>
                  Отмена
                </button>
              </div>
            </form>
            <p className={headerStyle.switchMode}>
              Нет аккаунта? <button onClick={switchToRegister}>Зарегистрироваться</button>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className={headerStyle.modalOverlay}>
          <div className={headerStyle.modal}>
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister}>
              <div className={headerStyle.formGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  required
                />
              </div>
              <div className={headerStyle.formGroup}>
                <label>Пароль:</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />
              </div>
              <div className={headerStyle.formGroup}>
                <label>Подтвердите пароль:</label>
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  minLength={6}
                />
                {passwordError && <span className={headerStyle.errorText}>{passwordError}</span>}
              </div>
              <div className={headerStyle.modalActions}>
                <button type="submit" className={headerStyle.submitBtn}>Зарегистрироваться</button>
                <button type="button" onClick={() => setShowRegisterModal(false)} className={headerStyle.cancelBtn}>
                  Отмена
                </button>
              </div>
            </form>
            <p className={headerStyle.switchMode}>
              Уже есть аккаунт? <button onClick={switchToLogin}>Войти</button>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}