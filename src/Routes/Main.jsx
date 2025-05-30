import { useState } from 'react'

import Header from '../Components/Header'
import Footer from "../Components/Footer";
import ProductCardContainer from '../Components/ProductCardContainer';
import Banner from '../Components/Banner';
import FAQ from '../Components/FAQ';
import Features from '../Components/Features';
import "../Styles/mainPage.scss";

function MainPage() {
  const mainBannerContent = {
    title: 'ATOMIC HEART ВСЕГО ОТ 299 РУБЛЕЙ',
    image: 'none',
    theme: 'atomic',
    subtitle: 'Только для новых клиентов'
  };

  const blackFridayBannerContent = {
    title: 'ЧЁРНАЯ ПЯТНИЦА НА IGROTEKA! СКИДКИ ДО 85%',
    image: '/pudge.png',
    theme: 'black-friday'
  };

  return (
    <>
      <Header />
      <div className='main'>
        <Banner bannerContent={mainBannerContent} />
        
        <div className="features-grid">
          <Features 
            title="ГАРАНТИЯ" 
            subtitle="на весь ассортимент" 
          />
          <Features 
            title="СКИДКИ" 
            subtitle="до 95%" 
          />
          <Features 
            title="ПОДАРКИ" 
            subtitle="к каждому заказу" 
          />
        </div>

        <ProductCardContainer 
          header="КЛЮЧИ ИГР"
          showButton={true}
        />

        <Banner bannerContent={blackFridayBannerContent} />

          <Features
            items={[
              { icon: "guarantee", title: "5 товаров в каталоге", description: "Мы продаем только лицензионные ключи" },
              { icon: "delivery", title: "2 способа оплаты", description: "Вы можете оплатить любым удобным способом" },
              { icon: "support", title: "Ваши аккаунты", description: "Информация о ваших покупках всегда под рукой" },
              { icon: "time", title: "Открыты 24/7", description: "Покупайте когда вам удобно" },
              { icon: "protection", title: "Официальный партнёр", description: "Только лицензионные ключи" },
              { icon: "bonus", title: "Бонусы к каждому", description: "Приятные бонусы" }
            ]}
          />
        <FAQ />

        <ProductCardContainer 
          header="ЧАСТО ПОКУПАЮТ"
        />
      </div>
      <Footer />
    </>
  )
}

export default MainPage;
