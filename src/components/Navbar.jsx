import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const css = `
.nav-mobile{display:none}
@media(max-width:700px){
  .nav-mobile{display:flex;flex-direction:column;background:var(--white);border-top:1px solid var(--line);padding:12px 24px 20px;gap:4px}
  .nav-mobile a{padding:13px 0;font-size:1rem;color:var(--ink);border-bottom:1px solid var(--line);opacity:.85}
  .nav-mobile a:last-child{border-bottom:none}
  .nav-mobile a.active{color:var(--bordeaux-700);font-weight:600;opacity:1}
  .nav-mobile-actions{display:flex;flex-direction:column;gap:10px;margin-top:16px}
}
`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  function close() { setOpen(false) }

  async function handleSignOut() {
    await signOut()
    close()
    navigate('/')
  }

  return (
    <header className="nav">
      <style>{css}</style>
      <div className="nav-inner">
        <Link className="brand" to="/" onClick={close}>
          <span className="mark">BC</span><b>Beauty<span>Connect</span></b>
        </Link>

        {/* Navigation desktop */}
        <nav className="nav-links">
          <NavLink to="/recherche">Salons</NavLink>
          <NavLink to="/diagnostic">Diagnostic capillaire</NavLink>
          {profile?.role === 'salon' && <NavLink to="/espace-salon">Espace salon</NavLink>}
          {profile?.role === 'admin' && <NavLink to="/admin">Administration</NavLink>}
        </nav>

        {/* Actions desktop */}
        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/mes-reservations" className="btn btn-ghost btn-sm">Mes RDV</Link>
              <Link to="/profil" style={{ fontSize: '.9rem', color: 'var(--muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'none' }}>
                {profile?.nom ?? user.email}
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/inscrire-mon-salon" className="btn btn-ghost btn-sm" style={{ color: 'var(--bordeaux-700)', borderColor: 'var(--bordeaux-700)' }}>Inscrire mon salon</Link>
              <Link to="/connexion" className="btn btn-ghost btn-sm">Se connecter</Link>
              <Link to="/recherche" className="btn btn-primary btn-sm">Réserver</Link>
            </>
          )}
          <button className="btn btn-ghost btn-sm nav-toggle" onClick={() => setOpen(!open)}>
            {open ? 'Fermer' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Menu mobile — rendu en dehors de nav-inner pour éviter l'écrasement flex */}
      {open && (
        <div className="nav-mobile">
          <NavLink to="/recherche" onClick={close}>Salons</NavLink>
          <NavLink to="/diagnostic" onClick={close}>Diagnostic capillaire</NavLink>
          {user && <NavLink to="/mes-reservations" onClick={close}>Mes réservations</NavLink>}
          {user && <NavLink to="/profil" onClick={close}>Mon profil</NavLink>}
          {profile?.role === 'salon' && <NavLink to="/espace-salon" onClick={close}>Espace salon</NavLink>}
          {profile?.role === 'admin' && <NavLink to="/admin" onClick={close}>Administration</NavLink>}
          {!user && <NavLink to="/inscrire-mon-salon" onClick={close}>Inscrire mon salon</NavLink>}
          <div className="nav-mobile-actions">
            {user ? (
              <button className="btn btn-ghost btn-block" onClick={handleSignOut}>Déconnexion</button>
            ) : (
              <>
                <Link to="/connexion" className="btn btn-ghost btn-block" onClick={close}>Se connecter</Link>
                <Link to="/recherche" className="btn btn-primary btn-block" onClick={close}>Réserver</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
