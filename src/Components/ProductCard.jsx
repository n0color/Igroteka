import React from "react";
import productCardStyle from '../Styles/productCard.module.scss';
import { Link } from "react-router-dom";
import cartIcon from "../../public/cart.svg";

export default function ProductCard
({ productId, productName, srcToImage, altToImage, 
  typeStore, typeAct, IsDiscount, Price, oldPrice, onBuyClick }) {

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCartClick = () => {
    console.log(`Adding product ${productId} to cart`);
  };

  return (
    <div className={productCardStyle.ProductCardContainer}>
      <Link 
        to={`/catalog/${productId}`} 
        onClick={handleClick}
        className={productCardStyle.productLink}
      >
        <img className={productCardStyle.productImage} src={srcToImage} alt={altToImage} />
        <h4 className={productCardStyle.productHeader}>{ productName }</h4>
        <span className={productCardStyle.typeStore}>{ typeStore }</span>
        <span className={productCardStyle.typeAct}>{ typeAct }</span>
      </Link>
      
      <div className={productCardStyle.rowContainer}>
        <div className={productCardStyle.priceContainer}>
          {IsDiscount ? (
            <span className={productCardStyle.oldPrice}>{ oldPrice } ₽</span>
          ) : (
            ""
          )}
          <span className={productCardStyle.Price}>{ Price } ₽</span>
        </div>
        <button className={productCardStyle.store} onClick={handleCartClick}>
          <img src={cartIcon} alt="store" />
        </button>
      </div>
      
      <button className={productCardStyle.buyOneClick} onClick={onBuyClick}>
        Купить в 1 клик
      </button>
    </div>
  );
}