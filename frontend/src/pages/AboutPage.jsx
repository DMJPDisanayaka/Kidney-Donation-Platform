export default function AboutPage({ t }) {
  return (
    <section className="page-container active">
      <div className="about-content">
        <div className="section-title"><h2>{t('aboutTitle')}</h2></div>
        <div className="about-section">
          <h3>{t('missionTitle')}</h3>
          <p>{t('missionText')}</p>
        </div>
      </div>
    </section>
  );
}
