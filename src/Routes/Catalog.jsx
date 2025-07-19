import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import Header from "../Components/Header";
import queryString from "query-string";
import Footer from "../Components/Footer";
import ProductCardContainer from '../Components/ProductCardContainer';
import styles from '../Styles/catalog.module.scss';

export default function Catalog() {
  const location = useLocation();
  const query = queryString.parse(location.search);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('popular');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        let apiUrl = `http://127.0.0.1:8000/api/products/?sort_by=${sortOption}`;

        if (query.search) {
          apiUrl = `http://127.0.0.1:8000/api/products/search/${encodeURIComponent(query.search)}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных');
        }
        
        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortOption, query.search]);

  const handleCartAction = (productId, isAdding) => {
    try {
      const savedCart = localStorage.getItem('cart');
      let cartItems = savedCart ? JSON.parse(savedCart) : [];
      
      if (isAdding) {
        // Добавляем товар только если его еще нет в корзине
        if (!cartItems.some(item => item.id === productId)) {
          cartItems = [...cartItems, { id: productId }];
        }
      } else {
        // Удаляем товар
        cartItems = cartItems.filter(item => item.id !== productId);
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

  const handleApplyFilters = () => {
    console.log('Applying filters...');
  };

  return (
    <div className={styles.catalogPage}>
      <Header />
      {query.search && <div className={styles.searchQuery}>Вы искали: {query.search}</div>}
      <main className={styles.main}>
        {/* Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          <Link to="/" className={styles.breadcrumbLink}>Главная</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Каталог</span>
        </div>

        <div className={styles.catalogContent}>
          {/* Filters */}
          <aside className={styles.filters}>
            <h2 className={styles.filterTitle}>ФИЛЬТР</h2>
            
            {/* Price Filter */}
            <div className={styles.filterSection}>
              <h3>Цена</h3>
              <div className={styles.priceRange}>
                <input type="number" placeholder="0" />
                <span>—</span>
                <input type="number" placeholder="10 000" />
              </div>
            </div>

            {/* Genre Filter */}
            <div className={styles.filterSection}>
              <h3>Магазин</h3>
              <label>
                <input type="checkbox" value="Steam" />
                Steam
              </label>
              <label>
                <input type="checkbox" value="VkPlay" />
                VkPlay
              </label>
              <label>
                <input type="checkbox" value="EGS" />
                EGS
              </label>
            </div>

            <div className={styles.filterSection}>
              <h3>Скидка</h3>
              <label>
                <input name="radio" type="radio" value="true" />
                Со скидкой
              </label>
              <label>
                <input name="radio" type="radio" value="false" />
                Без скидки
              </label>
            </div>
            {/* Apply Filters Button */}
            <button 
              className={styles.applyFiltersBtn}
              onClick={handleApplyFilters}
            >
              Применить фильтры
            </button>
          </aside>

          {/* Products Grid */}
          <section className={styles.productsSection}>
            <div className={styles.sortingBar}>
              <span>Сортировать:</span>
              <select 
                className={styles.sortSelect}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="popular">По популярности</option>
                <option value="price">По цене</option>
              </select>
            </div>
            {loading && <div className={styles.loading}>Загрузка...</div>}
            {error && <div className={styles.error}>Ошибка: {error}</div>}
            {!loading && !error && (
              <ProductCardContainer 
                productsData={products} 
                onAddToCart={handleCartAction}
              />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}