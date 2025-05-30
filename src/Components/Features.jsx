import React from 'react';
import '../Styles/features.scss';

const Features = ({ title, subtitle, items }) => {
  // Если у нас есть массив items, рендерим секцию с преимуществами
  if (items) {
    return (
        <div className="features-grid">
          {items.map((item, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">
                <img src="/search.svg" alt={item.title} />
              </div>
              <div className="feature-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
    );
  }

  // Иначе рендерим одиночный блок преимущества
  return (
    <div className="feature-box">
      <div className="feature-icon">
        <img src="/search.svg" alt={title} />
      </div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
};

export default Features; 