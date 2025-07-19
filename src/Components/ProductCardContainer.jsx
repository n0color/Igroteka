import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ProductCard from './ProductCard';
import styles from '../Styles/productCardContainer.module.scss';
import { Link } from 'react-router-dom';

export default function ProductCardContainer({ productsData, header, showButton = false, onAddToCart }) {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    let timer;
    if (showModal) {
      timer = setTimeout(() => {
        setShowModal(false);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [showModal]);

  const handleCartAction = (productId, isInCart) => {
    if (onAddToCart) {
      onAddToCart(productId);
      setModalMessage(isInCart ? 'Товар удален из корзины' : 'Товар добавлен в корзину');
      setShowModal(true);
    }
  };

  return (
    <>
      <div className={styles.containerAll}>
        {header ? <h4>{header}</h4> : ""}
        <div className={styles.container}>
          {Array.isArray(productsData) && productsData.length > 0 ? productsData.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              productName={product.name}
              srcToImage={product.image || '/placeholder.png'}
              altToImage={product.name}
              typeStore={product.description}
              IsDiscount={!!product.old_price}
              Price={product.price}
              oldPrice={product.old_price}
              onCartAction={handleCartAction}
            />
          )) : <div>Нет доступных товаров</div>}
        </div>
        {showButton && <Link className={styles.buttonShowAll} to={"/catalog"}>Смотреть все</Link>}
      </div>

      {showModal && ReactDOM.createPortal(
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {modalMessage}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}