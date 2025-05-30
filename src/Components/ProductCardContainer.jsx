import React from 'react';
import ProductCard from './ProductCard';
import styles from '../Styles/productCardContainer.module.scss';
import { productsData } from '../data/products';
import { Link } from 'react-router-dom';

export default function ProductCardContainer({ header, showButton = false }) {
  return (
    <div className={styles.containerAll}>
      {header ? <h4>{header}</h4> : ""}
      <div className={styles.container}>
        {productsData && productsData.map((product) => (
          <ProductCard
            key={product.id}
            productId={product.id}
            productName={product.title}
            srcToImage={product.image}
            altToImage={product.imageAlt}
            typeStore={product.store}
            typeAct={product.badge}
            IsDiscount={product.hasDiscount}
            Price={product.currentPrice}
            oldPrice={product.oldPrice}
          />
        ))}
      </div>
      {showButton && <Link className={styles.buttonShowAll} to={"/catalog"}>Смотреть все</Link>}
    </div>
  );
}