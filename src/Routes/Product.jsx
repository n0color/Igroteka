import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ErrorPage404 from "./ErrorPage404";
import styles from "../Styles/Product.module.scss";
import ProductCardContainer from "../Components/ProductCardContainer";

export default function Product() {
  const { productid } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    content: '',
    author_name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  
  // Состояние для модального окна покупки в 1 клик
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [buyForm, setBuyForm] = useState({
    email: '',
    paymentCompleted: false
  });
  const [isBuySubmitting, setIsBuySubmitting] = useState(false);
  const [buyError, setBuyError] = useState(null);

  useEffect(() => {
    const checkCartStatus = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          setIsInCart(cartItems.some(item => String(item.id) === String(productid)));
        }
      } catch (error) {
        console.error('Ошибка при проверке корзины:', error);
      }
    };

    checkCartStatus();

    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        checkCartStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [productid]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/api/products/${productid}`);
        if (!response.ok) {
          throw new Error('Товар не найден');
        }
        const data = await response.json();
        setProduct(data.data);
        
        // Получаем похожие товары
        const similarResponse = await fetch(`http://127.0.0.1:8000/api/products/random/4`);
        if (similarResponse.ok) {
          const similarData = await similarResponse.json();
          setSimilarProducts(similarData.data);
        }

        // Получаем отзывы
        setIsReviewsLoading(true);
        const reviewsResponse = await fetch(`http://127.0.0.1:8000/api/products/${productid}/reviews`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.data.reviews || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
        setIsReviewsLoading(false);
      }
    };

    fetchProduct();
  }, [productid]);

  const handleAddToCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      let cartItems = savedCart ? JSON.parse(savedCart) : [];
      
      // Проверяем текущее состояние корзины, преобразуя ID в строки
      const currentlyInCart = cartItems.some(item => String(item.id) === String(productid));
      
      if (currentlyInCart) {
        // Если товар в корзине - удаляем
        cartItems = cartItems.filter(item => String(item.id) !== String(productid));
        setIsInCart(false);
      } else {
        // Если товара нет в корзине - добавляем
        cartItems = [...cartItems, { id: String(productid) }]; // Сохраняем ID как строку
        setIsInCart(true);
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      // Вызываем событие storage для обновления других компонентов
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(cartItems),
        oldValue: savedCart,
        storageArea: localStorage
      }));
    } catch (error) {
      console.error('Ошибка при работе с корзиной:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setReviewError(null);

    try {
      console.log('Отправляемые данные:', {
        url: `http://127.0.0.1:8000/api/products/${productid}/reviews`,
        formData: reviewForm
      });

      const response = await fetch(`http://127.0.0.1:8000/api/products/${productid}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify(reviewForm),
      });

      const responseData = await response.json();
      console.log('Ответ сервера:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Не удалось отправить отзыв');
      }

      // Обновляем список отзывов
      const reviewsResponse = await fetch(`http://127.0.0.1:8000/api/products/${productid}/reviews`);
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.data.reviews || []);
      }

      // Очищаем форму
      setReviewForm({
        rating: 5,
        content: '',
        author_name: ''
      });
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBuyOneClick = () => {
    setShowBuyModal(true);
    setBuyError(null);
  };

  const handleBuyFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBuyForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBuySubmit = async (e) => {
    e.preventDefault();
    setIsBuySubmitting(true);
    setBuyError(null);

    try {
      // Проверяем, что оплата прошла (dev режим)
      if (!buyForm.paymentCompleted) {
        throw new Error('Необходимо подтвердить оплату');
      }

      // Здесь можно добавить API запрос для обработки покупки
      // Пока просто симулируем успешную отправку
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowBuyModal(false);
      setShowSuccessModal(true);
      setBuyForm({ email: '', paymentCompleted: false });
    } catch (err) {
      setBuyError(err.message);
    } finally {
      setIsBuySubmitting(false);
    }
  };

  const closeBuyModal = () => {
    setShowBuyModal(false);
    setBuyForm({ email: '', paymentCompleted: false });
    setBuyError(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className={styles.productPageContainer}>
          <div className={styles.loading}>Загрузка...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return <ErrorPage404 />;
  }

  return (
    <>
      <Header />
        <div className={styles.productPageContainer}>
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbs}>
            <Link to="/" className={styles.breadcrumbLink}>Главная</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadbreadcrumbLink}>Каталог</span>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{product.id}</span>
          </div>
          {/* Верхний блок */}
          <div className={styles.productTop}>
            {/* Картинка */}
              <img 
                className={styles.productImage} 
                src={product.image}
                alt={product.name} 
              />
            {/* Инфо и кнопки */}
            <div className={styles.productInfo}>
              <div className={styles.productTitle}>{product.name}</div>
              <div className={styles.productMeta}>Просмотров {product.views || 0}  |  Купили {product.sales || 0} раз  |  Артикул: {product.id}</div>
              <div className={styles.productInStock}>В наличии</div>
              <div className={styles.productPriceRow}>
                {product.is_discount && (
                  <span className={styles.oldPrice}>{product.old_price} ₽</span>
                )}
                <span className={styles.currentPrice}>{product.price} ₽</span>
              </div>
              <div className={styles.productActions}>
                <button 
                  className={`${styles.btn} ${styles.primary}`}
                  onClick={handleBuyOneClick}
                >
                  Купить в 1 клик
                </button>
                <button 
                  className={`${styles.btn} ${styles.secondary} ${isInCart ? styles.inCart : ''}`}
                  onClick={handleAddToCart}
                >
                  {isInCart ? 'Удалить из корзины' : 'Добавить в корзину'}
                </button>
              </div>
              <div className={styles.productLinks}>
                <span>Сравнить</span>
                <span>Поделиться</span>
              </div>
            </div>
          </div>
          <ProductCardContainer 
            header="ПОХОЖИЕ ТОВАРЫ"
            productsData={similarProducts}
          />

          {/* Блок с отзывами */}
          <div className={styles.reviewsSection}>
            <h2 className={styles.reviewsTitle}>ОТЗЫВЫ О ТОВАРЕ</h2>
            
            {/* Форма отзыва */}
            <div className={styles.reviewForm}>
              <h3>Оставить отзыв</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="author_name">Ваше имя:</label>
                  <input
                    type="text"
                    id="author_name"
                    name="author_name"
                    value={reviewForm.author_name}
                    onChange={handleReviewChange}
                    required
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Оценка:</label>
                  <div className={styles.ratingInput}>
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={`${styles.star} ${index < reviewForm.rating ? styles.filled : ''}`}
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: index + 1 }))}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="content">Ваш отзыв:</label>
                  <textarea
                    id="content"
                    name="content"
                    value={reviewForm.content}
                    onChange={handleReviewChange}
                    required
                    className={styles.formTextarea}
                    rows="4"
                  />
                </div>

                {reviewError && (
                  <div className={styles.errorMessage}>
                    {reviewError}
                  </div>
                )}

                <button 
                  type="submit" 
                  className={`${styles.btn} ${styles.primary}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                </button>
              </form>
            </div>

            {isReviewsLoading ? (
              <div className={styles.loading}>Загрузка отзывов...</div>
            ) : reviews.length > 0 ? (
              <div className={styles.reviewsList}>
                {reviews.map((review) => (
                  <div key={review.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewAuthor}>
                        <span className={styles.authorName}>{review.author_name}</span>
                        <span className={styles.reviewDate}>
                          {new Date(review.created_at).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className={styles.reviewRating}>
                        {[...Array(5)].map((_, index) => (
                          <span 
                            key={index} 
                            className={`${styles.star} ${index < review.rating ? styles.filled : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.reviewContent}>
                      {review.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noReviews}>
                Пока нет отзывов об этом товаре. Будьте первым, кто оставит отзыв!
              </div>
            )}
          </div>
        </div>

        {/* Модальное окно покупки в 1 клик */}
        {showBuyModal && (
          <div className={styles.modalOverlay} onClick={closeBuyModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Купить в 1 клик</h3>
                <button className={styles.modalClose} onClick={closeBuyModal}>×</button>
              </div>
              <form onSubmit={handleBuySubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={buyForm.email}
                    onChange={handleBuyFormChange}
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
                      checked={buyForm.paymentCompleted}
                      onChange={handleBuyFormChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="paymentCompleted" className={styles.checkboxLabel}>
                      Оплата прошла (dev)
                    </label>
                  </div>
                </div>

                {buyError && (
                  <div className={styles.errorMessage}>
                    {buyError}
                  </div>
                )}

                <div className={styles.modalActions}>
                  <button 
                    type="button" 
                    className={`${styles.btn} ${styles.secondary}`}
                    onClick={closeBuyModal}
                  >
                    Отмена
                  </button>
                  <button 
                    type="submit" 
                    className={`${styles.btn} ${styles.primary}`}
                    disabled={isBuySubmitting}
                  >
                    {isBuySubmitting ? 'Отправка...' : 'Отправить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Модальное окно успешной отправки */}
        {showSuccessModal && (
          <div className={styles.modalOverlay} onClick={closeSuccessModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Успешно</h3>
                <button className={styles.modalClose} onClick={closeSuccessModal}>×</button>
              </div>
              <div className={styles.modalContent}>
                <p>Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.</p>
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