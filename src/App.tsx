import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Book from '@/pages/Book';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Account from '@/pages/Account';
import CityDetail from '@/pages/CityDetail';
import LocationDetail from '@/pages/LocationDetail';
import PujaDetail from '@/pages/PujaDetail';
import MainPuja from './pages/MainPuja';
import MainLocation from './pages/MainLocation';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <Navbar  countries={[]} cities={[]} pujas={[]}/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Book />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/city/:slug" element={<CityDetail />} />
            <Route path="/locations/:slug" element={<LocationDetail />} />
            <Route path="/pujas/MainPuja" element={<MainPuja />} />
            <Route path="/pujas/:slug" element={<PujaDetail />} />
            <Route path="/MainLocation" element={<MainLocation />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
