import { Link } from "react-router-dom";
import "../Styles/banners.scss";

const Banner = ({ bannerContent }) => {
  const { title, image, theme, subtitle } = bannerContent || {};
  
  return (
    <div className={`banner ${theme}`}>
      <div className="banner-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        <Link to="/catalog" className="banner-button">
          Перейти к товару
        </Link>
      </div>
    {image !== 'none' && (
        <img src={image} alt={title} />
    )}
    </div>
  );
}

export default Banner;