import { Link, NavLink, Outlet } from 'react-router-dom';

const navPages = [
  { path: '/', key: 'home' },
  { path: '/about', key: 'about' },
  { path: '/find-donor', key: 'find-donor' },
  { path: '/faq', key: 'faq' },
  { path: '/contact', key: 'contact' }
];

export default function Layout({ language, setLanguage, currentUser, onLogout, t, mobileMenuOpen, setMobileMenuOpen }) {
  const userName = currentUser?.fullName || currentUser?.full_name || '';

  return (
    <>
      <header>
        <div className="logo">
          <i className="fas fa-hand-holding-heart" />
          <h1>Kidney<span>Connect</span> Sri Lanka</h1>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen((prev) => !prev)}>
          <i className="fas fa-bars" />
        </button>

        <nav>
          <ul id="navMenu" className={mobileMenuOpen ? 'show' : ''}>
            {navPages.map((item, index) => (
              <li key={item.key}>
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to={item.path} end={item.path === '/'} onClick={() => setMobileMenuOpen(false)}>{t('nav')[index]}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="language-selector">
          <button className={`lang-btn ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en')}>EN</button>
          <button className={`lang-btn ${language === 'si' ? 'active' : ''}`} onClick={() => setLanguage('si')}>සිං</button>
          <button className={`lang-btn ${language === 'ta' ? 'active' : ''}`} onClick={() => setLanguage('ta')}>தமிழ்</button>
        </div>

        {!currentUser ? (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-outline">{t('login')}</Link>
            <Link to="/register" className="btn btn-primary">{t('register')}</Link>
          </div>
        ) : (
          <div className="user-info-header" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontWeight: '500', color: 'var(--text-color)' }}>{t('welcome')}, <strong>{userName}</strong></span>
            <button className="btn btn-accent" onClick={onLogout}>{t('logout')}</button>
          </div>
        )}
      </header>

      <Outlet />

      <footer>
        <div className="footer-content">
          <div className="footer-column">
            <h3>{t('appName')}</h3>
            <p>{t('footerDesc')}</p>
          </div>
          <div className="footer-column">
            <h3>{t('quickLinks')}</h3>
            <ul className="footer-links">
              {navPages.map((item, index) => (
                <li key={item.key}>
                  <Link to={item.path} className="footer-nav-link">{t('nav')[index]}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
