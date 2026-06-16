import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const css = `
.modal-overlay{position:fixed;inset:0;background:rgba(61,14,28,.55);z-index:200;display:grid;place-items:center;padding:20px;backdrop-filter:blur(4px)}
.modal{background:var(--white);border-radius:var(--radius-lg);padding:36px;max-width:480px;width:100%;box-shadow:var(--shadow)}
.modal h2{font-size:1.5rem;margin-bottom:6px}
.modal .sub{color:var(--muted);font-size:.95rem;margin-bottom:28px}
.stars-pick{display:flex;gap:10px;margin-bottom:22px}
.stars-pick button{background:none;border:none;font-size:2.2rem;cursor:pointer;padding:0;line-height:1;transition:transform .15s;color:var(--line)}
.stars-pick button.on{color:var(--star)}
.stars-pick button:hover{transform:scale(1.2)}
.modal-actions{display:flex;gap:12px;margin-top:24px}
.modal-success{text-align:center;padding:16px 0}
.modal-success .check{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--gold-400),var(--gold-500));display:grid;place-items:center;margin:0 auto 16px}
`

export default function ReviewModal({ booking, onClose, onDone }) {
  const { user, profile } = useAuth()
  const [note,    setNote]    = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [saving,  setSaving]  = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')

  const salon = booking.salons
  const svc   = booking.services

  async function submit() {
    if (note === 0) { setError('Choisissez une note.'); return }
    setSaving(true)
    setError('')

    const { error: err } = await supabase.from('reviews').insert({
      salon_id:    salon.id,
      client_id:   user.id,
      booking_id:  booking.id,
      note,
      commentaire: comment.trim() || null,
    })

    setSaving(false)
    if (err) {
      setError(err.code === '23505' ? 'Vous avez déjà laissé un avis pour ce rendez-vous.' : err.message)
      return
    }
    setDone(true)
    onDone?.()
  }

  const displayed = hovered || note

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{css}</style>
      <div className="modal">
        {!done ? (
          <>
            <h2>Votre avis</h2>
            <p className="sub">{salon?.nom} · {svc?.nom}</p>

            <label>Note</label>
            <div className="stars-pick">
              {[1,2,3,4,5].map((v) => (
                <button
                  key={v}
                  className={v <= displayed ? 'on' : ''}
                  onMouseEnter={() => setHovered(v)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setNote(v)}
                >★</button>
              ))}
            </div>

            <div className="field">
              <label>Commentaire <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(facultatif)</span></label>
              <textarea
                rows={4}
                placeholder="Décrivez votre expérience : accueil, qualité du travail, respect des horaires…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
              />
              <div style={{ textAlign: 'right', fontSize: '.8rem', color: 'var(--muted)', marginTop: 4 }}>{comment.length}/500</div>
            </div>

            {error && <p style={{ color: 'var(--bordeaux-600)', fontSize: '.9rem', marginBottom: 12 }}>{error}</p>}

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
              <button className="btn btn-gold btn-block" onClick={submit} disabled={saving}>
                {saving ? 'Envoi…' : 'Publier mon avis'}
              </button>
            </div>
          </>
        ) : (
          <div className="modal-success">
            <div className="check">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3D0E1C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h2>Merci pour votre avis !</h2>
            <p style={{ color: 'var(--muted)', margin: '10px 0 24px' }}>
              Votre avis aide les autres clientes à choisir le bon salon.
            </p>
            <button className="btn btn-primary btn-block" onClick={onClose}>Fermer</button>
          </div>
        )}
      </div>
    </div>
  )
}
