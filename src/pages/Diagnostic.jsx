import { useState } from 'react'
import { Link } from 'react-router-dom'
import { fcfa, starsStr } from '../data/salons'
import { useSalons } from '../hooks/useSalons'
import Thumb from '../components/Thumb'

const css = `
.diag-hero{background:linear-gradient(135deg,var(--bordeaux-800),var(--bordeaux-900));color:var(--cream);padding:60px 0}
.diag-hero h1{color:var(--cream)}.diag-hero p{color:rgba(251,247,241,.8);max-width:620px;margin-top:14px;font-size:1.1rem}
.diag-hero .tag-pill{background:rgba(201,162,75,.2);color:var(--gold-300)}
.wrap{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start;padding:46px 0 80px}
.form-card,.result-card{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:30px;box-shadow:var(--shadow-sm)}
.opt-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.opt{border:1px solid var(--line);border-radius:var(--radius-sm);padding:13px;text-align:center;cursor:pointer;transition:all .15s;font-size:.94rem}
.opt:hover{border-color:var(--gold-500)}.opt.sel{background:var(--bordeaux-700);color:var(--cream);border-color:var(--bordeaux-700)}
.upload{border:1.5px dashed var(--line);border-radius:var(--radius-sm);padding:24px;text-align:center;color:var(--muted);cursor:pointer;display:block}
.upload:hover{border-color:var(--gold-500);color:var(--bordeaux-700)}
.result-card{position:sticky;top:90px}
.empty-state{text-align:center;padding:30px 10px;color:var(--muted)}
.empty-state .ring{width:80px;height:80px;border-radius:50%;margin:0 auto 18px;background:conic-gradient(var(--gold-500),var(--bordeaux-700),var(--gold-400),var(--bordeaux-700));-webkit-mask:radial-gradient(circle 30px,transparent 98%,#000)}
.suggestion{border:1px solid var(--line);border-radius:var(--radius-sm);padding:16px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center}
.suggestion b{font-size:1.05rem}.suggestion .est{color:var(--bordeaux-700);font-weight:600}
.match-salon{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}
.match-salon:last-child{border:0}
.match-salon .av{width:46px;height:46px;border-radius:12px}
@media (max-width:900px){.wrap{grid-template-columns:1fr}.result-card{position:static}}
`

const Q = {
  type:     ['Crépus 4C','Frisés 3C','Bouclés 3A','Défrisés','Naturels','Locks'],
  long:     ['Courts','Mi-longs','Longs'],
  epais:    ['Fins','Moyens','Épais'],
  objectif: ['Protéger','Styliser','Entretenir','Changer'],
}

function suggestions(type, objectif, long) {
  let base = []
  if (type === 'Crépus 4C' || type === 'Naturels') base = [['Locks twists', 15000], ['Tresses collées', 10000], ['Vanilles', 12000]]
  else if (type === 'Frisés 3C')  base = [['Braids', 12000], ['Tresses', 10000], ['Twist out', 8000]]
  else if (type === 'Bouclés 3A') base = [['Coupe dégradée', 4000], ['Coloration', 14000], ['Soin hydratant', 6000]]
  else if (type === 'Défrisés')   base = [['Coupe', 3000], ['Coloration', 14000], ['Soin réparateur', 7000]]
  else if (type === 'Locks')      base = [['Entretien locks', 9000], ['Coloration locks', 14000], ['Retwist', 8000]]
  else base = [['Tresses', 10000], ['Perruque sur mesure', 18000], ['Coupe', 3000]]
  if (objectif === 'Protéger') base.unshift(['Style protecteur (box braids)', 13000])
  if (objectif === 'Changer')  base.unshift(['Perruque relooking', 18000])
  if (long === 'Longs')        base.push(['Locks longues entretien', 12000])
  const seen = new Set()
  return base.filter(([n]) => (seen.has(n) ? false : seen.add(n))).slice(0, 4)
}

// Renvoie les types de prestation pertinents selon le profil
function keyTypes(type, objectif) {
  if (type === 'Crépus 4C' || type === 'Naturels' || type === 'Frisés 3C') return ['Tresses','Locks','Braids']
  if (type === 'Locks')      return ['Locks']
  if (type === 'Défrisés')   return ['Coupe','Coloration','Défrisage']
  if (type === 'Bouclés 3A') return ['Coupe','Coloration']
  if (objectif === 'Changer') return ['Perruques','Coloration']
  return ['Tresses','Coupe']
}

function OptGroup({ items, value, onPick }) {
  return (
    <div className="opt-grid3">
      {items.map((v) => (
        <div key={v} className={'opt' + (value === v ? ' sel' : '')} onClick={() => onPick(v)}>{v}</div>
      ))}
    </div>
  )
}

export default function Diagnostic() {
  const [type,     setType]     = useState(null)
  const [long,     setLong]     = useState(null)
  const [epais,    setEpais]    = useState(null)
  const [objectif, setObjectif] = useState(null)
  const [photo,    setPhoto]    = useState('')
  const [result,   setResult]   = useState(null)

  const { salons } = useSalons({})

  function analyse() {
    if (!type || !long || !epais) {
      alert('Veuillez renseigner au moins le type, la longueur et l\'épaisseur.')
      return
    }
    const sug  = suggestions(type, objectif, long)
    const prixMoy = Math.round(sug.reduce((a, [, p]) => a + p, 0) / sug.length / 500) * 500
    const keys = keyTypes(type, objectif)

    // Filtrer les vrais salons Supabase selon les types correspondants
    const matched = salons
      .filter((s) => (s.types ?? []).some((tp) => keys.includes(tp)))
      .sort((a, b) => (b.note ?? 0) - (a.note ?? 0))
      .slice(0, 3)

    const pool = matched.length ? matched : salons.slice(0, 3)
    setResult({ sug, prixMoy, pool })
  }

  return (
    <>
      <style>{css}</style>
      <div className="diag-hero">
        <div className="container">
          <span className="tag-pill">Exclusivité BeautyConnect</span>
          <h1 style={{ marginTop: 14 }}>Diagnostic capillaire</h1>
          <p>Répondez à quelques questions sur vos cheveux. Nous vous suggérons les coiffures adaptées, les salons spécialisés et une estimation de prix, avant de réserver.</p>
        </div>
      </div>

      <div className="container">
        <div className="wrap">
          <div className="form-card">
            <div className="field"><label>Type de cheveux</label><OptGroup items={Q.type}     value={type}     onPick={setType} /></div>
            <div className="field"><label>Longueur</label>        <OptGroup items={Q.long}     value={long}     onPick={setLong} /></div>
            <div className="field"><label>Épaisseur</label>       <OptGroup items={Q.epais}    value={epais}    onPick={setEpais} /></div>
            <div className="field"><label>Objectif recherché</label><OptGroup items={Q.objectif} value={objectif} onPick={setObjectif} /></div>
            <div className="field">
              <label>Photo de vos cheveux <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(facultatif)</span></label>
              <label className="upload" htmlFor="photo">
                {photo ? 'Photo ajoutée : ' + photo : 'Ajouter une photo pour une suggestion plus précise'}
              </label>
              <input type="file" id="photo" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => setPhoto(e.target.files[0] ? e.target.files[0].name : '')} />
            </div>
            <button className="btn btn-gold btn-block" onClick={analyse}>Obtenir mes recommandations</button>
          </div>

          <div className="result-card">
            {!result ? (
              <div className="empty-state">
                <div className="ring" />
                <h3>Vos recommandations</h3>
                <p>Renseignez vos informations puis lancez l'analyse pour découvrir les coiffures et salons faits pour vous.</p>
              </div>
            ) : (
              <div>
                <p className="eyebrow">Votre profil</p>
                <h3 style={{ margin: '6px 0 4px' }}>{type} · {long} · {epais}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
                  Objectif : {objectif || 'non précisé'}. Estimation moyenne autour de{' '}
                  <b style={{ color: 'var(--bordeaux-700)' }}>{fcfa(result.prixMoy)}</b>.
                </p>

                <p className="eyebrow">Coiffures recommandées</p>
                <div style={{ margin: '12px 0 22px' }}>
                  {result.sug.map(([n, p]) => (
                    <div className="suggestion" key={n}>
                      <b>{n}</b><span className="est">≈ {fcfa(p)}</span>
                    </div>
                  ))}
                </div>

                <p className="eyebrow">Salons spécialisés</p>
                <div style={{ marginTop: 12 }}>
                  {result.pool.map((s) => (
                    <Link className="match-salon" to={'/salon/' + s.id} key={s.id}>
                      <Thumb type={(s.types ?? [])[0]} c1={s.c1} c2={s.c2} className="av" />
                      <span style={{ flex: 1 }}>
                        <b>{s.nom}</b><br />
                        <small style={{ color: 'var(--muted)' }}>
                          {s.commune} · <span style={{ color: 'var(--star)' }}>{starsStr(s.note ?? 0)}</span> {s.note ?? '—'}
                        </small>
                      </span>
                      <span className="btn btn-ghost btn-sm">Voir</span>
                    </Link>
                  ))}
                </div>
                <Link to="/recherche" className="btn btn-gold btn-block" style={{ marginTop: 22 }}>
                  Réserver maintenant
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
