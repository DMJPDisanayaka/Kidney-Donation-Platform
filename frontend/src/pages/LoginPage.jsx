import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage({ loginData, setLoginData, onLogin, loginError, setLoginError, t }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await onLogin();
    setIsLoading(false);
    if (result.ok) navigate(result.next);
  };

  return (
    <section className="page-container active">
      <div className="auth-container">
        <div className="section-title">
          <h2>{t('loginTitle')}</h2>
          <p>{t('loginDesc')}</p>
        </div>

        {/* Error Message Display */}
        {loginError && (
          <div style={{
            backgroundColor: '#fee',
            border: '2px solid #c33',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#a00'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-exclamation-circle" /> Error
            </div>
            <div>{loginError}</div>
            {loginError.includes('Email or NIC not found') && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
                💡 <Link to="/register" style={{ color: '#a00', textDecoration: 'underline', fontWeight: 'bold' }}>Create a new account</Link>
              </div>
            )}
            {loginError.includes('Password is incorrect') && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
                💡 Double-check your password and try again
              </div>
            )}
            <button onClick={() => setLoginError(null)} style={{ marginTop: '0.5rem', background: '#a00', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>
              Dismiss
            </button>
          </div>
        )}

        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="loginIdentifier">{t('emailOrNic')}</label>
              <input
                id="loginIdentifier"
                className="form-control"
                placeholder="Enter your email or NIC"
                value={loginData.identifier}
                onChange={(e) => {
                  setLoginData((prev) => ({ ...prev, identifier: e.target.value }));
                  setLoginError(null);
                }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">{t('password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="loginPassword"
                  className="form-control"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData((prev) => ({ ...prev, password: e.target.value }));
                    setLoginError(null);
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666',
                    fontSize: '1.1rem'
                  }}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.8rem 3rem', opacity: isLoading ? 0.7 : 1 }}
                disabled={isLoading}
              >
                <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-sign-in-alt'}`} /> {isLoading ? 'Logging in...' : t('login')}
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <p>{t('noAccount')} <Link to="/register" style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>{t('registerHere')}</Link></p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
