import { Link } from 'react-router-dom';

export default function HomePage({ t }) {
  return (
    <section className="page-container active">
      <div className="language-notice"><i className="fas fa-language" /> {t('langNotice')}</div>
      <div className="hero">
        <div className="hero-content">
          <h2>{t('homeHeroTitle')}</h2>
          <p>{t('homeHeroDescription')}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/find-donor" className="btn btn-primary">{t('findDonorBtn')}</Link>
            <Link to="/register" className="btn btn-accent">{t('becomeDonorBtn')}</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Medical professionals" />
        </div>
      </div>
    </section>
  );
}
