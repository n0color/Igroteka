import { useState } from 'react';
import footerStyle from '../Styles/footer.module.scss';

export default function Footer() {
  console.log('Footer component is rendering');
  const [emailToSubscription, setEmailToSubscription] = useState('');
 
  const handleSearch = (e) => {
   e.preventDefault();
   
   };
 
  return(
    <div className={footerStyle.footer}>
      <div className={footerStyle.Subscribe}>
        <span>
        ОСТАВЬТЕ СВОЮ ПОЧТУ ДЛЯ ПОЛУЧЕНИЯ
        АКТУАЛЬНЫХ СКИДОК 
        </span>
        <form onSubmit={handleSearch}>
          <input
              type="text" 
              value={emailToSubscription} 
              onChange={(e) => setEmailToSubscription(e.target.value)} 
              placeholder="Введите ваш email" 
            />
            <button type="sumbit">Подписаться</button>
        </form>
      </div>
      <div className={footerStyle.footerContent}>
        <h3>IGROTEKA</h3>
        <div className={footerStyle.footerContainer}>
          <div className={footerStyle.catalog}>
            <h4>Каталог товаров</h4>
            <a href="#">Ключи Steam</a>
            <a href="#">Ключи VkPlay</a>
            <a href="#">Лутбоксы</a>
          </div>
          <div className={footerStyle.catalog}>
            <h4>Покупателям</h4>
            <a href="#">Доставка и оплата</a>
            <a href="#">Рассрочка</a>
            <a href="#">Блог</a>
            <a href="#">Сотрудничество</a>
            <a href="#">Контакты</a>
            <a href="#">Акции</a>
          </div>
          <div className={footerStyle.catalog}>
            <h4>Контакты</h4>
            <span>Поддержка</span>
            <span>+7(499)000-00-00</span>
            <span>Пн-Вс 10:00 - 20:00</span>
          </div>
        </div>
      </div>
    </div>
  )
}