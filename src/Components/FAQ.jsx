import React, { useState } from 'react';
import '../Styles/faq.scss';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqItems = [
    {
      question: "Как не ошибиться при выборе магазина?",
      answer: "Мы являемся официальным партнером и продаем только лицензионные ключи. Вы можете быть уверены в безопасности покупки."
    },
    {
      question: "Ваши ключи работают?",
      answer: "Да, все наши ключи являются официальными и гарантированно работают."
    },
    {
      question: "Как активировать товар?",
      answer: "После покупки вы получите подробную инструкцию по активации ключа на вашу электронную почту."
    },
    {
      question: "Как получить товар?",
      answer: "Товар будет автоматически доставлен на вашу электронную почту сразу после оплаты."
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <h2>ОТВЕЧАЕМ НА ВОПРОСЫ ПОКУПАТЕЛЕЙ</h2>
      <div className="faq-list">
        {faqItems.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
            onClick={() => toggleQuestion(index)}
          >
            <div className="faq-question">
              <h3>{item.question}</h3>
              <span className="toggle-icon">{openIndex === index ? '-' : '+'}</span>
            </div>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ; 