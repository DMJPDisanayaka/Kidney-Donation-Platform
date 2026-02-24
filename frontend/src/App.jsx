import { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import '../style.css';
import { API_BASE_URL, bloodCompatibility, i18n } from './constants';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FindDonorPage from './pages/FindDonorPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';

const defaultRegistration = {
  userType: 'patient',
  fullName: '',
  nic: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  password: '',
  confirmPassword: '',
  bloodType: '',
  location: '',
  agreement: false
};

const defaultSearch = {
  bloodType: '',
  location: '',
  ageRange: '41-50',
  urgency: 'high'
};

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

export default function App() {
  const [language, setLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [registration, setRegistration] = useState(defaultRegistration);
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [loginError, setLoginError] = useState(null);
  const [searchData, setSearchData] = useState(defaultSearch);
  const [matches, setMatches] = useState([]);
  const [contactData, setContactData] = useState({ name: '', email: '', inquiryType: '', message: '' });

  useEffect(() => {
    const today = new Date();
    const defaultDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
    setRegistration((prev) => ({ ...prev, dateOfBirth: defaultDate.toISOString().slice(0, 10) }));
    checkLoginStatus();
  }, []);

  const t = (key) => i18n[language]?.[key] || i18n.en[key] || key;

  async function checkLoginStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, { method: 'GET', credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCurrentUser(data.data.user);
          return;
        }
      }
    } catch {
      // no-op
    }

    const localUser = localStorage.getItem('kidneyConnectCurrentUser');
    if (localUser) {
      try {
        setCurrentUser(JSON.parse(localUser));
      } catch {
        localStorage.removeItem('kidneyConnectCurrentUser');
      }
    }
  }

  const onRegister = async () => {
    if (registration.password !== registration.confirmPassword) return { ok: false, message: t('passwordMismatch') };
    if (registration.userType === 'donor') {
      const age = calculateAge(registration.dateOfBirth);
      if (age < 18 || age > 60) return { ok: false, message: t('donorAgeError') };
    }

    const payload = {
      userType: registration.userType,
      fullName: registration.fullName,
      nic: registration.nic,
      email: registration.email,
      phone: registration.phone,
      dateOfBirth: registration.dateOfBirth,
      gender: registration.gender,
      password: registration.password,
      bloodType: registration.bloodType,
      location: registration.location
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      // Check if response is ok, if not throw error with status
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('JSON parse error:', e);
        return { ok: false, message: 'Server error: Invalid response format.' };
      }
      
      if (!data.success) {
        return { 
          ok: false, 
          message: data.message || t('registerFailed'),
          errorType: data.errorType || 'UNKNOWN'
        };
      }

      setCurrentUser(data.data.user);
      setRegistration(defaultRegistration);
      return { ok: true, next: payload.userType === 'patient' ? '/find-donor' : '/' };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        ok: false, 
        message: `Registration failed: ${error.message}. Please check your connection and try again.`
      };
    }
  };

  const onLogin = async () => {
    setLoginError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });
      const data = await response.json();
      if (!data.success) {
        setLoginError(data.message || t('loginFailed'));
        return { ok: false, message: data.message || t('loginFailed') };
      }
      setCurrentUser(data.data.user);
      setLoginData({ identifier: '', password: '' });
      setLoginError(null);
      const type = data.data.user.user_type || data.data.user.userType;
      return { ok: true, next: type === 'patient' ? '/find-donor' : '/' };
    } catch {
      const users = JSON.parse(localStorage.getItem('kidneyConnectUsers') || '[]');
      const demoUser = users.find((item) =>
        (item.email === loginData.identifier || item.nic === loginData.identifier) && item.password === loginData.password
      );
      if (!demoUser) {
        const errorMsg = t('invalidCredentials');
        setLoginError(errorMsg);
        return { ok: false, message: errorMsg };
      }
      setCurrentUser(demoUser);
      localStorage.setItem('kidneyConnectCurrentUser', JSON.stringify(demoUser));
      setLoginData({ identifier: '', password: '' });
      setLoginError(null);
      const type = demoUser.user_type || demoUser.userType;
      return { ok: true, next: type === 'patient' ? '/find-donor' : '/' };
    }
  };

  const onLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {
      // no-op
    }
    setCurrentUser(null);
    localStorage.removeItem('kidneyConnectCurrentUser');
    setLoginError(null);
  };

  const fallbackDonorMatching = () => {
    const donors = JSON.parse(localStorage.getItem('kidneyConnectDonors') || 'null') || [
      { id: 1, name: 'Anonymous Donor 124', age: 32, bloodType: 'O+', location: 'Western', status: 'Available', matchScore: 94 },
      { id: 2, name: 'Anonymous Donor 256', age: 28, bloodType: 'O-', location: 'Central', status: 'Available', matchScore: 87 },
      { id: 3, name: 'Anonymous Donor 189', age: 41, bloodType: 'A+', location: 'Southern', status: 'Available', matchScore: 82 }
    ];

    const [minAge, maxAge] = searchData.ageRange.split('-').map(Number);
    const filtered = donors
      .filter((donor) => (bloodCompatibility[searchData.bloodType] || []).includes(donor.bloodType))
      .filter((donor) => !searchData.location || donor.location === searchData.location)
      .filter((donor) => donor.age >= minAge && donor.age <= maxAge)
      .filter((donor) => donor.status === 'Available')
      .sort((a, b) => b.matchScore - a.matchScore);

    setMatches(filtered);
  };

  const onSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/donors/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(searchData)
      });
      const data = await response.json();
      if (!data.success) throw new Error('search_failed');
      setMatches(data.data.matches || []);
    } catch {
      fallbackDonorMatching();
    }
  };

  const onContact = (event) => {
    event.preventDefault();
    alert(t('contactThanks'));
    setContactData({ name: '', email: '', inquiryType: '', message: '' });
  };

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              language={language}
              setLanguage={setLanguage}
              currentUser={currentUser}
              onLogout={onLogout}
              t={t}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          }
        >
          <Route index element={<HomePage t={t} />} />
          <Route path="about" element={<AboutPage t={t} />} />
          <Route
            path="find-donor"
            element={<FindDonorPage currentUser={currentUser} t={t} searchData={searchData} setSearchData={setSearchData} onSearch={onSearch} matches={matches} />}
          />
          <Route path="register" element={<RegisterPage registration={registration} setRegistration={setRegistration} onRegister={onRegister} t={t} />} />
          <Route path="login" element={<LoginPage loginData={loginData} setLoginData={setLoginData} onLogin={onLogin} loginError={loginError} setLoginError={setLoginError} t={t} />} />
          <Route path="faq" element={<FaqPage t={t} />} />
          <Route path="contact" element={<ContactPage contactData={contactData} setContactData={setContactData} onContact={onContact} t={t} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
