import React from "react";
import productCardStyle from '../Styles/productCard.module.scss';

export default function ProductCard
({ productId, productName, srcToImage, altToImage, 
  typeStore, typeAct, IsDiscount, Price, oldPrice }) {

  return (
    
    <div className={productCardStyle.ProductCardContainer}>
      <img className={productCardStyle.productImage} src={srcToImage} alt={altToImage} />
      <h4 className={productCardStyle.productHeader}>{ productName }</h4>
      <span className={productCardStyle.typeStore}>{ typeStore }</span>
      <span className={productCardStyle.typeAct}>{ typeAct }</span>
      <div className={productCardStyle.rowContainer}>
        <div className={productCardStyle.priceContainer}>
          {IsDiscount ? (
            <span className={productCardStyle.oldPrice}>{ oldPrice } ₽</span>
          ) : (
            ""
          )}
          <span className={productCardStyle.Price}>{ Price } ₽</span>
        </div>
        <button className={productCardStyle.store}>
          <img src="\public\cart.svg" alt="store" />
        </button>
      </div>
      <button className={productCardStyle.buyOneClick}>Купить в 1 клик</button>
    </div>
   
  );
  
}