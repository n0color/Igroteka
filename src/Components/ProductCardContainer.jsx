import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ProductCard from './ProductCard';
import styles from '../Styles/productCardContainer.module.scss';
import { productsData } from '../data/products';
import { Link } from 'react-router-dom';

export default function ProductCardContainer({ header, showButton = false }) {
  const [showModal, setShowModal] = useState(false);

  const handleBuyClick = () => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000);
  };

  return (
    <>
      <div className={styles.containerAll}>
        {header ? <h4>{header}</h4> : ""}
        <div className={styles.container}>
          {productsData && productsData.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              productName={product.title}
              srcToImage={`/${product.image}`}
              altToImage={product.imageAlt}
              typeStore={product.store}
              typeAct={product.badge}
              IsDiscount={product.hasDiscount}
              Price={product.currentPrice}
              oldPrice={product.oldPrice}
              onBuyClick={handleBuyClick}
            />
          ))}
        </div>
        {showButton && <Link className={styles.buttonShowAll} to={"/catalog"}>Смотреть все</Link>}
      </div>

      {showModal && ReactDOM.createPortal(
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            Куплено
          </div>
        </div>,
        document.body
      )}
    </>
  );
}