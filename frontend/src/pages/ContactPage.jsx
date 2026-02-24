import { useState } from 'react';

export default function ContactPage({ contactData, setContactData, onContact, t }) {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await onContact();
    setIsLoading(false);
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  return (
      <div className="auth-container">
        <div className="section-title">
          <h2>{t('contactTitle')}</h2>
          <p>{t('contactDesc')}</p>
        </div>

        {/* Success Message */}
        {contactSubmitted && (
          <div style={{
            backgroundColor: '#efe',
            border: '2px solid #3c3',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#030',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-check-circle" /> Success!
            </div>
            <div>✅ {t('contactThanks')}</div>
          </div>
        )}

        <div className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <h3><i className="fas fa-map-marker-alt" /> {t('officeTitle')}</h3>
              <p>{t('officeAddress')}</p>
            </div>
            <div className="form-group">
              <h3><i className="fas fa-phone" /> {t('contactNumbersTitle')}</h3>
              <p>{t('contactNumbers')}</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <h3><i className="fas fa-envelope" /> {t('emailAddressesTitle')}</h3>
              <p>{t('emailAddresses')}</p>
            </div>
            <div className="form-group">
              <h3><i className="fas fa-clock" /> {t('officeHoursTitle')}</h3>
              <p>{t('officeHours')}</p>
            </div>
          </div>

          <div className="form-group">
            <h3>{t('sendMessage')}</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><input type="text" className="form-control" placeholder={t('yourName')} value={contactData.name} onChange={(e) => setContactData((prev) => ({ ...prev, name: e.target.value }))} required /></div>
              <div className="form-group"><input type="email" className="form-control" placeholder={t('yourEmail')} value={contactData.email} onChange={(e) => setContactData((prev) => ({ ...prev, email: e.target.value }))} required /></div>
            </div>

            <div className="form-group">
              <select className="form-control form-select" value={contactData.inquiryType} onChange={(e) => setContactData((prev) => ({ ...prev, inquiryType: e.target.value }))} required>
                <option value="">{t('inquiryType')}</option>
                <option value="patient">{t('inquiryPatient')}</option>
                <option value="donor">{t('inquiryDonor')}</option>
                <option value="technical">{t('inquiryTech')}</option>
                <option value="medical">{t('inquiryMedical')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>

            <div className="form-group"><textarea className="form-control" rows="5" placeholder={t('yourMessage')} value={contactData.message} onChange={(e) => setContactData((prev) => ({ ...prev, message: e.target.value }))} required /></div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}><button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 3rem', opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}><i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} /> {isLoading ? 'Sending...' : t('sendMessage')}</button></div>
          </form>
        </div>
      </div>
    );
}
