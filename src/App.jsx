import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Search from './pages/Search'
import SalonDetail from './pages/SalonDetail'
import Diagnostic from './pages/Diagnostic'
import Login from './pages/Login'
import MesReservations from './pages/MesReservations'
import SalonDashboard from './pages/SalonDashboard'
import Admin from './pages/Admin'
import InscriptionSalon from './pages/InscriptionSalon'
import Legales from './pages/Legales'
import Profil from './pages/Profil'
import MotDePasseOublie from './pages/MotDePasseOublie'
import ReinitialiserMotDePasse from './pages/ReinitialiserMotDePasse'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function NotFound() {
  return (
    <Shell>
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <p style={{ fontSize: '5rem', color: 'var(--bordeaux-700)', lineHeight: 1, fontWeight: 600, margin: 0 }}>404</p>
        <h2 style={{ marginTop: 16 }}>Page introuvable</h2>
        <p style={{ color: 'var(--muted)', margin: '14px auto 28px', maxWidth: 400, fontSize: '1.05rem' }}>
          Cette page n'existe pas ou a été déplacée. Revenez à l'accueil pour continuer.
        </p>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    </Shell>
  )
}

function Shell({ children, bare = false }) {
  return (
    <>
      {!bare && <Navbar />}
      {children}
      {!bare && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Shell><Home /></Shell>} />
        <Route path="/recherche" element={<Shell><Search /></Shell>} />
        <Route path="/salon/:id" element={<Shell><SalonDetail /></Shell>} />
        <Route path="/diagnostic" element={<Shell><Diagnostic /></Shell>} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
        <Route path="/reinitialiser-mot-de-passe" element={<ReinitialiserMotDePasse />} />
        <Route path="/mes-reservations" element={
          <ProtectedRoute><Shell><MesReservations /></Shell></ProtectedRoute>
        } />
        <Route path="/espace-salon" element={
          <ProtectedRoute role="salon"><SalonDashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><Admin /></ProtectedRoute>
        } />
        <Route path="/profil" element={
          <ProtectedRoute><Shell><Profil /></Shell></ProtectedRoute>
        } />
        <Route path="/inscrire-mon-salon" element={<Shell><InscriptionSalon /></Shell>} />
        <Route path="/legales" element={<Shell><Legales /></Shell>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  )
}
