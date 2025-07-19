import { Link } from "react-router-dom";
import "../Styles/banners.scss";

const Banner = ({ bannerContent }) => {
  const { title, image, theme, subtitle } = bannerContent || {};
  
  return (
    <div className={`banner ${theme}`}>
      <div className="banner-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        <Link to="/catalog/13" className="banner-button">
          Перейти к товару
        </Link>
      </div>
    {image !== 'none' && (
        <img src={image} alt={title} loading="lazy" />
    )}
    </div>
  );
}

export default Banner;