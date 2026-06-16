import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const css = `
.auth{min-height:100vh;display:grid;grid-template-columns:1fr 1fr}
.auth-visual{background:radial-gradient(600px 400px at 30% 20%,rgba(201,162,75,.3),transparent 60%),linear-gradient(150deg,var(--bordeaux-800),var(--bordeaux-900));color:var(--cream);padding:60px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
.auth-visual h2{color:var(--cream);font-size:2.4rem;max-width:420px}
.auth-visual p{color:rgba(251,247,241,.8);margin-top:16px;max-width:420px;font-size:1.05rem}
.auth-visual .brand b,.auth-visual .brand b span{color:var(--cream)}
.auth-points{display:flex;flex-direction:column;gap:14px}
.auth-points div{display:flex;gap:12px;align-items:center;color:rgba(251,247,241,.9)}
.auth-points .dot{width:8px;height:8px;border-radius:50%;background:var(--gold-400)}
.auth-form{display:flex;align-items:center;justify-content:center;padding:50px}
.auth-card{width:100%;max-width:420px}
.tabs{display:flex;background:var(--cream-2);border-radius:999px;padding:5px;margin-bottom:28px}
.tabs button{flex:1;border:none;background:transparent;font-family:var(--font);font-size:.98rem;font-weight:600;padding:11px;border-radius:999px;cursor:pointer;color:var(--muted);transition:all .2s}
.tabs button.on{background:var(--white);color:var(--bordeaux-700);box-shadow:var(--shadow-sm)}
.social{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:22px}
.or{display:flex;align-items:center;gap:14px;color:var(--muted);font-size:.85rem;margin-bottom:22px}
.or::before,.or::after{content:"";flex:1;height:1px;background:var(--line)}
.seg{display:flex;gap:8px;margin-bottom:18px}
.seg .chip{flex:1;justify-content:center}
.err{background:rgba(135,42,66,.08);border:1px solid rgba(135,42,66,.25);color:var(--bordeaux-700);border-radius:var(--radius-sm);padding:12px 16px;font-size:.9rem;margin-bottom:18px}
.ok{background:rgba(63,125,91,.08);border:1px solid rgba(63,125,91,.25);color:var(--success);border-radius:var(--radius-sm);padding:12px 16px;font-size:.9rem;margin-bottom:18px}
@media (max-width:900px){.auth{grid-template-columns:1fr}.auth-visual{display:none}}
`

export default function Login() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const [tab, setTab]       = useState(params.get('mode') === 'signup' || params.get('profil') === 'salon' ? 'signup' : 'login')
  const [profil, setProfil] = useState(params.get('profil') === 'salon' ? 'salon' : 'cliente')
  const [nom,  setNom]  = useState('')
  const [tel,  setTel]  = useState('')
  const [email, setEmail]   = useState('')
  const [password, setPass] = useState('')
  const [loading, setLoad]    = useState(false)
  const [error, setError]     = useState('')
  const [success, setSucc]    = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [resending, setResending]       = useState(false)
  const [resent, setResent]             = useState(false)

  const isLogin = tab === 'login'

  function switchTab(t) { setTab(t); setError(''); setSucc('') }

  async function submit(e) {
    e.preventDefault()
    setError(''); setSucc('')
    setLoad(true)
    try {
      if (isLogin) {
        const { error } = await signIn({ email, password })
        if (error) throw error
        navigate(profil === 'salon' ? '/espace-salon' : '/')
      } else {
        const { error } = await signUp({ email, password, nom, role: profil, telephone: tel })
        if (error) throw error
        setPendingEmail(email)
        setSucc('Compte créé ! Vérifiez votre email pour confirmer votre inscription.')
      }
    } catch (err) {
      const msgs = {
        'Invalid login credentials': 'Email ou mot de passe incorrect.',
        'Email not confirmed': 'Confirmez votre email avant de vous connecter.',
        'User already registered': 'Un compte existe déjà avec cet email.',
        'Password should be at least 6 characters': 'Le mot de passe doit faire au moins 6 caractères.',
      }
      setError(msgs[err.message] || err.message)
    } finally {
      setLoad(false)
    }
  }

  async function handleGoogle() {
    await signInWithGoogle()
  }

  async function handleResend() {
    if (!pendingEmail) return
    setResending(true)
    await supabase.auth.resend({ type: 'signup', email: pendingEmail })
    setResending(false)
    setResent(true)
    setTimeout(() => setResent(false), 4000)
  }

  return (
    <>
      <style>{css}</style>
      <header className="nav"><div className="nav-inner">
        <Link className="brand" to="/"><span className="mark">BC</span><b>Beauty<span>Connect</span></b></Link>
        <div className="nav-actions"><Link to="/" className="btn btn-ghost btn-sm">Retour à l'accueil</Link></div>
      </div></header>

      <div className="auth">
        <div className="auth-visual">
          <Link className="brand" to="/"><span className="mark">BC</span><b>Beauty<span>Connect</span></b></Link>
          <div>
            <h2>Votre beauté, sur rendez-vous.</h2>
            <p>Réservez vos prestations en quelques secondes et gérez vos rendez-vous depuis un seul espace.</p>
          </div>
          <div className="auth-points">
            <div><span className="dot" />Réservation immédiate, sans attente</div>
            <div><span className="dot" />Prix transparents avant déplacement</div>
            <div><span className="dot" />Rappels par SMS, email et WhatsApp</div>
          </div>
        </div>

        <div className="auth-form">
          <div className="auth-card">
            <div className="tabs">
              <button className={isLogin ? 'on' : ''} onClick={() => switchTab('login')}>Connexion</button>
              <button className={!isLogin ? 'on' : ''} onClick={() => switchTab('signup')}>Inscription</button>
            </div>

            <div className="social">
              <button className="btn btn-light" onClick={handleGoogle}>Google</button>
              <button className="btn btn-light" disabled style={{ opacity: .5 }}>Facebook</button>
            </div>
            <div className="or">ou avec votre email</div>

            {!isLogin && (
              <div className="seg">
                <span className={'chip' + (profil === 'cliente' ? ' active' : '')} onClick={() => setProfil('cliente')}>Cliente</span>
                <span className={'chip' + (profil === 'salon' ? ' active' : '')} onClick={() => setProfil('salon')}>Salon</span>
              </div>
            )}

            {error && <div className="err">{error}</div>}
            {success && (
              <div className="ok">
                <div>{success}</div>
                {pendingEmail && (
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '.88rem' }}>Email non reçu ?</span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '5px 14px', fontSize: '.85rem' }}
                      onClick={handleResend}
                      disabled={resending}
                    >
                      {resending ? 'Envoi…' : resent ? 'Email renvoyé !' : 'Renvoyer l\'email'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={submit}>
              {!isLogin && (
                <>
                  <div className="field">
                    <label>{profil === 'salon' ? 'Nom du salon' : 'Nom complet'}</label>
                    <input type="text" placeholder={profil === 'salon' ? 'Maison Awa' : 'Aïcha Koné'} value={nom} onChange={(e) => setNom(e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>
                      Numéro WhatsApp
                      <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '.88rem', marginLeft: 6 }}>(facultatif)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="07 00 00 00 00"
                      value={tel}
                      onChange={(e) => setTel(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="vous@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="field">
                <label>Mot de passe</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPass(e.target.value)} required minLength={6} />
              </div>
              {isLogin && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
                  <Link to="/mot-de-passe-oublie" style={{ color: 'var(--bordeaux-700)', fontSize: '.9rem' }}>Mot de passe oublié ?</Link>
                </div>
              )}
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? 'Chargement…' : isLogin ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>

            <p className="text-muted" style={{ textAlign: 'center', marginTop: 20, fontSize: '.92rem' }}>
              {isLogin ? 'Nouvelle sur BeautyConnect ? ' : 'Vous avez déjà un compte ? '}
              <a href="#" onClick={(e) => { e.preventDefault(); switchTab(isLogin ? 'signup' : 'login') }} style={{ color: 'var(--bordeaux-700)', fontWeight: 600 }}>
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
