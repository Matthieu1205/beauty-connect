import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fcfa, starsStr } from '../data/salons'
import { mapEmbedLatLng, gmapsDirURL, yangoURL } from '../lib/maps'
import { useSalon } from '../hooks/useSalons'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Thumb from '../components/Thumb'

const css = `
.gallery{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:12px;height:380px;margin-top:28px}
.gallery .g{border-radius:var(--radius);position:relative;overflow:hidden}
.gallery .g:first-child{grid-row:1/3}
.gallery .gtag{position:absolute;left:14px;bottom:14px;background:rgba(61,14,28,.78);color:var(--cream);padding:6px 13px;border-radius:999px;font-size:.78rem;font-weight:600;z-index:2}
.salon-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-top:30px}
.salon-head .meta{color:var(--muted);margin-top:8px}
.salon-head .meta .rating{margin-right:14px}
.slayout{display:grid;grid-template-columns:1fr 380px;gap:40px;align-items:start;padding:36px 0 80px}
.panel{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:26px;box-shadow:var(--shadow-sm);margin-bottom:26px}
.panel h3{margin-bottom:14px}
.presta-line{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid var(--line)}
.presta-line:last-child{border:0}
.presta-line .info b{font-size:1.05rem}.presta-line .info span{color:var(--muted);font-size:.9rem;display:block}
.presta-line .price{font-weight:600;color:var(--bordeaux-700);margin-right:14px}
.hours{display:grid;grid-template-columns:1fr 1fr;gap:8px 30px}
.hours div{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line);font-size:.95rem}
.avis{padding:18px 0;border-bottom:1px solid var(--line)}.avis:last-child{border:0}
.avis .top{display:flex;justify-content:space-between}.avis .who{font-weight:600}.avis .stars{color:var(--star);letter-spacing:1px}
.avis p{margin-top:8px}.avis small{color:var(--muted)}
.ratings-summary{display:flex;gap:30px;align-items:center;flex-wrap:wrap;margin-bottom:10px}
.big-note{font-size:3rem;font-weight:600;color:var(--bordeaux-700);line-height:1}
.bars{flex:1;min-width:220px}
.bar-row{display:flex;align-items:center;gap:10px;font-size:.88rem;margin:5px 0}
.bar{flex:1;height:8px;border-radius:999px;background:var(--cream-2);overflow:hidden}
.bar i{display:block;height:100%;background:linear-gradient(90deg,var(--gold-400),var(--bordeaux-700))}
.booking{position:sticky;top:90px;background:var(--white);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.bk-head{background:linear-gradient(135deg,var(--bordeaux-700),var(--bordeaux-900));color:var(--cream);padding:22px 24px}
.bk-head b{font-size:1.2rem}.bk-body{padding:24px}
.steps-dots{display:flex;gap:8px;margin-bottom:20px}
.steps-dots span{flex:1;height:5px;border-radius:999px;background:var(--cream-2)}
.steps-dots span.on{background:var(--gold-500)}
.opt-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.opt{border:1px solid var(--line);border-radius:var(--radius-sm);padding:11px;text-align:center;cursor:pointer;font-size:.92rem;transition:all .15s}
.opt:hover{border-color:var(--gold-500)}.opt.sel{background:var(--bordeaux-700);color:var(--cream);border-color:var(--bordeaux-700)}
.summary-line{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--line);font-size:.95rem}
.summary-line.total{border:0;font-weight:600;font-size:1.1rem;color:var(--bordeaux-700);padding-top:14px}
.confirm{text-align:center;padding:14px 0}
.confirm .check{width:64px;height:64px;border-radius:50%;margin:0 auto 16px;display:grid;place-items:center;background:linear-gradient(135deg,var(--gold-400),var(--gold-500))}
.login-prompt{background:var(--cream-2);border-radius:var(--radius-sm);padding:20px;text-align:center;margin-top:16px}
.login-prompt p{color:var(--muted);font-size:.95rem;margin-bottom:14px}
.skel{background:linear-gradient(90deg,var(--cream-2) 25%,var(--line) 50%,var(--cream-2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:var(--radius)}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@media (max-width:900px){.slayout{grid-template-columns:1fr}.booking{position:static}.gallery{grid-template-columns:1fr 1fr;height:auto;grid-auto-rows:140px}.gallery .g:first-child{grid-row:auto;grid-column:1/3;height:200px}}
`

const HEURES = ['09:00','10:30','12:00','14:30','16:00','17:30']
const JOURS  = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
const MOIS_FR = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc']

function nextDays(n = 6) {
  const today = new Date()
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return {
      label: JOURS[d.getDay()] + ' ' + d.getDate(),
      full:  JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS_FR[d.getMonth()],
      iso:   d.toISOString().slice(0, 10),
    }
  })
}
const DATES = nextDays()

const GAL_TAGS = ['Salon','Tresses','Locks','Coloration','Réalisation']

export default function SalonDetail() {
  const { id }              = useParams()
  const navigate            = useNavigate()
  const { user }            = useAuth()
  const { salon: s, services, reviews, loading } = useSalon(id)

  const [step,   setStep]   = useState(1)
  const [presta, setPresta] = useState(null)
  const [prix,   setPrix]   = useState(0)
  const [serviceId, setSvcId] = useState(null)
  const [date,   setDate]   = useState(null)
  const [dateIso, setDateIso] = useState(null)
  const [heure,  setHeure]  = useState(null)
  const [express, setExpress] = useState(false)
  const [saving, setSaving] = useState(false)
  const [bookingId, setBookingId] = useState(null)

  const surcharge  = express ? Math.round(prix * 0.30) : 0
  const prixFinal  = prix + surcharge

  function pick(svc) {
    setPresta(svc.nom); setPrix(svc.prix); setSvcId(svc.id); setExpress(false); setStep(2)
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }

  function next() {
    if (step === 1 && !presta)   return alert('Choisissez une prestation.')
    if (step === 2 && !date)     return alert('Choisissez une date.')
    if (step === 3 && !heure)    return alert('Choisissez une heure.')
    if (step === 4) { confirm_(); return }
    setStep(step + 1)
  }

  async function confirm_() {
    if (!user) return navigate('/connexion')
    setSaving(true)

    const { data, error } = await supabase.from('bookings').insert({
      salon_id:   +id,
      service_id: serviceId,
      client_id:  user.id,
      date_rdv:   dateIso,
      heure_rdv:  heure + ':00',
      statut:     'en_attente',
      montant:    prixFinal,
    }).select().single()

    if (error) {
      setSaving(false)
      alert('Erreur lors de la réservation : ' + error.message)
      return
    }

    // Envoi email de confirmation (non bloquant — on n'attend pas le résultat)
    const selectedService = services.find((sv) => sv.id === serviceId)
    supabase.functions.invoke('send-booking-email', {
      body: {
        to:          user.email,
        clientName:  user.user_metadata?.nom ?? user.email,
        salonNom:    s.nom,
        commune:     s.commune,
        serviceName: selectedService?.nom ?? presta,
        duree:       selectedService?.duree ?? '',
        dateRdv:     date,
        heureRdv:    heure,
        montant:     fcfa(prixFinal),
        bookingId:   data.id,
      },
    }).catch((e) => console.warn('Email non envoyé :', e.message))

    setSaving(false)
    setBookingId(data.id)
    setStep(5)
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="skel" style={{ height: 380, marginTop: 28 }} />
        <div className="skel" style={{ height: 60, marginTop: 24, maxWidth: 400 }} />
      </div>
    )
  }

  if (!s) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Salon introuvable</h2>
        <Link to="/recherche" className="btn btn-primary" style={{ marginTop: 20 }}>Retour aux salons</Link>
      </div>
    )
  }

  const galTypes = [s.types?.[0], 'Tresses', 'Locks', 'Coloration', 'Braids']

  return (
    <>
      <style>{css}</style>
      <div className="container">
        <p style={{ marginTop: 24, color: 'var(--muted)', fontSize: '.9rem' }}>
          <Link to="/recherche" style={{ color: 'var(--bordeaux-700)' }}>Salons</Link> · {s.nom}
        </p>

        <div className="gallery">
          {galTypes.map((t, i) => (
            <Thumb key={i} type={t} c1={s.c1} c2={s.c2} className="g">
              <span className="gtag">{GAL_TAGS[i]}</span>
            </Thumb>
          ))}
        </div>

        <div className="salon-head">
          <div>
            <h1 style={{ fontSize: 'clamp(2rem,3.6vw,2.8rem)' }}>{s.nom}</h1>
            <div className="meta">
              <span className="rating">
                <span className="stars">{starsStr(s.note)}</span> {s.note}
                <span className="text-muted"> ({s.nb_avis ?? s.avis ?? 0} avis)</span>
              </span> · {s.quartier}, {s.commune}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#avis" className="btn btn-ghost btn-sm">Voir les avis</a>
            <a href="#book" className="btn btn-gold btn-sm">Réserver</a>
          </div>
        </div>

        <div className="slayout">
          <main>
            <div className="panel">
              <h3>À propos</h3>
              <p className="text-muted">{s.description} Notre équipe de professionnelles vous accueille dans un cadre soigné et chaleureux, avec des produits de qualité adaptés à tous types de cheveux.</p>
            </div>

            <div className="panel">
              <h3>Prestations & tarifs</h3>
              {services.length === 0 && <p className="text-muted">Aucune prestation renseignée.</p>}
              {services.map((p) => (
                <div className="presta-line" key={p.id}>
                  <div className="info"><b>{p.nom}</b><span>Durée {p.duree}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="price">{fcfa(p.prix)}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => pick(p)}>Choisir</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="panel">
              <h3>Horaires d'ouverture</h3>
              <div className="hours">
                <div><span>Lundi</span><b>09h – 19h</b></div><div><span>Mardi</span><b>09h – 19h</b></div>
                <div><span>Mercredi</span><b>09h – 19h</b></div><div><span>Jeudi</span><b>09h – 19h</b></div>
                <div><span>Vendredi</span><b>09h – 20h</b></div><div><span>Samedi</span><b>08h – 20h</b></div>
                <div><span>Dimanche</span><b>Sur rendez-vous</b></div>
              </div>
            </div>

            <div className="panel">
              <h3>Localisation</h3>
              <p className="text-muted" style={{ marginBottom: 14 }}>{s.quartier}, {s.commune} — Abidjan, Côte d'Ivoire</p>
              <div style={{ height: 260, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--line)' }}>
                <iframe title="Localisation" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  src={mapEmbedLatLng(s.lat, s.lng, 15)}
                  style={{ width: '100%', height: '100%', border: 0, display: 'block' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
                <a className="btn btn-primary btn-sm" target="_blank" rel="noopener" href={gmapsDirURL(s.lat, s.lng)}>Itinéraire (Google Maps)</a>
                <a className="btn btn-gold btn-sm" target="_blank" rel="noopener" href={yangoURL(s.lat, s.lng)}>Commander un Yango</a>
              </div>
            </div>

            <div className="panel" id="avis">
              <h3>Avis des clientes{reviews.length > 0 && <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '.9rem', marginLeft: 10 }}>{reviews.length} avis</span>}</h3>
              {s.note > 0 && (
                <>
                  <div className="ratings-summary">
                    <div className="big-note">{String(s.note).replace('.', ',')}</div>
                    <div className="bars">
                      {[['Qualité', 96],['Accueil', 94],['Horaires', 90],['Qualité / prix', 88]].map(([l, w]) => (
                        <div className="bar-row" key={l}><span>{l}</span><span className="bar"><i style={{ width: w + '%' }} /></span></div>
                      ))}
                    </div>
                  </div>
                  <hr className="divider" />
                </>
              )}
              {reviews.length === 0 ? (
                <p className="text-muted">Aucun avis pour ce salon pour l'instant. Soyez la première à en laisser un !</p>
              ) : (
                reviews.map((r) => (
                  <div className="avis" key={r.id}>
                    <div className="top">
                      <span className="who">{r.profiles?.nom ?? 'Cliente'}</span>
                      <span className="stars">{'★'.repeat(r.note)}{'☆'.repeat(5 - r.note)}</span>
                    </div>
                    {r.commentaire && <p>{r.commentaire}</p>}
                    <small>{new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</small>
                  </div>
                ))
              )}
            </div>
          </main>

          <aside id="book">
            <div className="booking">
              <div className="bk-head">
                <b>Réserver un créneau</b>
                <div style={{ opacity: .85, fontSize: '.9rem', marginTop: 4 }}>Confirmation immédiate</div>
              </div>
              <div className="bk-body">
                {step < 5 && <div className="steps-dots">{[1,2,3,4].map((d) => <span key={d} className={d <= Math.min(step,4) ? 'on' : ''} />)}</div>}

                {step === 1 && (
                  <div>
                    <label>Choisissez une prestation</label>
                    <div className="opt-grid">
                      {services.map((p) => (
                        <div key={p.id} className={'opt' + (presta === p.nom ? ' sel' : '')} onClick={() => { setPresta(p.nom); setPrix(p.prix); setSvcId(p.id) }}>
                          {p.nom}<br /><small>{fcfa(p.prix)}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <label>Choisissez une date</label>
                    <div className="opt-grid">
                      {DATES.map((d) => (
                        <div key={d.iso} className={'opt' + (dateIso === d.iso ? ' sel' : '')} onClick={() => { setDate(d.full); setDateIso(d.iso) }}>
                          {d.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <label>Choisissez une heure</label>
                    <div className="opt-grid">
                      {HEURES.map((h) => (
                        <div key={h} className={'opt' + (heure === h ? ' sel' : '')} onClick={() => setHeure(h)}>{h}</div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <label>Service express</label>
                    <div
                      onClick={() => setExpress(!express)}
                      style={{
                        border: '2px solid ' + (express ? 'var(--gold-500)' : 'var(--line)'),
                        borderRadius: 'var(--radius-sm)',
                        padding: '14px 16px',
                        marginBottom: 20,
                        cursor: 'pointer',
                        background: express ? 'rgba(201,162,75,.08)' : 'var(--white)',
                        transition: 'all .15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                      }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: 4,
                        border: '2px solid ' + (express ? 'var(--gold-500)' : 'var(--line)'),
                        background: express ? 'var(--gold-500)' : 'transparent',
                        display: 'grid', placeItems: 'center', flexShrink: 0,
                        transition: 'all .15s',
                      }}>
                        {express && <svg viewBox="0 0 12 10" fill="none" stroke="#3D0E1C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="12" height="10"><path d="M1 5l3 3 7-7"/></svg>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <b style={{ fontSize: '.97rem' }}>Coiffure express — urgent</b>
                        <div style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: 2 }}>
                          Priorité immédiate sur le planning · Majoration de 30 %
                        </div>
                      </div>
                      <span style={{
                        background: 'linear-gradient(135deg,var(--gold-400),var(--gold-500))',
                        color: 'var(--bordeaux-900)',
                        fontSize: '.78rem', fontWeight: 700,
                        padding: '3px 10px', borderRadius: 999,
                        whiteSpace: 'nowrap',
                      }}>+30 %</span>
                    </div>

                    <label>Récapitulatif</label>
                    <div className="summary-line"><span>Prestation</span><b>{presta}</b></div>
                    <div className="summary-line"><span>Date</span><b>{date}</b></div>
                    <div className="summary-line"><span>Heure</span><b>{heure}</b></div>
                    <div className="summary-line"><span>Prix de base</span><b>{fcfa(prix)}</b></div>
                    {express && (
                      <div className="summary-line" style={{ color: 'var(--gold-500)' }}>
                        <span>Majoration express (30 %)</span><b>+{fcfa(surcharge)}</b>
                      </div>
                    )}
                    <div className="summary-line"><span>Paiement</span><b>Sur place</b></div>
                    <div className="summary-line total">
                      <span>Total</span>
                      <span style={{ color: express ? 'var(--gold-500)' : 'var(--bordeaux-700)' }}>{fcfa(prixFinal)}</span>
                    </div>
                    {!user && (
                      <div className="login-prompt">
                        <p>Connectez-vous pour confirmer votre réservation.</p>
                        <Link to="/connexion" className="btn btn-primary btn-block btn-sm">Se connecter</Link>
                      </div>
                    )}
                  </div>
                )}

                {step === 5 && (
                  <div className="confirm">
                    <div className="check">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#3D0E1C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="30" height="30"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                    <h3>Réservation confirmée</h3>
                    <p className="text-muted" style={{ margin: '10px 0 6px', fontSize: '.9rem' }}>Réf. #{bookingId}</p>
                    <p className="text-muted" style={{ margin: '0 0 18px' }}>Un récapitulatif vous a été envoyé. Vous recevrez un rappel la veille.</p>
                    <Link to="/recherche" className="btn btn-primary btn-block">Découvrir d'autres salons</Link>
                  </div>
                )}

                {step < 5 && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                    {step > 1 && <button className="btn btn-ghost btn-sm" onClick={() => setStep(step - 1)}>Retour</button>}
                    <button className="btn btn-gold btn-block" onClick={next} disabled={saving}>
                      {saving ? 'Confirmation…' : step === 4 ? 'Confirmer la réservation' : 'Continuer'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
