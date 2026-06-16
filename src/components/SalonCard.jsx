import { Link } from 'react-router-dom'
import Thumb from './Thumb'
import { fcfa, starsStr } from '../data/salons'

export default function SalonCard({ s }) {
  // Supabase retourne prix_min, les données mock retournent prixMin
  const prixMin = s.prix_min ?? s.prixMin ?? 0
  const nbAvis  = s.nb_avis  ?? s.avis   ?? 0

  return (
    <Link className="card salon-card reveal" to={'/salon/' + s.id} style={{ display: 'block' }}>
      <Thumb type={s.types?.[0]} c1={s.c1} c2={s.c2} className="thumb">
        <span className="badge">{s.commune}</span>
      </Thumb>
      <div className="body">
        <h3>{s.nom}</h3>
        <div className="meta">{s.quartier} · {s.commune}</div>
        <div className="row">
          <span className="rating">
            <span className="stars">{starsStr(s.note)}</span> {s.note}
            {nbAvis > 0 && <span className="text-muted" style={{ fontWeight: 400, fontSize: '.85rem' }}> ({nbAvis})</span>}
          </span>
          <span className="price-tag">dès {fcfa(prixMin)}</span>
        </div>
      </div>
    </Link>
  )
}
