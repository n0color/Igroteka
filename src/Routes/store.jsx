import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ProductCardContainer from "../Components/ProductCardContainer";
import { useState, useEffect } from "react";
import styles from "../Styles/store.module.scss";
import { Link } from "react-router-dom";

export default function Store() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Ошибка при загрузке корзины из localStorage:', error);
      return [];
    }
  });
  const [cartProducts, setCartProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояние для модального окна оформления заказа
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    email: '',
    paymentCompleted: false
  });
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Функция для удаления товара из корзины
  const removeFromCart = (productId) => {
    try {
      const savedCart = localStorage.getItem('cart');
      let cartItems = savedCart ? JSON.parse(savedCart) : [];
      
      // Преобразуем ID в строку для сравнения
      cartItems = cartItems.filter(item => String(item.id) !== String(productId));
      
      // Обновляем localStorage
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      // Обновляем состояние
      setCartItems(cartItems);
      
      // Вызываем событие storage для обновления других компонентов
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(cartItems),
        oldValue: savedCart,
        storageArea: localStorage
      }));
    } catch (error) {
      console.error('Ошибка при удалении товара из корзины:', error);
    }
  };

  // Функция для добавления товара в корзину
  const addToCart = (productId) => {
    try {
      const updatedCart = [...cartItems, { id: productId }];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину:', error);
    }
  };

  // Функции для оформления заказа
  const handleCheckout = () => {
    setShowCheckoutModal(true);
    setCheckoutError(null);
  };

  const handleCheckoutFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCheckoutForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsCheckoutSubmitting(true);
    setCheckoutError(null);

    try {
      // Проверяем, что оплата прошла (dev режим)
      if (!checkoutForm.paymentCompleted) {
        throw new Error('Необходимо подтвердить оплату');
      }

      // Здесь можно добавить API запрос для обработки заказа
      // Пока просто симулируем успешную отправку
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
      
      // Очищаем корзину после успешного заказа
      localStorage.setItem('cart', JSON.stringify([]));
      setCartItems([]);
      setCartProducts([]);
      
      // Вызываем событие storage для обновления других компонентов
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify([]),
        oldValue: JSON.stringify(cartItems),
        storageArea: localStorage
      }));
      
      setCheckoutForm({
        email: '',
        paymentCompleted: false
      });
    } catch (err) {
      setCheckoutError(err.message);
    } finally {
      setIsCheckoutSubmitting(false);
    }
  };

  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
    setCheckoutForm({
      email: '',
      paymentCompleted: false
    });
    setCheckoutError(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // Получение данных товаров из API
  useEffect(() => {
    const fetchCartProducts = async () => {
      if (cartItems.length === 0) {
        setCartProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const productsPromises = cartItems.map(item => 
          fetch(`http://127.0.0.1:8000/api/products/${item.id}`)
            .then(res => {
              if (!res.ok) {
                throw new Error(`Ошибка при загрузке товара ${item.id}`);
              }
              return res.json();
            })
            .then(data => data.data)
            .catch(error => {
              console.error(`Ошибка при загрузке товара ${item.id}:`, error);
              return null;
            })
        );

        const products = (await Promise.all(productsPromises)).filter(Boolean);
        
        // Если какие-то товары не удалось загрузить, обновляем корзину
        if (products.length !== cartItems.length) {
          const validProductIds = products.map(p => String(p.id));
          const updatedCartItems = cartItems.filter(item => 
            validProductIds.includes(String(item.id))
          );
          localStorage.setItem('cart', JSON.stringify(updatedCartItems));
          setCartItems(updatedCartItems);
        }
        
        setCartProducts(products);
      } catch (err) {
        setError('Ошибка при загрузке товаров');
        console.error('Ошибка при загрузке товаров:', err);
      } finally {
        setLoading(false);
      }
    };

    // Подписываемся на изменения в localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        try {
          const newCart = e.newValue ? JSON.parse(e.newValue) : [];
          setCartItems(newCart);
        } catch (error) {
          console.error('Ошибка при обновлении корзины:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    fetchCartProducts();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [cartItems]); // Добавляем cartItems в зависимости, чтобы эффект перезапускался при изменении корзины

  // Получение популярных товаров
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/products/random/4');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке популярных товаров');
        }
        const data = await response.json();
        setPopularProducts(data.data);
      } catch (err) {
        console.error('Ошибка при загрузке популярных товаров:', err);
      }
    };

    fetchPopularProducts();
  }, []);

  const calculateTotals = () => {
    if (loading || !cartProducts.length) {
      return { itemsTotal: 0, discount: 0, total: 0 };
    }

    const itemsTotal = cartProducts.reduce((sum, item) => 
      sum + parseFloat(item.price), 0);
    
    const discount = cartProducts.reduce((sum, item) => {
      if (item.old_price) {
        return sum + (parseFloat(item.old_price) - parseFloat(item.price));
      }
      return sum;
    }, 0);

    const total = itemsTotal;

    return { 
      itemsTotal: itemsTotal.toFixed(2), 
      discount: discount.toFixed(2), 
      total: total.toFixed(2) 
    };
  };

  const { itemsTotal, discount, total } = calculateTotals();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.breadcrumbs}>
          <Link to="/" className={styles.breadcrumbLink}>Главная</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link to="/catalog" className={styles.breadcrumbLink}>Каталог</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Корзина</span>
        </div>

        <h1 className={styles.title}>МОЯ КОРЗИНА</h1>
        <p className={styles.itemCount}>{cartItems.length} товара</p>
        
        <div className={styles.container}>
          {/* Cart Items */}
          <div className={styles.cartSection}>
            <div className={styles.cartContainer}>
              <div className={styles.cartHeader}>
                <span>Товар</span>
                <span>Сумма</span>
              </div>
              
              {loading ? (
                <div className={styles.loading}>Загрузка корзины...</div>
              ) : error ? (
                <div className={styles.error}>{error}</div>
              ) : cartProducts.length > 0 ? (
                cartProducts.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <Link to={`/catalog/${item.id}`} className={styles.productLink}>
                      <img 
                        src={item.image || '/placeholder.png'} 
                        alt={item.name} 
                        className={styles.itemImage} 
                        loading="lazy" 
                      />
                      <div className={styles.itemDetails}>
                        <h3>{item.name}</h3>
                        <div className={styles.itemStatus}>
                          <span>В наличии • {item.description}</span>
                        </div>
                      </div>
                    </Link>
                    <div className={styles.itemPrice}>
                      <div className={styles.priceValue}>
                        {item.price} ₽
                        {item.old_price && (
                          <span className={styles.oldPrice}>{item.old_price} ₽</span>
                        )}
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className={styles.deleteButton}
                        type="button"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyCart}>Корзина пуста</div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summaryContainer}>
              <h2 className={styles.summaryTitle}>Итого</h2>
              <div className={styles.totalPrice}>
                {total} ₽
              </div>
              <div>
                <div className={styles.summaryRow}>
                  <span>Стоимость товаров</span>
                  <span>{itemsTotal} ₽</span>
                </div>
                {discount > 0 && (
                  <div className={styles.summaryRow}>
                    <span>Сумма скидки</span>
                    <span>{discount} ₽</span>
                  </div>
                )}
              </div>
              <button 
                className={styles.checkoutButton}
                disabled={loading || cartProducts.length === 0}
                onClick={handleCheckout}
              >
                Оформить заказ
              </button>
            </div>
          </div>
        </div>

        {/* Top-4 Products Section */}
        <div className={styles.topProductsSection}>
          <h2 className={styles.topProductsTitle}>ТОП-4 ТОВАРА НЕДЕЛИ</h2>
          <ProductCardContainer 
            productsData={popularProducts}
            onAddToCart={addToCart}
          />
        </div>
      </main>

      {/* Модальное окно оформления заказа */}
      {showCheckoutModal && (
        <div className={styles.modalOverlay} onClick={closeCheckoutModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Оформить заказ</h3>
              <button className={styles.modalClose} onClick={closeCheckoutModal}>×</button>
            </div>
            <form onSubmit={handleCheckoutSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={checkoutForm.email}
                  onChange={handleCheckoutFormChange}
                  required
                  className={styles.formInput}
                  placeholder="Введите ваш email"
                />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="paymentCompleted"
                    name="paymentCompleted"
                    checked={checkoutForm.paymentCompleted}
                    onChange={handleCheckoutFormChange}
                    className={styles.checkbox}
                  />
                  <label htmlFor="paymentCompleted" className={styles.checkboxLabel}>
                    Оплата прошла (dev)
                  </label>
                </div>
              </div>

              {checkoutError && (
                <div className={styles.errorMessage}>
                  {checkoutError}
                </div>
              )}

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={`${styles.btn} ${styles.secondary}`}
                  onClick={closeCheckoutModal}
                >
                  Отмена
                </button>
                <button 
                  type="submit" 
                  className={`${styles.btn} ${styles.primary}`}
                  disabled={isCheckoutSubmitting}
                >
                  {isCheckoutSubmitting ? 'Оформление...' : 'Оформить заказ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно успешного заказа */}
      {showSuccessModal && (
        <div className={styles.modalOverlay} onClick={closeSuccessModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Заказ оформлен!</h3>
              <button className={styles.modalClose} onClick={closeSuccessModal}>×</button>
            </div>
            <div className={styles.modalContent}>
              <p>Ваш заказ успешно оформлен! Мы свяжемся с вами в ближайшее время для подтверждения.</p>
              <p>Сумма заказа: <strong>{total} ₽</strong></p>
            </div>
            <div className={styles.modalActions}>
              <button 
                className={`${styles.btn} ${styles.primary}`}
                onClick={closeSuccessModal}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}