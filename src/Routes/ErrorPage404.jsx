import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header'
import Footer from "../Components/Footer";
import "../index.scss";
function ErrorPage404() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header />
      <h1 className='errorh1'>Ой! Тут ничего нет! Вернись<button className='button' onClick={handleBack}>назад</button></h1>
      <Footer />
    </>
  )
}

export default ErrorPage404;
