import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { COMMUNES, TYPES, COMMUNE_COORDS, fcfa } from '../data/salons'
import { mapEmbedQuery, gmapsViewURL, yangoURL } from '../lib/maps'
import { useSalons } from '../hooks/useSalons'
import SalonCard from '../components/SalonCard'

const css = `
.search-head{background:radial-gradient(700px 380px at 90% -20%,rgba(201,162,75,.2),transparent 60%),var(--cream-2);padding:46px 0;border-bottom:1px solid var(--line)}
.search-head h1{font-size:clamp(1.9rem,3.4vw,2.6rem)}
.layout{display:grid;grid-template-columns:290px 1fr;gap:32px;align-items:start;padding:40px 0 80px}
.filters{position:sticky;top:90px;background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow-sm)}
.filters h4{font-size:.82rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-500);margin:22px 0 12px}
.filters h4:first-child{margin-top:0}
.filter-chips{display:flex;flex-wrap:wrap;gap:8px}
.range-val{display:flex;justify-content:space-between;font-size:.88rem;color:var(--muted);margin-top:6px}
input[type=range]{accent-color:var(--bordeaux-700);padding:0}
.results-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:12px}
.results-top b{color:var(--bordeaux-700)}
.map{height:280px;border-radius:var(--radius);overflow:hidden;border:1px solid var(--line);position:relative}
.map iframe{width:100%;height:100%;border:0;display:block}
.map-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:10px 0 26px}
.map-bar .hint{color:var(--muted);font-size:.9rem}
.map-bar .acts{display:flex;gap:10px;flex-wrap:wrap}
.results-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
.skeleton{background:linear-gradient(90deg,var(--cream-2) 25%,var(--line) 50%,var(--cream-2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:var(--radius);height:280px}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@media (max-width:880px){.layout{grid-template-columns:1fr}.filters{position:static}.results-grid{grid-template-columns:1fr}}
`
const NOTES = [{ l: 'Toutes', v: 0 }, { l: '4,5+', v: 4.5 }, { l: '4,7+', v: 4.7 }, { l: '4,9+', v: 4.9 }]

export default function Search() {
  const [params] = useSearchParams()
  const initCommune = COMMUNES.includes(params.get('commune')) ? params.get('commune') : 'Toutes'
  const initType    = TYPES.includes(params.get('type')) ? params.get('type') : 'Toutes'

  const [commune, setCommune] = useState(initCommune)
  const [type, setType]       = useState(initType)
  const [prix, setPrix]       = useState(20000)
  const [note, setNote]       = useState(0)
  const [sort, setSort]       = useState('note')

  const { salons: list, loading } = useSalons({
    commune, type, prixMax: prix, noteMin: note, sort,
  })

  const isCommune = commune !== 'Toutes'
  const place     = isCommune ? commune + ', Abidjan' : 'Abidjan'
  const center    = isCommune ? (COMMUNE_COORDS[commune] || COMMUNE_COORDS.Abidjan) : COMMUNE_COORDS.Abidjan
  const dest      = list.length ? [list[0].lat, list[0].lng] : center

  function reset() { setCommune('Toutes'); setType('Toutes'); setPrix(20000); setNote(0) }

  return (
    <>
      <style>{css}</style>
      <div className="search-head"><div className="container"><p className="eyebrow">Recherche</p><h1>Trouvez votre salon</h1></div></div>
      <div className="container">
        <div className="layout">
          <aside className="filters">
            <h4>Commune</h4>
            <div className="filter-chips">
              {['Toutes', ...COMMUNES].map((c) => (
                <span key={c} className={'chip' + (commune === c ? ' active' : '')} onClick={() => setCommune(c)}>{c}</span>
              ))}
            </div>
            <h4>Type de coiffure</h4>
            <div className="filter-chips">
              {['Toutes', ...TYPES].map((t) => (
                <span key={t} className={'chip' + (type === t ? ' active' : '')} onClick={() => setType(t)}>{t}</span>
              ))}
            </div>
            <h4>Budget maximum</h4>
            <input type="range" min="2000" max="20000" step="1000" value={prix} onChange={(e) => setPrix(+e.target.value)} />
            <div className="range-val"><span>2 000 FCFA</span><span>{prix >= 20000 ? 'Tout budget' : fcfa(prix)}</span></div>
            <h4>Note minimum</h4>
            <div className="filter-chips">
              {NOTES.map((n) => (
                <span key={n.l} className={'chip' + (note === n.v ? ' active' : '')} onClick={() => setNote(n.v)}>{n.l}</span>
              ))}
            </div>
            <hr className="divider" />
            <button className="btn btn-ghost btn-block btn-sm" onClick={reset}>Réinitialiser</button>
          </aside>

          <main>
            <div className="map">
              <iframe title="Carte des salons" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={mapEmbedQuery(place, isCommune ? 14 : 12)} />
            </div>
            <div className="map-bar">
              <span className="hint">{isCommune ? list.length + ' salon(s) à ' + commune : 'Salons à Abidjan'}</span>
              <div className="acts">
                <a className="btn btn-ghost btn-sm" target="_blank" rel="noopener" href={gmapsViewURL(dest[0], dest[1])}>Ouvrir dans Google Maps</a>
                <a className="btn btn-gold btn-sm" target="_blank" rel="noopener" href={yangoURL(dest[0], dest[1])}>Commander un Yango</a>
              </div>
            </div>
            <div className="results-top">
              <span>{loading ? 'Chargement…' : <><b>{list.length}</b> salons trouvés</>}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 'auto' }}>
                <option value="note">Trier : mieux notés</option>
                <option value="prix">Trier : prix croissant</option>
              </select>
            </div>
            {loading ? (
              <div className="results-grid">
                {[1,2,3,4].map((i) => <div key={i} className="skeleton" />)}
              </div>
            ) : list.length ? (
              <div className="results-grid">{list.map((s) => <SalonCard key={s.id} s={s} />)}</div>
            ) : (
              <p className="text-muted" style={{ padding: '30px 0' }}>Aucun salon ne correspond à ces critères. Essayez d'élargir votre recherche.</p>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
