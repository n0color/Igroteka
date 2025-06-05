import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import queryString from "query-string";
import Footer from "../Components/Footer";
import ProductCardContainer from '../Components/ProductCardContainer';
import styles from '../Styles/catalog.module.scss';

export default function Catalog() {
  const location = useLocation();
  const query = queryString.parse(location.search);

  const handleApplyFilters = () => {
    console.log('Applying filters...');
  };

  return (
    <div className={styles.catalogPage}>
      <Header />
      {query.search && <div> Вы искали: {query.search} </div>}
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
              <h3>Жанр</h3>
              <label>
                <input type="checkbox" value="RPG" />
                RPG
              </label>
              <label>
                <input type="checkbox" value="Онлайн" />
                FPS
              </label>
              <label>
                <input type="checkbox" value="Симулятор" />
                Симулятор
              </label>
            </div>

            <div className={styles.filterSection}>
              <h3>Для кого</h3>
              <label>
                <input type="checkbox" value="для себя" />
                Для себя
              </label>
              <label>
                <input type="checkbox" value="в подарок" />
                В подарок
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
              <select className={styles.sortSelect}>
                <option value="popular">По популярности</option>
                <option value="price">По цене</option>
              </select>
            </div>
            <ProductCardContainer />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}