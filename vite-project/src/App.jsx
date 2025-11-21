import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import ContactsPage from './pages/ContactsPage';
import Auth from './pages/Auth';
import UserAgreementPage from './pages/userAgreement';
import Catalog from './pages/Catalog';
import Details from './pages/Details';
import Profile from './pages/Profile';
function App() {
  
  return (
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contactinfo" element={<ContactsPage />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/user-agreement" element={<UserAgreementPage />} />
          <Route path='/catalog' element= {<Catalog/>} />
          <Route path="/product/:id" element={<Details />}/>
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/userAgreement" element={<UserAgreementPage />} />
        </Routes>
      </Router>
  )
}

export default App