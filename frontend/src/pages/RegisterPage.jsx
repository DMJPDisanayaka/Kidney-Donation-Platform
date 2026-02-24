import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { provinces } from '../constants';

export default function RegisterPage({ registration, setRegistration, onRegister, t }) {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setRegisterError(null);
    setIsLoading(true);
    const result = await onRegister();
    setIsLoading(false);
    if (result.ok) {
      navigate(result.next);
    } else {
      setRegisterError(result.message);
      window.scrollTo(0, 0);
    }
  };

  return (
    <section className="page-container active">
      <div className="auth-container">
        <div className="section-title">
          <h2>{t('registerTitle')}</h2>
          <p>{t('registerDesc')}</p>
        </div>

        {/* Error Message Display */}
        {registerError && (
          <div style={{
            backgroundColor: '#fee',
            border: '2px solid #c33',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#a00'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-exclamation-circle" /> Registration Error
            </div>
            <div>{registerError}</div>
            
            {/* Helpful hints for common errors */}
            {registerError.includes('already registered') && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
                💡 <Link to="/login" style={{ color: '#a00', textDecoration: 'underline', fontWeight: 'bold' }}>Try logging in with this email/NIC instead</Link>
              </div>
            )}
            {registerError.includes('between 18-60') && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
                💡 Only donors aged 18-60 years old can register. Patients can register at any age.
              </div>
            )}
            {registerError.includes('fill in all required fields') && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
                💡 Make sure all fields are completed (Name, NIC, Email, Phone, Date of Birth, Gender, Password, Blood Type, Location)
              </div>
            )}
            {registerError.includes('connection') && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
                💡 Unable to reach the server. Check your internet connection and try again.
              </div>
            )}
            {registerError.includes('HTTP 5') && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
                💡 Server error occurred. Please try again in a few moments.
              </div>
            )}
            
            <button onClick={() => setRegisterError(null)} style={{ marginTop: '0.5rem', background: '#a00', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>
              Dismiss
            </button>
          </div>
        )}

        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('registerAs')}</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input type="radio" id="patient" name="userType" checked={registration.userType === 'patient'} onChange={() => setRegistration((prev) => ({ ...prev, userType: 'patient' }))} />
                  <label htmlFor="patient">{t('patientLabel')}</label>
                </div>
                <div className="radio-option">
                  <input type="radio" id="donor" name="userType" checked={registration.userType === 'donor'} onChange={() => setRegistration((prev) => ({ ...prev, userType: 'donor' }))} />
                  <label htmlFor="donor">{t('donorLabel')}</label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group"><label htmlFor="regFullName">{t('fullName')}</label><input id="regFullName" className="form-control" value={registration.fullName} onChange={(e) => setRegistration((prev) => ({ ...prev, fullName: e.target.value }))} required /></div>
              <div className="form-group"><label htmlFor="regNIC">{t('nicNumber')}</label><input id="regNIC" className="form-control" value={registration.nic} onChange={(e) => setRegistration((prev) => ({ ...prev, nic: e.target.value }))} required /></div>
            </div>

            <div className="form-row">
              <div className="form-group"><label htmlFor="regEmail">{t('emailAddress')}</label><input type="email" id="regEmail" className="form-control" value={registration.email} onChange={(e) => setRegistration((prev) => ({ ...prev, email: e.target.value }))} required /></div>
              <div className="form-group"><label htmlFor="regPhone">{t('phoneNumber')}</label><input id="regPhone" className="form-control" value={registration.phone} onChange={(e) => setRegistration((prev) => ({ ...prev, phone: e.target.value }))} required /></div>
            </div>

            <div className="form-row">
              <div className="form-group"><label htmlFor="regDateOfBirth">{t('dateOfBirth')}</label><input type="date" id="regDateOfBirth" className="form-control" value={registration.dateOfBirth} onChange={(e) => setRegistration((prev) => ({ ...prev, dateOfBirth: e.target.value }))} required /></div>
              <div className="form-group">
                <label htmlFor="regGender">{t('gender')}</label>
                <select id="regGender" className="form-control form-select" value={registration.gender} onChange={(e) => setRegistration((prev) => ({ ...prev, gender: e.target.value }))} required>
                  <option value="">{t('selectGender')}</option>
                  <option value="Male">{t('male')}</option>
                  <option value="Female">{t('female')}</option>
                  <option value="Other">{t('other')}</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group"><label htmlFor="regPassword">{t('password')}</label><input type="password" id="regPassword" className="form-control" value={registration.password} onChange={(e) => setRegistration((prev) => ({ ...prev, password: e.target.value }))} required /></div>
              <div className="form-group"><label htmlFor="regConfirmPassword">{t('confirmPassword')}</label><input type="password" id="regConfirmPassword" className="form-control" value={registration.confirmPassword} onChange={(e) => setRegistration((prev) => ({ ...prev, confirmPassword: e.target.value }))} required /></div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="regBloodType">{t('bloodType')}</label>
                <select id="regBloodType" className="form-control form-select" value={registration.bloodType} onChange={(e) => setRegistration((prev) => ({ ...prev, bloodType: e.target.value }))} required>
                  <option value="">{t('selectBloodType')}</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="regLocation">{t('location')}</label>
                <select id="regLocation" className="form-control form-select" value={registration.location} onChange={(e) => setRegistration((prev) => ({ ...prev, location: e.target.value }))} required>
                  <option value="">{t('selectProvince')}</option>
                  {provinces.map((item) => <option key={item} value={item}>{t('provinces')[item] || item}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group"><div className="radio-option"><input type="checkbox" id="regAgreement" checked={registration.agreement} onChange={(e) => setRegistration((prev) => ({ ...prev, agreement: e.target.checked }))} required /><label htmlFor="regAgreement">{t('agreement')}</label></div></div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}><button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 3rem', opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}><i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-user-plus'}`} /> {isLoading ? 'Creating Account...' : t('createAccount')}</button></div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}><p>{t('haveAccount')} <Link to="/login" style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>{t('loginHere')}</Link></p></div>
          </form>
        </div>
      </div>
    </section>
  );
}
