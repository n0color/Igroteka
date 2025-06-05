import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ProductCardContainer from "../Components/ProductCardContainer";
import { productsData1 } from "../data/prod";
import { useState, useEffect } from "react";
import styles from "../Styles/store.module.scss";
import { Link } from "react-router-dom";

export default function Store() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = fetch('http://localhost:80/api/cart/get', {
          method: 'GET',
          headers: {
            'Access-Control-Allow-Origin': '*',
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          });
        const data = await response.json();
        console.log('Cart data:', data);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, []);

  const calculateTotals = () => {
    const itemsTotal = cartItems.reduce((sum, item) => sum + item.currentPrice, 0);
    const discount = 100; // Example fixed discount
    const total = itemsTotal - discount;
    return { itemsTotal, discount, total };
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
              
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <Link to={`/catalog/${item.id}`} className={styles.productLink}>
                    <img src={item.image} alt={item.imageAlt} className={styles.itemImage} />
                    <div className={styles.itemDetails}>
                      <h3>{item.title}</h3>
                      <div className={styles.itemStatus}>
                        <span>В наличии • Продано {item.countOfSales} раз</span>
                      </div>
                    </div>
                  </Link>
                  <div className={styles.itemPrice}>
                    <div className={styles.priceValue}>{item.currentPrice} ₽</div>
                    <button className={styles.deleteButton}>
                      <span>Удалить</span>
                    </button>
                  </div>
                </div>
              ))}
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
                <div className={styles.summaryRow}>
                  <span>Сумма скидки</span>
                  <span>{discount} ₽</span>
                </div>
              </div>
              <button className={styles.checkoutButton}>
                Оформить заказ
              </button>
            </div>
          </div>
        </div>

        {/* Top-4 Products Section */}
        <div className={styles.topProductsSection}>
          <h2 className={styles.topProductsTitle}>ТОП-4 ТОВАРА НЕДЕЛИ</h2>
          <ProductCardContainer />
        </div>
      </main>
      <Footer />
    </>
  );
}