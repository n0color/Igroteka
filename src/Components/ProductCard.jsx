import React, { useState, useEffect } from "react";
import productCardStyle from '../Styles/productCard.module.scss';
import { Link } from "react-router-dom";
import cartIcon from "../../public/cart.svg";

export default function ProductCard({
  productId, 
  productName, 
  srcToImage, 
  altToImage, 
  typeStore, 
  typeAct, 
  IsDiscount, 
  Price, 
  oldPrice, 
  onBuyClick,
  onCartAction 
}) {
  const [isInCart, setIsInCart] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Проверяем статус корзины при монтировании и при изменении productId
  useEffect(() => {
    const checkCartStatus = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          // Преобразуем ID в строки для сравнения
          setIsInCart(cartItems.some(item => String(item.id) === String(productId)));
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
  }, [productId]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      const savedCart = localStorage.getItem('cart');
      let cartItems = savedCart ? JSON.parse(savedCart) : [];
      
      // Проверяем текущее состояние корзины, преобразуя ID в строки
      const currentlyInCart = cartItems.some(item => String(item.id) === String(productId));
      
      if (currentlyInCart) {
        // Если товар в корзине - удаляем
        cartItems = cartItems.filter(item => String(item.id) !== String(productId));
        setIsInCart(false);
        if (onCartAction) {
          onCartAction(productId, false);
        }
      } else {
        // Если товара нет в корзине - добавляем
        cartItems = [...cartItems, { id: String(productId) }]; // Сохраняем ID как строку
        setIsInCart(true);
        if (onCartAction) {
          onCartAction(productId, true);
        }
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
      setIsInCart(!isInCart);
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 300);
    }
  };

  const handleBuyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Здесь ОООООООООООООООООООООООООООООООО МОООООООООООООООЯ ОБОООООООООООРОООООООООООНААААААААААААА
  };

  return (
    <div className={productCardStyle.ProductCardContainer}>
      <Link 
        to={`/catalog/${productId}`} 
        onClick={handleClick}
        className={productCardStyle.productLink}
      >
        <img className={productCardStyle.productImage} src={srcToImage} alt={altToImage} loading="lazy"/>
        <h4 className={productCardStyle.productHeader}>{productName}</h4>
        <span className={productCardStyle.typeStore}>{typeStore}</span>
      </Link>
      
      <div className={productCardStyle.rowContainer}>
        <div className={productCardStyle.priceContainer}>
          {IsDiscount ? (
            <span className={productCardStyle.oldPrice}>{oldPrice} ₽</span>
          ) : null}
          <span className={productCardStyle.Price}>{Price} ₽</span>
        </div>
        <button 
          className={`${productCardStyle.store} ${isInCart ? productCardStyle.inCart : ''} ${isUpdating ? productCardStyle.updating : ''}`}
          onClick={handleCartClick}
          disabled={isUpdating}
          title={isInCart ? "Удалить из корзины" : "Добавить в корзину"}
        >
          <img 
            src="/cart.svg" 
            alt={isInCart ? "В корзине" : "Добавить в корзину"} 
          />
        </button>
      </div>
      
      <button className={productCardStyle.buyOneClick} onClick={handleBuyClick}>
        Купить в 1 клик
      </button>
    </div>
  );
}