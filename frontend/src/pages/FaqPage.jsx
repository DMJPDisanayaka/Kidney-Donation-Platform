import { useState } from 'react';

export default function FaqPage({ t }) {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    [t('faq1Q'), t('faq1A')],
    [t('faq2Q'), t('faq2A')],
    [t('faq3Q'), t('faq3A')]
  ];

  return (
    <section className="page-container active">
      <div className="faq-container">
        <div className="section-title"><h2>{t('faqTitle')}</h2></div>
        {faqs.map((item, index) => (
          <div className="faq-item" key={item[0]}>
            <div className="faq-question" onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}>
              <span>{item[0]}</span>
              <i className="fas fa-chevron-down" style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </div>
            <div className={`faq-answer ${openIndex === index ? 'active' : ''}`}><p>{item[1]}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
