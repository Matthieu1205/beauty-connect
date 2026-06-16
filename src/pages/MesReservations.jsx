import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { fcfa, starsStr } from '../data/salons'
import Thumb from '../components/Thumb'
import ReviewModal from '../components/ReviewModal'

const css = `
.rdv-hero{background:radial-gradient(700px 380px at 90% -20%,rgba(201,162,75,.2),transparent 60%),var(--cream-2);padding:46px 0;border-bottom:1px solid var(--line)}
.rdv-hero h1{font-size:clamp(1.9rem,3.4vw,2.6rem)}
.rdv-tabs{display:flex;gap:8px;margin-bottom:28px}
.rdv-tabs .tab{padding:10px 22px;border-radius:999px;font-size:.95rem;font-weight:600;cursor:pointer;border:1px solid var(--line);background:var(--white);color:var(--muted);transition:all .2s;font-family:var(--font)}
.rdv-tabs .tab.on{background:var(--bordeaux-700);color:var(--cream);border-color:var(--bordeaux-700)}
.rdv-card{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-sm);overflow:hidden;margin-bottom:16px;display:grid;grid-template-columns:120px 1fr auto;align-items:center}
.rdv-card .thumb-wrap{height:120px;position:relative}
.rdv-card .rdv-body{padding:20px 24px}
.rdv-card .rdv-body h3{font-size:1.15rem;margin-bottom:4px}
.rdv-card .rdv-meta{color:var(--muted);font-size:.9rem;margin-bottom:10px}
.rdv-card .rdv-info{display:flex;gap:18px;flex-wrap:wrap;font-size:.9rem}
.rdv-card .rdv-info span{display:flex;align-items:center;gap:5px}
.rdv-card .rdv-actions{padding:20px;display:flex;flex-direction:column;gap:8px;align-items:flex-end}
.badge-statut{padding:5px 13px;border-radius:999px;font-size:.8rem;font-weight:600;white-space:nowrap}
.badge-statut.en_attente{background:rgba(201,162,75,.16);color:#9a7a1e}
.badge-statut.confirme{background:rgba(63,125,91,.12);color:var(--success)}
.badge-statut.annule{background:rgba(135,42,66,.1);color:var(--bordeaux-600)}
.badge-statut.termine{background:var(--cream-2);color:var(--muted)}
.empty{text-align:center;padding:80px 24px;color:var(--muted)}
.empty h3{margin:16px 0 8px;color:var(--ink)}
.skel{background:linear-gradient(90deg,var(--cream-2) 25%,var(--line) 50%,var(--cream-2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:var(--radius);height:120px;margin-bottom:16px}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@media(max-width:700px){.rdv-card{grid-template-columns:1fr}.rdv-card .thumb-wrap{height:160px}.rdv-card .rdv-actions{flex-direction:row;padding:0 20px 20px;align-items:center}}
`

const STATUT_LABELS = {
  en_attente: 'En attente',
  confirme:   'Confirmé',
  annule:     'Annulé',
  termine:    'Terminé',
}


export default function MesReservations() {
  const { user, profile } = useAuth()
  const [bookings, setBookings]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [onglet, setOnglet]         = useState('avenir')
  const [cancelling, setCancelling] = useState(null)
  const [reviewing, setReviewing]   = useState(null)
  const [reviewed, setReviewed]     = useState(new Set())

  useEffect(() => {
    if (!user) return
    loadBookings()
  }, [user])

  async function loadBookings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        salons (id, nom, commune, quartier, c1, c2, types),
        services (nom, duree)
      `)
      .eq('client_id', user.id)
      .order('date_rdv', { ascending: false })

    if (!error) {
      setBookings(data ?? [])
      // Récupérer les booking_id déjà notés
      const ids = (data ?? []).map((b) => b.id)
      if (ids.length) {
        const { data: revs } = await supabase
          .from('reviews')
          .select('booking_id')
          .in('booking_id', ids)
        setReviewed(new Set((revs ?? []).map((r) => r.booking_id)))
      }
    }
    setLoading(false)
  }

  async function annuler(id) {
    if (!confirm('Confirmer l\'annulation de ce rendez-vous ?')) return
    setCancelling(id)
    await supabase.from('bookings').update({ statut: 'annule' }).eq('id', id)
    setCancelling(null)
    loadBookings()
  }

  const today    = new Date().toISOString().slice(0, 10)
  const avenir   = bookings.filter((b) => b.date_rdv >= today && b.statut !== 'annule')
  const passes   = bookings.filter((b) => b.date_rdv < today || b.statut === 'annule' || b.statut === 'termine')
  const liste    = onglet === 'avenir' ? avenir : passes

  function formatDate(iso) {
    const d = new Date(iso)
    const JOURS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
    const MOIS  = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
    return JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS[d.getMonth()] + ' ' + d.getFullYear()
  }

  function formatHeure(h) {
    return h ? h.slice(0, 5) : '—'
  }

  return (
    <>
      <style>{css}</style>
      <div className="rdv-hero">
        <div className="container">
          <p className="eyebrow">Espace client</p>
          <h1>Mes réservations</h1>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>
            Bonjour {profile?.nom ?? user?.email} — retrouvez tous vos rendez-vous ici.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <div className="rdv-tabs">
          <button className={'tab' + (onglet === 'avenir' ? ' on' : '')} onClick={() => setOnglet('avenir')}>
            À venir ({avenir.length})
          </button>
          <button className={'tab' + (onglet === 'passes' ? ' on' : '')} onClick={() => setOnglet('passes')}>
            Passés &amp; annulés ({passes.length})
          </button>
        </div>

        {loading ? (
          <>{[1,2,3].map((i) => <div key={i} className="skel" />)}</>
        ) : liste.length === 0 ? (
          <div className="empty">
            <h3>{onglet === 'avenir' ? 'Aucun rendez-vous à venir' : 'Aucun rendez-vous passé'}</h3>
            <p>{onglet === 'avenir' ? 'Réservez votre première prestation dès maintenant.' : 'Vos anciens rendez-vous apparaîtront ici.'}</p>
            {onglet === 'avenir' && (
              <Link to="/recherche" className="btn btn-gold" style={{ marginTop: 22, display: 'inline-flex' }}>
                Trouver un salon
              </Link>
            )}
          </div>
        ) : (
          liste.map((b) => {
            const s = b.salons
            const peutAnnuler = b.statut === 'en_attente' && b.date_rdv >= today
            return (
              <div className="rdv-card" key={b.id}>
                <div className="thumb-wrap">
                  {s ? (
                    <Thumb type={s.types?.[0]} c1={s.c1} c2={s.c2} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--cream-2)' }} />
                  )}
                </div>

                <div className="rdv-body">
                  <h3>{s?.nom ?? 'Salon'}</h3>
                  <div className="rdv-meta">{s?.quartier}, {s?.commune}</div>
                  <div className="rdv-info">
                    <span>{b.services?.nom ?? '—'} · {b.services?.duree ?? ''}</span>
                    <span>{formatDate(b.date_rdv)}</span>
                    <span>{formatHeure(b.heure_rdv)}</span>
                    {b.montant && <span>{fcfa(b.montant)}</span>}
                  </div>
                </div>

                <div className="rdv-actions">
                  <span className={'badge-statut ' + b.statut}>{STATUT_LABELS[b.statut] ?? b.statut}</span>
                  {s && (
                    <Link to={'/salon/' + s.id} className="btn btn-ghost btn-sm">Voir le salon</Link>
                  )}
                  {b.statut === 'termine' && !reviewed.has(b.id) && (
                    <button
                      className="btn btn-gold btn-sm"
                      onClick={() => setReviewing(b)}
                    >
                      Laisser un avis
                    </button>
                  )}
                  {b.statut === 'termine' && reviewed.has(b.id) && (
                    <span style={{ fontSize: '.85rem', color: 'var(--success)', fontWeight: 600 }}>Avis publié</span>
                  )}
                  {peutAnnuler && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--bordeaux-600)', borderColor: 'var(--bordeaux-600)' }}
                      onClick={() => annuler(b.id)}
                      disabled={cancelling === b.id}
                    >
                      {cancelling === b.id ? 'Annulation…' : 'Annuler'}
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link to="/recherche" className="btn btn-primary">Réserver un nouveau RDV</Link>
        </div>
      </div>

      {reviewing && (
        <ReviewModal
          booking={reviewing}
          onClose={() => setReviewing(null)}
          onDone={() => {
            setReviewed((prev) => new Set([...prev, reviewing.id]))
            setReviewing(null)
          }}
        />
      )}
    </>
  )
}
