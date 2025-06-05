import React from "react";
import { useParams, Link } from "react-router-dom";
import { productsData } from "../data/products";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ErrorPage404 from "./ErrorPage404";
import styles from "../Styles/Product.module.scss";
import ProductCardContainer from "../Components/ProductCardContainer";

export default function Product() {
  const { productid } = useParams();
  const product = productsData.find((p) => String(p.id) === String(productid));

  const currentIndex = productsData.findIndex((p) => String(p.id) === String(productid));
  const similar = productsData.slice(currentIndex + 1, currentIndex + 5);

  if (!product) {
    return (
      <ErrorPage404 />
    );
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
              <img className={styles.productImage} src={`/${product.image}`} alt={product.imageAlt} />
            {/* Инфо и кнопки */}
            <div className={styles.productInfo}>
              <div className={styles.productTitle}>{product.title}</div>
              <div className={styles.productMeta}>Просмотров {product.countOfViews}  |  Купили {product.countOfSales} раз  |  Артикул: {product.id}</div>
              <div className={styles.productInStock}>В наличии</div>
              <div className={styles.productPriceRow}>
                {product.hasDiscount && (
                  <span className={styles.oldPrice}>{product.oldPrice} ₽</span>
                )}
                <span className={styles.currentPrice}>{product.currentPrice} ₽</span>
              </div>
              <div className={styles.productActions}>
                <button className={`${styles.btn} ${styles.primary}`}>Купить в 1 клик</button>
                <button className={`${styles.btn} ${styles.secondary}`}>Добавить в корзину</button>
              </div>
              <div className={styles.productLinks}>
                <span>Сравнить</span>
                <span>Поделиться</span>
              </div>
            </div>
          </div>
          <ProductCardContainer 
          header="ПОХОЖИЕ ТОВАРЫ"
          />
        </div>
      <Footer />
    </>
  );
} 