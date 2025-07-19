import { useState } from 'react';
import footerStyle from '../Styles/footer.module.scss';

export default function Footer() {
  const [emailToSubscription, setEmailToSubscription] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [subscriptionError, setSubscriptionError] = useState('');
 
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!emailToSubscription.trim()) {
      setSubscriptionError('Введите email для подписки');
      return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToSubscription)) {
      setSubscriptionError('Введите корректный email');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionError('');
    setSubscriptionMessage('');

    try {
      // Получаем CSRF токен безопасно
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      
      // Отправляем запрос на бэкенд для отправки письма
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
          email: emailToSubscription
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при отправке письма');
      }
      
      setSubscriptionMessage(`Письмо отправлено на ${emailToSubscription}!`);
      setEmailToSubscription('');
      
      // Очищаем сообщение через 5 секунд
      setTimeout(() => {
        setSubscriptionMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('Ошибка отправки письма:', error);
      setSubscriptionError('Ошибка при отправке письма. Попробуйте позже.');
    } finally {
      setIsSubscribing(false);
    }
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
              type="email" 
              value={emailToSubscription} 
              onChange={(e) => setEmailToSubscription(e.target.value)} 
              placeholder="Введите ваш email" 
              disabled={isSubscribing}
            />
            <button 
              type="submit" 
              disabled={isSubscribing}
            >
              {isSubscribing ? 'Отправка...' : 'Подписаться'}
            </button>
        </form>
        {subscriptionMessage && (
          <div className={footerStyle.successMessage}>
            {subscriptionMessage}
          </div>
        )}
        {subscriptionError && (
          <div className={footerStyle.errorMessage}>
            {subscriptionError}
          </div>
        )}
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
            <a href="/#1">Рассрочка</a>
            <a href="https://n0color.github.io/">Блог</a>
            <a href="https://github.com/n0color">Сотрудничество</a>
            <a href="https://github.com/n0color">Контакты</a>
            <a href="/catalog">Акции</a>
            <a href="http://127.0.0.1:8000/">Продавцам</a>
            
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