import { Link } from 'react-router-dom';
import { provinces } from '../constants';

export default function FindDonorPage({ currentUser, t, searchData, setSearchData, onSearch, matches }) {
  return (
    <section className="page-container active">
      <div className="matching-container">
        <div className="section-title"><h2>{t('findDonorTitle')}</h2></div>

        {!currentUser ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            <i className="fas fa-lock" style={{ fontSize: '3rem', color: 'var(--gray-color)', marginBottom: '1rem' }} />
            <h3>{t('loginRequiredTitle')}</h3>
            <p>{t('loginRequired')}</p>
            <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>{t('loginNow')}</Link>
          </div>
        ) : (
          <>
            <div className="matching-form">
              <h3>{t('searchCriteria')}</h3>
              <form onSubmit={onSearch}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bloodType">{t('patientBloodType')}</label>
                    <select id="bloodType" className="form-control form-select" value={searchData.bloodType} onChange={(e) => setSearchData((prev) => ({ ...prev, bloodType: e.target.value }))} required>
                      <option value="">{t('selectBloodType')}</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">{t('preferredDonorLocation')}</label>
                    <select id="location" className="form-control form-select" value={searchData.location} onChange={(e) => setSearchData((prev) => ({ ...prev, location: e.target.value }))}>
                      <option value="">{t('anywhereSriLanka')}</option>
                      {provinces.map((item) => <option key={item} value={item}>{t('provinces')[item] || item}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ageRange">{t('donorAgeRange')}</label>
                    <select id="ageRange" className="form-control form-select" value={searchData.ageRange} onChange={(e) => setSearchData((prev) => ({ ...prev, ageRange: e.target.value }))}>
                      <option value="">Any Age Range</option>
                      {['18-30', '31-40', '41-50', '51-60'].map((item) => <option key={item} value={item}>{item} years</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 3rem' }}>
                    <i className="fas fa-search" /> {t('searchDonors')}
                  </button>
                </div>
              </form>
            </div>

            <div className="match-results" style={{ display: 'block' }}>
              <h3>{t('potentialMatches')}</h3>
              <p>{t('matchesFoundPrefix')} <span>{matches.length}</span> {t('matchesFoundSuffix')}</p>
              <div>
                {matches.length === 0 ? (
                  <div className="match-item"><div className="match-info"><h4>{t('noMatches')}</h4></div></div>
                ) : (
                  matches.map((donor) => (
                    <div className="match-item" key={donor.id || donor.name}>
                      <div className="match-info">
                        <h4>{donor.name}</h4>
                        <p><strong>{t('bloodType')}:</strong> {donor.bloodType} | <strong>{t('age')}:</strong> {donor.age}</p>
                        <p><strong>{t('location')}:</strong> {t('provinces')[donor.location] || donor.location} | <strong>{t('status')}:</strong> {donor.status}</p>
                      </div>
                      <div className="match-score">{donor.matchScore || 80}%</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
