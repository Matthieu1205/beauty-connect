import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function MotDePasseOublie() {
  const navigate  = useNavigate()
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [err,     setErr]     = useState('')

  async function submit(e) {
    e.preventDefault()
    setErr('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/#/reinitialiser-mot-de-passe',
    })
    setLoading(false)
    if (error) { setErr(error.message); return }
    setSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--cream-2)', padding: 24 }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '42px 44px', maxWidth: 420, width: '100%', boxShadow: 'var(--shadow)' }}>

        <Link className="brand" to="/" style={{ marginBottom: 28, display: 'inline-flex' }}>
          <span className="mark">BC</span><b>Beauty<span>Connect</span></b>
        </Link>

        {!sent ? (
          <>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Mot de passe oublié</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 26 }}>
              Entrez votre adresse email. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            {err && (
              <div style={{ background: 'rgba(135,42,66,.08)', border: '1px solid rgba(135,42,66,.25)', color: 'var(--bordeaux-700)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '.9rem', marginBottom: 18 }}>
                {err}
              </div>
            )}

            <form onSubmit={submit}>
              <div className="field">
                <label>Adresse email</label>
                <input
                  type="email"
                  placeholder="vous@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? 'Envoi en cours…' : 'Envoyer le lien de réinitialisation'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '.92rem', color: 'var(--muted)' }}>
              <Link to="/connexion" style={{ color: 'var(--bordeaux-700)', fontWeight: 600 }}>Retour à la connexion</Link>
            </p>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,var(--gold-400),var(--gold-500))', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#3D0E1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <path d="m22 6-10 7L2 6"/>
              </svg>
            </div>
            <h2 style={{ marginBottom: 10 }}>Email envoyé</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
              Un lien de réinitialisation a été envoyé à <b>{email}</b>.<br />
              Vérifiez votre boîte de réception (et vos spams).
            </p>
            <Link to="/connexion" className="btn btn-primary btn-block">Retour à la connexion</Link>
          </div>
        )}
      </div>
    </div>
  )
}
