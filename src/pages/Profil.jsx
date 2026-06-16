import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const css = `
.profil-hero{background:radial-gradient(700px 380px at 90% -20%,rgba(201,162,75,.2),transparent 60%),var(--cream-2);padding:46px 0;border-bottom:1px solid var(--line)}
.profil-hero h1{font-size:clamp(1.9rem,3.4vw,2.6rem)}
.profil-layout{display:grid;grid-template-columns:220px 1fr;gap:40px;padding:48px 0 96px;align-items:start}
.profil-nav{border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;background:var(--white);position:sticky;top:90px}
.profil-nav a{display:flex;align-items:center;gap:10px;padding:14px 18px;font-size:.95rem;color:var(--muted);border-bottom:1px solid var(--line);cursor:pointer;transition:all .15s}
.profil-nav a:last-child{border:0}
.profil-nav a.on{background:var(--bordeaux-700);color:var(--cream);font-weight:600}
.profil-nav a:hover:not(.on){background:var(--cream-2);color:var(--ink)}
.profil-card{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:32px;box-shadow:var(--shadow-sm);margin-bottom:22px}
.profil-card h2{font-size:1.2rem;margin-bottom:6px}
.profil-card .sub{color:var(--muted);font-size:.93rem;margin-bottom:26px}
.profil-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--bordeaux-700),var(--bordeaux-900));display:grid;place-items:center;font-size:1.8rem;font-weight:600;color:var(--cream);flex-shrink:0}
.profil-info-row{display:flex;align-items:center;gap:18px;margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid var(--line)}
.badge-role{padding:5px 14px;border-radius:999px;font-size:.8rem;font-weight:600;background:rgba(201,162,75,.16);color:#9a7a1e}
.ok-bar{background:rgba(63,125,91,.08);border:1px solid rgba(63,125,91,.25);color:var(--success);border-radius:var(--radius-sm);padding:12px 16px;font-size:.9rem;margin-bottom:18px}
.err-bar{background:rgba(135,42,66,.08);border:1px solid rgba(135,42,66,.25);color:var(--bordeaux-700);border-radius:var(--radius-sm);padding:12px 16px;font-size:.9rem;margin-bottom:18px}
.danger-zone{border:1px solid rgba(135,42,66,.3);border-radius:var(--radius);padding:24px}
.danger-zone h3{color:var(--bordeaux-700);margin-bottom:8px}
@media(max-width:800px){.profil-layout{grid-template-columns:1fr}.profil-nav{position:static;display:flex}.profil-nav a{flex:1;justify-content:center;border-bottom:none;border-right:1px solid var(--line)}.profil-nav a:last-child{border-right:0}}
`

const ROLE_LABEL = { cliente: 'Cliente', salon: 'Gérant salon', admin: 'Administrateur' }

export default function Profil() {
  const { user, profile } = useAuth()
  const [sec, setSec] = useState('infos')

  return (
    <>
      <style>{css}</style>
      <div className="profil-hero">
        <div className="container">
          <p className="eyebrow">Mon compte</p>
          <h1>Mon profil</h1>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>
            Gérez vos informations personnelles et la sécurité de votre compte.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="profil-layout">
          <nav className="profil-nav">
            <a className={sec === 'infos' ? 'on' : ''} onClick={() => setSec('infos')}>Informations</a>
            <a className={sec === 'securite' ? 'on' : ''} onClick={() => setSec('securite')}>Sécurité</a>
          </nav>

          <div>
            {sec === 'infos' && <InfosSection user={user} profile={profile} />}
            {sec === 'securite' && <SecuriteSection user={user} />}
          </div>
        </div>
      </div>
    </>
  )
}

function InfosSection({ user, profile }) {
  const [nom,    setNom]    = useState(profile?.nom ?? '')
  const [tel,    setTel]    = useState(profile?.telephone ?? '')
  const [saving, setSaving] = useState(false)
  const [ok,     setOk]     = useState('')
  const [err,    setErr]    = useState('')

  const initiale = (profile?.nom ?? user?.email ?? '?')[0].toUpperCase()

  async function save(e) {
    e.preventDefault()
    setOk(''); setErr('')
    if (!nom.trim()) { setErr('Le nom est obligatoire.'); return }
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ nom: nom.trim(), telephone: tel.trim() || null })
      .eq('id', user.id)
    setSaving(false)
    if (error) { setErr(error.message); return }
    setOk('Profil mis à jour avec succès.')
    // Recharger la page pour mettre à jour le contexte auth
    setTimeout(() => window.location.reload(), 800)
  }

  return (
    <div className="profil-card">
      <div className="profil-info-row">
        <div className="profil-avatar">{initiale}</div>
        <div>
          <b style={{ fontSize: '1.15rem' }}>{profile?.nom ?? '—'}</b>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem', marginTop: 3 }}>{user?.email}</div>
          <div style={{ marginTop: 8 }}>
            <span className="badge-role">{ROLE_LABEL[profile?.role] ?? profile?.role}</span>
          </div>
        </div>
      </div>

      <h2>Informations personnelles</h2>
      <p className="sub">Ces informations sont utilisées pour vos réservations et les notifications WhatsApp.</p>

      {ok  && <div className="ok-bar">{ok}</div>}
      {err && <div className="err-bar">{err}</div>}

      <form onSubmit={save}>
        <div className="field">
          <label>Nom complet</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Votre nom"
            required
          />
        </div>

        <div className="field">
          <label>
            Numéro WhatsApp
            <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '.88rem', marginLeft: 6 }}>(facultatif)</span>
          </label>
          <input
            type="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="07 00 00 00 00"
          />
          <p style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: 6 }}>
            Utilisé par les salons pour confirmer vos rendez-vous via WhatsApp.
          </p>
        </div>

        <div className="field">
          <label>Adresse email</label>
          <input type="email" value={user?.email ?? ''} disabled style={{ opacity: .6, cursor: 'not-allowed' }} />
          <p style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: 6 }}>L'email ne peut pas être modifié.</p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
          </button>
          <Link to="/mes-reservations" className="btn btn-ghost">Mes réservations</Link>
        </div>
      </form>
    </div>
  )
}

function SecuriteSection({ user }) {
  const [current,  setCurrent]  = useState('')
  const [newPass,  setNewPass]  = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [saving,   setSaving]   = useState(false)
  const [ok,       setOk]       = useState('')
  const [err,      setErr]      = useState('')

  async function changePassword(e) {
    e.preventDefault()
    setOk(''); setErr('')
    if (newPass.length < 6) { setErr('Le nouveau mot de passe doit faire au moins 6 caractères.'); return }
    if (newPass !== confirm)  { setErr('Les mots de passe ne correspondent pas.'); return }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPass })
    setSaving(false)
    if (error) { setErr(error.message); return }
    setOk('Mot de passe modifié avec succès.')
    setCurrent(''); setNewPass(''); setConfirm('')
  }

  return (
    <div className="profil-card">
      <h2>Sécurité du compte</h2>
      <p className="sub">Modifiez votre mot de passe pour sécuriser votre compte.</p>

      {ok  && <div className="ok-bar">{ok}</div>}
      {err && <div className="err-bar">{err}</div>}

      <form onSubmit={changePassword}>
        <div className="field">
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div className="field">
          <label>Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Modification…' : 'Modifier le mot de passe'}
        </button>
      </form>

      <div className="danger-zone" style={{ marginTop: 32 }}>
        <h3>Zone de danger</h3>
        <p style={{ color: 'var(--muted)', fontSize: '.93rem', marginBottom: 16 }}>
          La suppression de votre compte est irréversible. Toutes vos réservations et données seront effacées.
        </p>
        <button
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--bordeaux-600)', borderColor: 'var(--bordeaux-600)' }}
          onClick={() => alert('Contactez contact@beautyconnect.ci pour supprimer votre compte.')}
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  )
}
