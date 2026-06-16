import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ReinitialiserMotDePasse() {
  const navigate  = useNavigate()
  const [ready,   setReady]   = useState(false)
  const [pass,    setPass]    = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving,  setSaving]  = useState(false)
  const [ok,      setOk]      = useState(false)
  const [err,     setErr]     = useState('')

  // Supabase envoie les tokens dans l'URL hash — écouter l'événement PASSWORD_RECOVERY
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function submit(e) {
    e.preventDefault()
    setErr('')
    if (pass.length < 6)   { setErr('Le mot de passe doit faire au moins 6 caractères.'); return }
    if (pass !== confirm)  { setErr('Les mots de passe ne correspondent pas.'); return }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pass })
    setSaving(false)
    if (error) { setErr(error.message); return }
    setOk(true)
    setTimeout(() => navigate('/connexion'), 2500)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--cream-2)', padding: 24 }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '42px 44px', maxWidth: 420, width: '100%', boxShadow: 'var(--shadow)' }}>

        <Link className="brand" to="/" style={{ marginBottom: 28, display: 'inline-flex' }}>
          <span className="mark">BC</span><b>Beauty<span>Connect</span></b>
        </Link>

        {ok ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,var(--gold-400),var(--gold-500))', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#3D0E1C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <h2 style={{ marginBottom: 10 }}>Mot de passe modifié</h2>
            <p style={{ color: 'var(--muted)' }}>Redirection vers la connexion…</p>
          </div>
        ) : !ready ? (
          <>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Lien invalide</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
              Ce lien de réinitialisation est invalide ou a expiré. Faites une nouvelle demande.
            </p>
            <Link to="/mot-de-passe-oublie" className="btn btn-primary btn-block">Nouvelle demande</Link>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Nouveau mot de passe</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 26 }}>Choisissez un nouveau mot de passe pour votre compte.</p>

            {err && (
              <div style={{ background: 'rgba(135,42,66,.08)', border: '1px solid rgba(135,42,66,.25)', color: 'var(--bordeaux-700)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '.9rem', marginBottom: 18 }}>
                {err}
              </div>
            )}

            <form onSubmit={submit}>
              <div className="field">
                <label>Nouveau mot de passe</label>
                <input type="password" placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} required minLength={6} />
              </div>
              <div className="field">
                <label>Confirmer le mot de passe</label>
                <input type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
                {saving ? 'Modification…' : 'Définir le nouveau mot de passe'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
