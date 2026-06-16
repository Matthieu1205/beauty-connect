import { useState } from 'react'
import { Link } from 'react-router-dom'
import { fcfa, COMMUNES } from '../data/salons'
import { useAuth } from '../context/AuthContext'
import { useSalonDashboard } from '../hooks/useSalonDashboard'
import { supabase } from '../lib/supabase'
import Thumb from '../components/Thumb'

const TYPES_PRESTA = ['Tresses','Braids','Locks','Perruques','Défrisage','Coupe','Coloration']
const COULEURS = [['#6E1E33','#C9A24B'],['#511325','#D7B968'],['#872A42','#E7D29A'],['#3D0E1C','#C9A24B'],['#511325','#C9A24B']]

function OnboardingForm({ user, profile, onDone }) {
  const [nom,      setNom]      = useState(profile?.nom ?? '')
  const [commune,  setCommune]  = useState('Cocody')
  const [quartier, setQuartier] = useState('')
  const [desc,     setDesc]     = useState('')
  const [types,    setTypes]    = useState([])
  const [prixMin,  setPrixMin]  = useState(3000)
  const [saving,   setSaving]   = useState(false)
  const [err,      setErr]      = useState('')

  function toggleType(t) {
    setTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])
  }

  async function submit(e) {
    e.preventDefault()
    setErr('')
    if (!nom.trim())      return setErr('Le nom du salon est obligatoire.')
    if (!quartier.trim()) return setErr('Le quartier est obligatoire.')
    if (types.length === 0) return setErr('Sélectionnez au moins une prestation.')

    setSaving(true)
    const [c1, c2] = COULEURS[Math.floor(Math.random() * COULEURS.length)]
    const { error } = await supabase.from('salons').insert({
      nom:         nom.trim(),
      commune,
      quartier:    quartier.trim(),
      description: desc.trim() || null,
      types,
      prix_min:    Number(prixMin),
      owner_id:    user.id,
      valide:      true,
      note:        0,
      nb_avis:     0,
      c1,
      c2,
    })
    setSaving(false)
    if (error) { setErr(error.message); return }
    onDone()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream-2)', display: 'grid', placeItems: 'center', padding: '40px 20px' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '42px 44px', maxWidth: 560, width: '100%', boxShadow: 'var(--shadow)' }}>
        <Link className="brand" to="/" style={{ marginBottom: 28, display: 'inline-flex' }}>
          <span className="mark">BC</span><b>Beauty<span>Connect</span></b>
        </Link>
        <p className="eyebrow">Espace salon</p>
        <h2 style={{ margin: '6px 0 6px' }}>Créez la fiche de votre salon</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 28 }}>Renseignez les informations de votre établissement. Vous pourrez les modifier à tout moment.</p>

        {err && <div style={{ background: 'rgba(135,42,66,.08)', border: '1px solid rgba(135,42,66,.25)', color: 'var(--bordeaux-700)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '.9rem', marginBottom: 18 }}>{err}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label>Nom du salon</label>
            <input type="text" placeholder="Ex : Maison Awa" value={nom} onChange={(e) => setNom(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Commune</label>
              <select value={commune} onChange={(e) => setCommune(e.target.value)}>
                {COMMUNES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Quartier</label>
              <input type="text" placeholder="Ex : Riviera Golf" value={quartier} onChange={(e) => setQuartier(e.target.value)} required />
            </div>
          </div>

          <div className="field">
            <label>Description <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(facultatif)</span></label>
            <textarea rows={3} placeholder="Décrivez votre salon, vos spécialités, votre ambiance…" value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={400} />
          </div>

          <div className="field">
            <label>Prestations proposées</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {TYPES_PRESTA.map((t) => (
                <span
                  key={t}
                  onClick={() => toggleType(t)}
                  style={{
                    padding: '8px 16px', borderRadius: 999, fontSize: '.9rem', cursor: 'pointer', border: '1px solid',
                    background:     types.includes(t) ? 'var(--bordeaux-700)' : 'var(--white)',
                    color:          types.includes(t) ? 'var(--cream)' : 'var(--muted)',
                    borderColor:    types.includes(t) ? 'var(--bordeaux-700)' : 'var(--line)',
                    transition:     'all .15s',
                  }}
                >{t}</span>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Prix minimum (FCFA)</label>
            <input type="number" min={500} step={500} value={prixMin} onChange={(e) => setPrixMin(e.target.value)} />
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={saving} style={{ marginTop: 8 }}>
            {saving ? 'Création en cours…' : 'Créer ma fiche salon'}
          </button>
        </form>
      </div>
    </div>
  )
}

const DUREES = ['15 min','30 min','45 min','1h','1h30','2h','2h30','3h','3h30','4h']

const MOIS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.getDate() + ' ' + MOIS[d.getMonth()] + ' ' + d.getFullYear()
}
function fmtHeure(h) { return h ? h.slice(0, 5) : '—' }

function normalizePhone(tel) {
  if (!tel) return null
  const digits = tel.replace(/\D/g, '')
  if (digits.startsWith('225')) return digits
  if (digits.startsWith('0') && digits.length === 10) return '225' + digits.slice(1)
  if (digits.length === 10) return '225' + digits
  if (digits.length === 8)  return '225' + digits
  return digits
}

function waLink(phone, text) {
  const n = normalizePhone(phone)
  if (!n) return null
  return 'https://wa.me/' + n + '?text=' + encodeURIComponent(text)
}

function BookingDetailModal({ booking, salon, onClose, onUpdate }) {
  const [acting, setActing] = useState(null)

  const client  = booking.profiles
  const service = booking.services
  const phone   = client?.telephone ?? null

  function waMessage(extra = '') {
    return (
      'Bonjour ' + (client?.nom ?? '') + ' !\n\n' +
      (extra ? extra + '\n\n' : '') +
      'Salon : ' + salon.nom + '\n' +
      'Prestation : ' + (service?.nom ?? '—') + (service?.duree ? ' (' + service.duree + ')' : '') + '\n' +
      'Date : ' + fmtDate(booking.date_rdv) + '\n' +
      'Heure : ' + fmtHeure(booking.heure_rdv) + '\n' +
      (booking.montant ? 'Montant : ' + booking.montant.toLocaleString('fr-FR') + ' FCFA\n' : '') +
      '\nÀ bientôt !\n— BeautyConnect'
    )
  }

  async function confirm() {
    setActing('confirme')
    await supabase.from('bookings').update({ statut: 'confirme' }).eq('id', booking.id)
    const link = waLink(phone, waMessage('Votre rendez-vous est confirmé.'))
    if (link) window.open(link, '_blank')
    onUpdate()
  }

  async function cancel() {
    if (!window.confirm('Annuler ce rendez-vous ?')) return
    setActing('annule')
    await supabase.from('bookings').update({ statut: 'annule' }).eq('id', booking.id)
    onUpdate()
  }

  async function termine() {
    setActing('termine')
    await supabase.from('bookings').update({ statut: 'termine' }).eq('id', booking.id)
    onUpdate()
  }

  const STATUT_LABEL = { en_attente: 'En attente', confirme: 'Confirmé', annule: 'Annulé', termine: 'Terminé' }
  const STATUT_COL   = { en_attente: '#9a7a1e', confirme: 'var(--success)', annule: 'var(--bordeaux-600)', termine: 'var(--muted)' }
  const STATUT_BG    = { en_attente: 'rgba(201,162,75,.16)', confirme: 'rgba(63,125,91,.12)', annule: 'rgba(135,42,66,.1)', termine: 'var(--cream-2)' }

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(61,14,28,.55)',zIndex:200,display:'grid',placeItems:'center',padding:20,backdropFilter:'blur(4px)' }}
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'var(--white)',borderRadius:'var(--radius-lg)',padding:'32px 36px',maxWidth:480,width:'100%',boxShadow:'var(--shadow)' }}>

        {/* En-tête */}
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24 }}>
          <div>
            <p style={{ fontSize:'.8rem',color:'var(--muted)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:4 }}>Réservation</p>
            <h2 style={{ fontSize:'1.3rem',margin:0 }}>#{booking.id.toString().slice(0,8).toUpperCase()}</h2>
          </div>
          <span style={{ padding:'6px 14px',borderRadius:999,fontSize:'.82rem',fontWeight:600,
            background: STATUT_BG[booking.statut], color: STATUT_COL[booking.statut] }}>
            {STATUT_LABEL[booking.statut] ?? booking.statut}
          </span>
        </div>

        {/* Cliente */}
        <div style={{ background:'var(--cream-2)',borderRadius:'var(--radius)',padding:'16px 18px',marginBottom:16 }}>
          <p style={{ fontSize:'.75rem',color:'var(--muted)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:8 }}>Cliente</p>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
            <div>
              <b style={{ fontSize:'1.05rem' }}>{client?.nom ?? 'Cliente'}</b>
              <div style={{ color:'var(--muted)',fontSize:'.9rem',marginTop:3 }}>
                {phone ?? <span style={{ fontStyle:'italic' }}>Numéro non renseigné</span>}
              </div>
            </div>
            {phone && (
              <a href={waLink(phone, waMessage())} target="_blank" rel="noreferrer"
                 style={{ display:'flex',alignItems:'center',gap:7,padding:'8px 14px',borderRadius:999,
                   background:'#25D366',color:'#fff',fontSize:'.88rem',fontWeight:600,textDecoration:'none' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Détails prestation */}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16 }}>
          {[
            ['Prestation', (service?.nom ?? '—')],
            ['Durée',      service?.duree ?? '—'],
            ['Date',       fmtDate(booking.date_rdv)],
            ['Heure',      fmtHeure(booking.heure_rdv)],
            ['Montant',    booking.montant ? booking.montant.toLocaleString('fr-FR') + ' FCFA' : '—'],
          ].map(([label, val]) => (
            <div key={label} style={{ background:'var(--cream-2)',borderRadius:'var(--radius-sm)',padding:'12px 14px' }}>
              <div style={{ fontSize:'.75rem',color:'var(--muted)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:4 }}>{label}</div>
              <b style={{ fontSize:'.97rem' }}>{val}</b>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ flex:1 }}>Fermer</button>
          {booking.statut === 'en_attente' && (
            <>
              <button className="btn btn-gold btn-sm" onClick={confirm} disabled={!!acting} style={{ flex:2 }}>
                {acting === 'confirme' ? 'Confirmation…' : 'Confirmer + WhatsApp'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={cancel} disabled={!!acting}
                      style={{ flex:1,color:'var(--bordeaux-600)',borderColor:'var(--bordeaux-600)' }}>
                {acting === 'annule' ? '…' : 'Annuler'}
              </button>
            </>
          )}
          {booking.statut === 'confirme' && (
            <button className="btn btn-primary btn-sm" onClick={termine} disabled={!!acting} style={{ flex:2 }}>
              {acting === 'termine' ? '…' : 'Marquer terminé'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ServiceModal({ salonId, service, onClose, onDone }) {
  const editing = !!service
  const [nom,   setNom]   = useState(service?.nom   ?? '')
  const [prix,  setPrix]  = useState(service?.prix  ?? '')
  const [duree, setDuree] = useState(service?.duree ?? '1h')
  const [saving, setSaving] = useState(false)
  const [err,    setErr]    = useState('')

  async function submit(e) {
    e.preventDefault()
    setErr('')
    if (!nom.trim()) return setErr('Le nom est obligatoire.')
    if (!prix || Number(prix) <= 0) return setErr('Le prix doit être supérieur à 0.')
    setSaving(true)
    let error
    if (editing) {
      ;({ error } = await supabase.from('services').update({ nom: nom.trim(), prix: Number(prix), duree }).eq('id', service.id))
    } else {
      ;({ error } = await supabase.from('services').insert({ salon_id: salonId, nom: nom.trim(), prix: Number(prix), duree, actif: true }))
    }
    setSaving(false)
    if (error) { setErr(error.message); return }
    onDone()
  }

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(61,14,28,.55)',zIndex:200,display:'grid',placeItems:'center',padding:20,backdropFilter:'blur(4px)' }}
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'var(--white)',borderRadius:'var(--radius-lg)',padding:'32px 36px',maxWidth:420,width:'100%',boxShadow:'var(--shadow)' }}>
        <h2 style={{ fontSize:'1.35rem',marginBottom:6 }}>{editing ? 'Modifier la prestation' : 'Nouvelle prestation'}</h2>
        <p style={{ color:'var(--muted)',fontSize:'.93rem',marginBottom:24 }}>Cette prestation sera visible sur votre fiche salon.</p>
        {err && <div style={{ background:'rgba(135,42,66,.08)',border:'1px solid rgba(135,42,66,.25)',color:'var(--bordeaux-700)',borderRadius:'var(--radius-sm)',padding:'10px 14px',fontSize:'.88rem',marginBottom:16 }}>{err}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Nom de la prestation</label>
            <input type="text" placeholder="Ex : Tresses box braids" value={nom} onChange={(e) => setNom(e.target.value)} required />
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
            <div className="field">
              <label>Prix (FCFA)</label>
              <input type="number" min={500} step={500} placeholder="10000" value={prix} onChange={(e) => setPrix(e.target.value)} required />
            </div>
            <div className="field">
              <label>Durée</label>
              <select value={duree} onChange={(e) => setDuree(e.target.value)}>
                {DUREES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'flex',gap:10,marginTop:8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex:1 }}>Annuler</button>
            <button type="submit" className="btn btn-gold" disabled={saving} style={{ flex:2 }}>
              {saving ? 'Enregistrement…' : editing ? 'Mettre à jour' : 'Ajouter la prestation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FicheEditor({ salon, onDone }) {
  const [nom,      setNom]      = useState(salon.nom)
  const [commune,  setCommune]  = useState(salon.commune)
  const [quartier, setQuartier] = useState(salon.quartier)
  const [desc,     setDesc]     = useState(salon.description ?? '')
  const [types,    setTypes]    = useState(salon.types ?? [])
  const [prixMin,  setPrixMin]  = useState(salon.prix_min ?? 0)
  const [saving,   setSaving]   = useState(false)
  const [ok,       setOk]       = useState('')
  const [err,      setErr]      = useState('')

  function toggleType(t) {
    setTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])
  }

  async function save(e) {
    e.preventDefault()
    setOk(''); setErr('')
    if (!nom.trim())      return setErr('Le nom est obligatoire.')
    if (!quartier.trim()) return setErr('Le quartier est obligatoire.')
    if (types.length === 0) return setErr('Sélectionnez au moins une prestation.')
    setSaving(true)
    const { error } = await supabase.from('salons').update({
      nom: nom.trim(),
      commune,
      quartier: quartier.trim(),
      description: desc.trim() || null,
      types,
      prix_min: Number(prixMin),
    }).eq('id', salon.id)
    setSaving(false)
    if (error) { setErr(error.message); return }
    setOk('Fiche mise à jour avec succès.')
    onDone()
  }

  return (
    <div className="panel">
      <h3>Ma fiche salon</h3>
      <p style={{ color: 'var(--muted)', fontSize: '.93rem', marginBottom: 24 }}>
        Ces informations sont visibles par toutes les clientes sur votre fiche publique.
      </p>

      {ok  && <div style={{ background: 'rgba(63,125,91,.08)', border: '1px solid rgba(63,125,91,.25)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '.9rem', marginBottom: 18 }}>{ok}</div>}
      {err && <div style={{ background: 'rgba(135,42,66,.08)', border: '1px solid rgba(135,42,66,.25)', color: 'var(--bordeaux-700)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '.9rem', marginBottom: 18 }}>{err}</div>}

      <form onSubmit={save}>
        <div className="field">
          <label>Nom du salon</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="field">
            <label>Commune</label>
            <select value={commune} onChange={(e) => setCommune(e.target.value)}>
              {COMMUNES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Quartier</label>
            <input type="text" value={quartier} onChange={(e) => setQuartier(e.target.value)} required />
          </div>
        </div>

        <div className="field">
          <label>Description</label>
          <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={400}
            placeholder="Décrivez votre salon, vos spécialités…" />
        </div>

        <div className="field">
          <label>Prestations proposées</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {TYPES_PRESTA.map((t) => (
              <span key={t} onClick={() => toggleType(t)} style={{
                padding: '8px 16px', borderRadius: 999, fontSize: '.9rem', cursor: 'pointer', border: '1px solid',
                background:  types.includes(t) ? 'var(--bordeaux-700)' : 'var(--white)',
                color:       types.includes(t) ? 'var(--cream)' : 'var(--muted)',
                borderColor: types.includes(t) ? 'var(--bordeaux-700)' : 'var(--line)',
                transition: 'all .15s',
              }}>{t}</span>
            ))}
          </div>
        </div>

        <div className="field" style={{ maxWidth: 200 }}>
          <label>Prix minimum (FCFA)</label>
          <input type="number" min={500} step={500} value={prixMin} onChange={(e) => setPrixMin(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
          </button>
          <Link to={'/salon/' + salon.id} target="_blank" className="btn btn-ghost btn-sm">
            Voir ma fiche publique
          </Link>
        </div>
      </form>
    </div>
  )
}

const css = `
.dash{display:grid;grid-template-columns:250px 1fr;min-height:100vh;background:var(--cream-2)}
.side{background:var(--bordeaux-900);color:var(--cream);padding:26px 18px;position:sticky;top:0;height:100vh;overflow-y:auto}
.side .brand{color:var(--cream);margin-bottom:34px}.side .brand b,.side .brand b span{color:var(--cream)}
.side nav a{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:var(--radius-sm);color:rgba(251,247,241,.78);font-size:.97rem;margin-bottom:4px;cursor:pointer;transition:all .18s}
.side nav a:hover{background:rgba(255,255,255,.06);color:var(--cream)}
.side nav a.on{background:linear-gradient(135deg,var(--gold-400),var(--gold-500));color:var(--bordeaux-900);font-weight:600}
.side .dot{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.8}
.side .upgrade{margin-top:30px;background:rgba(201,162,75,.14);border:1px solid rgba(201,162,75,.3);border-radius:var(--radius);padding:16px}
.side .upgrade b{color:var(--gold-300)}.side .upgrade p{color:rgba(251,247,241,.7);font-size:.82rem;margin:6px 0 12px}
.dmain{padding:30px 38px}
.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;flex-wrap:wrap;gap:14px}
.topbar h1{font-size:1.7rem}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:28px}
.kpi{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:20px}
.kpi span{color:var(--muted);font-size:.88rem}.kpi b{display:block;font-size:1.9rem;color:var(--bordeaux-700);font-weight:600;margin-top:4px}
.kpi .delta{font-size:.82rem;color:var(--success)}
.panel{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:24px;margin-bottom:22px}
.panel h3{margin-bottom:16px}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding:10px 12px;border-bottom:1px solid var(--line)}
td{padding:14px 12px;border-bottom:1px solid var(--line);font-size:.95rem}
tr:last-child td{border:0}
.status{padding:5px 12px;border-radius:999px;font-size:.8rem;font-weight:600}
.status.ok{background:rgba(63,125,91,.12);color:var(--success)}
.status.wait{background:rgba(201,162,75,.16);color:#9a7a1e}
.status.bad{background:rgba(135,42,66,.12);color:var(--bordeaux-600)}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}
.cal .day{text-align:center;font-size:.8rem;color:var(--muted);font-weight:600;padding-bottom:6px}
.cal .slot{background:var(--cream-2);border-radius:var(--radius-sm);min-height:84px;padding:8px;font-size:.78rem}
.cal .ev{background:linear-gradient(135deg,var(--bordeaux-700),var(--bordeaux-600));color:var(--cream);border-radius:8px;padding:5px 7px;margin-bottom:5px}
.gal{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.gal .t{position:absolute;bottom:8px;left:8px;background:rgba(61,14,28,.75);color:var(--cream);padding:4px 10px;border-radius:999px;font-size:.72rem;z-index:2}
.plans{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.plan{border:1px solid var(--line);border-radius:var(--radius);padding:26px;position:relative}
.plan.pro{border-color:var(--gold-500);box-shadow:var(--shadow-gold)}
.plan .price{font-size:2.2rem;font-weight:600;color:var(--bordeaux-700);margin:10px 0}
.plan .price small{font-size:.9rem;color:var(--muted);font-weight:400}
.plan ul li{padding:8px 0;border-bottom:1px solid var(--line);font-size:.93rem}.plan ul li:last-child{border:0}
.plan .tag-pill{position:absolute;top:-12px;right:20px;background:var(--gold-500);color:var(--bordeaux-900)}
.empty-dash{text-align:center;padding:80px 24px;color:var(--muted)}
.empty-dash h2{color:var(--ink);margin-bottom:12px}
.skel{background:linear-gradient(90deg,var(--cream-2) 25%,var(--line) 50%,var(--cream-2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:var(--radius)}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@media (max-width:900px){.dash{grid-template-columns:1fr}.side{position:static;height:auto}.kpis{grid-template-columns:1fr 1fr}.plans{grid-template-columns:1fr}.gal{grid-template-columns:1fr 1fr}}
`

const NAV = [['apercu','Aperçu'],['calendrier','Calendrier'],['prestations','Prestations'],['clientes','Clientes'],['mafiche','Ma fiche'],['galerie','Galerie'],['abonnement','Abonnement']]
const GAL = [['Tresses','#6E1E33','#C9A24B'],['Locks','#511325','#D7B968'],['Coloration','#872A42','#E7D29A'],['Perruques','#3D0E1C','#C9A24B'],['Braids','#6E1E33','#D4AF37'],['Coupe','#511325','#C9A24B'],['Coloration','#872A42','#D7B968'],['Tresses','#6E1E33','#E7D29A']]
const GALT = ['Tresses','Locks','Coloration','Perruque','Braids','Coupe','Soin','Vanilles']
const JOURS_COURTS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']

const STATUT_CSS   = { en_attente: 'wait', confirme: 'ok', annule: 'bad', termine: 'ok' }
const STATUT_LABEL = { en_attente: 'En attente', confirme: 'Confirmé', annule: 'Annulé', termine: 'Terminé' }

function weekDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return { iso: d.toISOString().slice(0, 10), label: JOURS_COURTS[d.getDay()] + ' ' + d.getDate() }
  })
}

export default function SalonDashboard() {
  const { user, profile } = useAuth()
  const [sec,      setSec]      = useState('apercu')
  const [svcModal, setSvcModal] = useState(null)
  const [detailRdv, setDetailRdv] = useState(null)
  const { salon, loading, error, todayRdv, monthStats, services, clients, weekRdv, reload } = useSalonDashboard(user?.id)

  async function toggleActif(svc) {
    await supabase.from('services').update({ actif: !svc.actif }).eq('id', svc.id)
    reload()
  }

  async function updateStatut(bookingId, statut) {
    await supabase.from('bookings').update({ statut }).eq('id', bookingId)
    reload()
  }

  if (loading) {
    return (
      <div className="dash">
        <style>{css}</style>
        <aside className="side">
          <Link className="brand" to="/"><span className="mark">BC</span><b>Beauty<span>Connect</span></b></Link>
        </aside>
        <main className="dmain">
          <div className="skel" style={{ height: 60, marginBottom: 24, maxWidth: 300 }} />
          <div className="kpis">{[1,2,3,4].map((i) => <div key={i} className="skel" style={{ height: 100 }} />)}</div>
          <div className="skel" style={{ height: 280 }} />
        </main>
      </div>
    )
  }

  if (!loading && !salon) {
    return <OnboardingForm user={user} profile={profile} onDone={reload} />
  }

  const days = weekDays()

  return (
    <>
      <style>{css}</style>
      <div className="dash">
        <aside className="side">
          <Link className="brand" to="/"><span className="mark">BC</span><b>Beauty<span>Connect</span></b></Link>
          <nav>{NAV.map(([k, l]) => <a key={k} className={sec === k ? 'on' : ''} onClick={() => setSec(k)}><span className="dot" />{l}</a>)}</nav>
          <div className="upgrade">
            <b>Passez en Premium</b>
            <p>Mise en avant, photos illimitées et publicité locale.</p>
            <button className="btn btn-gold btn-sm btn-block" onClick={() => setSec('abonnement')}>Découvrir</button>
          </div>
        </aside>

        <main className="dmain">
          <div className="topbar">
            <div>
              <p className="eyebrow">Espace salon</p>
              <h1>{salon.nom}</h1>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span className="tag-pill">{salon.id % 2 === 0 ? 'Standard' : 'Premium'}</span>
              <Link to={'/salon/' + salon.id} className="btn btn-ghost btn-sm">Voir ma fiche</Link>
            </div>
          </div>

          {/* APERCU */}
          {sec === 'apercu' && (
            <>
              <div className="kpis">
                <div className="kpi">
                  <span>Réservations (mois)</span>
                  <b>{monthStats.count}</b>
                  <span className="delta">{salon.commune}</span>
                </div>
                <div className="kpi">
                  <span>Taux de présence</span>
                  <b>{monthStats.presence}%</b>
                  <span className="delta">RDV terminés</span>
                </div>
                <div className="kpi">
                  <span>Revenus estimés</span>
                  <b>{monthStats.revenue >= 1000000 ? (monthStats.revenue / 1000000).toFixed(1) + 'M' : monthStats.revenue >= 1000 ? Math.round(monthStats.revenue / 1000) + 'K' : monthStats.revenue}</b>
                  <span className="delta">FCFA ce mois</span>
                </div>
                <div className="kpi">
                  <span>Note moyenne</span>
                  <b>{salon.note || '—'}</b>
                  <span className="delta">{salon.nb_avis || 0} avis</span>
                </div>
              </div>

              <div className="panel">
                <h3>Rendez-vous du jour{todayRdv.length > 0 && <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '.9rem', marginLeft: 10 }}>{todayRdv.length} RDV</span>}</h3>
                {todayRdv.length === 0 ? (
                  <p className="text-muted">Aucun rendez-vous aujourd'hui.</p>
                ) : (
                  <table>
                    <thead><tr><th>Heure</th><th>Cliente</th><th>Prestation</th><th>Statut</th><th></th></tr></thead>
                    <tbody>
                      {todayRdv.map((b) => (
                        <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => setDetailRdv(b)}>
                          <td><b>{fmtHeure(b.heure_rdv)}</b></td>
                          <td>
                            <div>{b.profiles?.nom ?? 'Cliente'}</div>
                            {b.profiles?.telephone && <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{b.profiles.telephone}</div>}
                          </td>
                          <td>{b.services?.nom ?? '—'}</td>
                          <td><span className={'status ' + (STATUT_CSS[b.statut] ?? 'wait')}>{STATUT_LABEL[b.statut] ?? b.statut}</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setDetailRdv(b) }}>Voir</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* CALENDRIER */}
          {sec === 'calendrier' && (
            <div className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>7 prochains jours</h3>
              </div>
              <div className="cal">
                {days.map((d) => <div className="day" key={d.iso}>{d.label}</div>)}
                {days.map((d) => {
                  const rdvDuJour = weekRdv.filter((b) => b.date_rdv === d.iso)
                  return (
                    <div className="slot" key={d.iso}>
                      {rdvDuJour.length === 0 && <span style={{ color: 'var(--muted)', fontSize: '.75rem' }}>Libre</span>}
                      {rdvDuJour.map((b) => (
                        <div className="ev" key={b.id} style={{ cursor: 'pointer' }} onClick={() => setDetailRdv(b)}>
                          {fmtHeure(b.heure_rdv)} {b.services?.nom ?? ''}
                          {b.profiles?.nom && <div style={{ opacity: .8, fontSize: '.72rem', marginTop: 2 }}>{b.profiles.nom}</div>}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* PRESTATIONS */}
          {sec === 'prestations' && (
            <div className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Mes prestations ({services.length})</h3>
                <button className="btn btn-gold btn-sm" onClick={() => setSvcModal('new')}>Ajouter une prestation</button>
              </div>
              {services.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--muted)' }}>
                  <p style={{ marginBottom: 16 }}>Aucune prestation configurée. Ajoutez vos services pour qu'ils apparaissent sur votre fiche.</p>
                  <button className="btn btn-gold btn-sm" onClick={() => setSvcModal('new')}>Ajouter ma première prestation</button>
                </div>
              ) : (
                <table>
                  <thead><tr><th>Service</th><th>Prix</th><th>Durée</th><th>Visible</th><th></th></tr></thead>
                  <tbody>
                    {services.map((p) => (
                      <tr key={p.id}>
                        <td><b>{p.nom}</b></td>
                        <td>{fcfa(p.prix)}</td>
                        <td>{p.duree}</td>
                        <td>
                          <span
                            style={{ cursor: 'pointer', fontSize: '.8rem', fontWeight: 600, padding: '4px 10px', borderRadius: 999,
                              background: p.actif ? 'rgba(63,125,91,.12)' : 'rgba(135,42,66,.08)',
                              color: p.actif ? 'var(--success)' : 'var(--bordeaux-600)' }}
                            onClick={() => toggleActif(p)}
                            title="Cliquer pour activer / désactiver"
                          >{p.actif ? 'Actif' : 'Masqué'}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setSvcModal(p)}>Modifier</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* CLIENTES */}
          {sec === 'clientes' && (
            <div className="panel">
              <h3>Mes clientes ({clients.length})</h3>
              {clients.length === 0 ? (
                <p className="text-muted">Aucune cliente enregistrée pour l'instant.</p>
              ) : (
                <table>
                  <thead><tr><th>Cliente</th><th>RDV</th><th>Dernière prestation</th></tr></thead>
                  <tbody>
                    {clients.map((c) => (
                      <tr key={c.client_id}>
                        <td><b>{c.profiles?.nom ?? 'Cliente'}</b></td>
                        <td>{c.total_rdv} rendez-vous</td>
                        <td>{c.services?.nom ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* MA FICHE */}
          {sec === 'mafiche' && (
            <FicheEditor salon={salon} onDone={reload} />
          )}

          {/* GALERIE */}
          {sec === 'galerie' && (
            <div className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Galerie avant / après</h3>
                <button className="btn btn-gold btn-sm">Publier une réalisation</button>
              </div>
              <div className="gal">
                {GAL.map(([t, c1, c2], i) => (
                  <Thumb key={i} type={t} c1={c1} c2={c2} style={{ height: 120, borderRadius: 'var(--radius-sm)', position: 'relative' }}>
                    <span className="t">{GALT[i]}</span>
                  </Thumb>
                ))}
              </div>
            </div>
          )}

          {/* ABONNEMENT */}
          {sec === 'abonnement' && (
            <div className="panel">
              <h3>Choisissez votre formule</h3>
              <p className="text-muted" style={{ marginBottom: 22 }}>Gagnez en visibilité et attirez plus de clientes.</p>
              <div className="plans">
                <div className="plan">
                  <b>Standard</b>
                  <div className="price">{fcfa(5000)} <small>/ mois</small></div>
                  <ul>
                    <li>Fiche salon complète</li>
                    <li>Gestion du calendrier</li>
                    <li>Jusqu'à 10 photos</li>
                    <li>Avis et notes clientes</li>
                  </ul>
                  <button className="btn btn-ghost btn-block" style={{ marginTop: 18 }}>Formule actuelle</button>
                </div>
                <div className="plan pro">
                  <span className="tag-pill">Recommandé</span>
                  <b>Premium</b>
                  <div className="price">{fcfa(10000)} <small>/ mois</small></div>
                  <ul>
                    <li>Tout le Standard inclus</li>
                    <li>Mise en avant dans la recherche</li>
                    <li>Photos illimitées</li>
                    <li>Publicité locale ciblée</li>
                  </ul>
                  <button className="btn btn-gold btn-block" style={{ marginTop: 18 }}>Passer en Premium</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {svcModal && (
        <ServiceModal
          salonId={salon.id}
          service={svcModal === 'new' ? null : svcModal}
          onClose={() => setSvcModal(null)}
          onDone={() => { setSvcModal(null); reload() }}
        />
      )}

      {detailRdv && (
        <BookingDetailModal
          booking={detailRdv}
          salon={salon}
          onClose={() => setDetailRdv(null)}
          onUpdate={() => { setDetailRdv(null); reload() }}
        />
      )}
    </>
  )
}
