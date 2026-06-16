import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { PRESTATIONS, COMMUNES, fcfa } from '../data/salons'
import { useSalons } from '../hooks/useSalons'
import SalonCard from '../components/SalonCard'
import Thumb from '../components/Thumb'

const css = `
.hero{position:relative;overflow:hidden;padding:70px 0 90px;background:radial-gradient(900px 500px at 80% -10%,rgba(201,162,75,.22),transparent 60%),radial-gradient(700px 600px at 0% 110%,rgba(110,30,51,.16),transparent 55%),var(--cream)}
.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center}
.hero h1 span{color:var(--bordeaux-700);font-style:italic}
.hero p.lead{font-size:1.2rem;color:var(--muted);margin:22px 0 30px;max-width:520px}
.search-bar{background:var(--white);border:1px solid var(--line);border-radius:var(--radius-lg);padding:14px;box-shadow:var(--shadow);display:grid;grid-template-columns:1.2fr 1fr auto;gap:10px}
.search-bar .sb-field{display:flex;flex-direction:column;padding:6px 14px;border-radius:var(--radius-sm)}
.search-bar .sb-field:first-child{border-right:1px solid var(--line)}
.search-bar label{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold-500);margin-bottom:2px}
.search-bar select{border:none;padding:4px 0;font-size:1.02rem;background:transparent}
.search-bar select:focus{box-shadow:none}
.hero-stats{display:flex;gap:34px;margin-top:34px}
.hero-stats b{display:block;font-size:1.9rem;color:var(--bordeaux-700);font-weight:600}
.hero-stats span{font-size:.9rem;color:var(--muted)}
.hero-visual{position:relative;height:480px}
.hv-card{position:absolute;border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.hv-1{inset:0 30% 35% 0}.hv-2{width:46%;height:52%;right:0;top:8%}.hv-3{width:50%;height:40%;right:6%;bottom:0}
.hv-card .tag{position:absolute;left:16px;bottom:16px;background:rgba(61,14,28,.78);color:var(--cream);padding:7px 14px;border-radius:999px;font-size:.82rem;font-weight:600;z-index:2}
.float-badge{position:absolute;background:var(--white);border-radius:14px;box-shadow:var(--shadow);padding:14px 18px;z-index:3}
.float-badge.top{top:14px;left:-10px}.float-badge.bot{bottom:28px;left:24%}
.float-badge small{display:block;color:var(--muted);font-size:.78rem}
.commune-row{display:flex;gap:14px;flex-wrap:wrap}
.commune-card{flex:1;min-width:150px;border-radius:var(--radius);padding:26px 22px;color:var(--cream);position:relative;overflow:hidden;min-height:150px;display:flex;flex-direction:column;justify-content:flex-end;box-shadow:var(--shadow-sm);transition:transform .25s}
.commune-card:hover{transform:translateY(-5px)}
.commune-card b{font-size:1.25rem;font-weight:600}.commune-card span{font-size:.85rem;opacity:.85}
.steps{counter-reset:s}
.step{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:30px 26px;position:relative}
.step::before{counter-increment:s;content:counter(s);position:absolute;top:-18px;left:26px;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:1.1rem;background:linear-gradient(135deg,var(--gold-400),var(--gold-500));color:var(--bordeaux-900);box-shadow:var(--shadow-gold)}
.step h3{margin:14px 0 8px}.step p{color:var(--muted);font-size:.98rem}
.presta-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.presta{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:22px;transition:border .2s,transform .2s}
.presta:hover{border-color:var(--gold-500);transform:translateY(-3px)}
.presta b{font-size:1.1rem;display:block}.presta .p{color:var(--bordeaux-700);font-weight:600;margin-top:8px}.presta .d{color:var(--muted);font-size:.85rem}
.diag{background:linear-gradient(135deg,var(--bordeaux-800),var(--bordeaux-900));border-radius:var(--radius-lg);color:var(--cream);padding:56px;display:grid;grid-template-columns:1.2fr .8fr;gap:40px;align-items:center;position:relative;overflow:hidden}
.diag::after{content:"";position:absolute;right:-80px;top:-80px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(201,162,75,.4),transparent 70%)}
.diag h2{color:var(--cream)}.diag p{color:rgba(251,247,241,.8);margin:16px 0 26px}
.diag .tag-pill{background:rgba(201,162,75,.2);color:var(--gold-300)}
.diag-card{background:rgba(251,247,241,.08);border:1px solid rgba(201,162,75,.35);border-radius:var(--radius);padding:26px;backdrop-filter:blur(4px);z-index:1}
.diag-card .line{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.12)}
.diag-card .line:last-child{border:0}
.quote{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:28px}
.quote .stars{color:var(--star);letter-spacing:2px}.quote p{margin:14px 0 18px;font-size:1.05rem;font-style:italic}
.quote .who{font-weight:600}.quote .who small{display:block;color:var(--muted);font-weight:400;font-style:normal}
.cta-salon{background:linear-gradient(135deg,var(--gold-400),var(--gold-500));border-radius:var(--radius-lg);padding:56px;text-align:center;color:var(--bordeaux-900)}
.cta-salon h2{color:var(--bordeaux-900)}.cta-salon p{color:rgba(61,14,28,.8);max-width:560px;margin:16px auto 28px;font-size:1.08rem}
@media (max-width:900px){.hero-grid{grid-template-columns:1fr}.hero-visual{display:none}.search-bar{grid-template-columns:1fr}.search-bar .sb-field:first-child{border-right:none;border-bottom:1px solid var(--line)}.presta-grid{grid-template-columns:1fr 1fr}.diag,.cta-salon{padding:36px}.diag{grid-template-columns:1fr}}
`

const communeData = [
  { n: 'Cocody', c: 'linear-gradient(150deg,#6E1E33,#C9A24B)', s: '38 salons' },
  { n: 'Marcory', c: 'linear-gradient(150deg,#511325,#872A42)', s: '24 salons' },
  { n: 'Plateau', c: 'linear-gradient(150deg,#872A42,#D7B968)', s: '19 salons' },
  { n: 'Yopougon', c: 'linear-gradient(150deg,#3D0E1C,#C9A24B)', s: '27 salons' },
  { n: 'Bingerville', c: 'linear-gradient(150deg,#6E1E33,#E7D29A)', s: '12 salons' },
]

export default function Home() {
  const navigate = useNavigate()
  const [commune, setCommune] = useState('Toutes les communes')
  const [type, setType] = useState('Toutes les prestations')
  const { salons: featured } = useSalons({ sort: 'note' })
  const top3 = featured.slice(0, 3)

  function search(e) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (commune !== 'Toutes les communes') p.set('commune', commune)
    if (type !== 'Toutes les prestations') p.set('type', type)
    navigate('/recherche?' + p.toString())
  }

  return (
    <>
      <style>{css}</style>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow reveal">Coiffure & beauté à Abidjan</p>
            <h1 className="reveal" style={{ animationDelay: '.05s' }}>Trouvez le salon parfait,<br /><span>réservez en un instant</span></h1>
            <p className="lead reveal" style={{ animationDelay: '.1s' }}>Comparez les salons proches de vous, consultez les prix avant de vous déplacer et réservez votre prestation en quelques secondes.</p>
            <form className="search-bar reveal" style={{ animationDelay: '.15s' }} onSubmit={search}>
              <div className="sb-field">
                <label>Commune</label>
                <select value={commune} onChange={(e) => setCommune(e.target.value)}>
                  <option>Toutes les communes</option>
                  {COMMUNES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="sb-field">
                <label>Prestation</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option>Toutes les prestations</option>
                  {['Tresses','Braids','Locks','Perruques','Défrisage','Coupe','Coloration'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <button className="btn btn-gold" type="submit">Rechercher</button>
            </form>
            <div className="hero-stats reveal" style={{ animationDelay: '.2s' }}>
              <div><b>120+</b><span>Salons partenaires</span></div>
              <div><b>8</b><span>Communes couvertes</span></div>
              <div><b>4,8</b><span>Note moyenne</span></div>
            </div>
          </div>
          <div className="hero-visual reveal" style={{ animationDelay: '.15s' }}>
            <Thumb type="Tresses" c1="#6E1E33" c2="#C9A24B" className="hv-card hv-1"><span className="tag">Tresses premium</span></Thumb>
            <Thumb type="Locks" c1="#511325" c2="#D7B968" className="hv-card hv-2"><span className="tag">Locks</span></Thumb>
            <Thumb type="Coloration" c1="#872A42" c2="#E7D29A" className="hv-card hv-3"><span className="tag">Coloration</span></Thumb>
            <div className="float-badge top"><span className="rating"><span className="stars" style={{ color: 'var(--star)' }}>★★★★★</span> 4,9</span><small>Maison Awa · Cocody</small></div>
            <div className="float-badge bot"><b style={{ color: 'var(--bordeaux-700)' }}>Réservé</b><small>Aujourd'hui · 14h30</small></div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Explorer par quartier</p>
            <h2>Des salons dans toute la ville</h2>
            <p>Choisissez votre commune et découvrez les meilleures adresses près de chez vous.</p>
          </div>
          <div className="commune-row">
            {communeData.map((c) => (
              <Link key={c.n} className="commune-card" to={'/recherche?commune=' + c.n} style={{ background: c.c }}>
                <b>{c.n}</b><span>{c.s}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--cream-2)' }}>
        <div className="container">
          <div className="section-head center"><p className="eyebrow">Simple et rapide</p><h2>Comment ça marche</h2></div>
          <div className="grid-3 steps">
            <div className="step reveal"><h3>Recherchez</h3><p>Filtrez par commune, prestation, prix et note pour trouver le salon idéal proche de vous.</p></div>
            <div className="step reveal" style={{ animationDelay: '.1s' }}><h3>Réservez</h3><p>Choisissez la date, l'heure et la prestation. Confirmation immédiate par SMS et email.</p></div>
            <div className="step reveal" style={{ animationDelay: '.2s' }}><h3>Profitez</h3><p>Rendez-vous au salon sans attente, puis notez votre expérience pour aider les autres clientes.</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head"><p className="eyebrow">Nos prestations</p><h2>Tout pour vos cheveux</h2><p>Des tresses africaines aux colorations signature, à des prix transparents.</p></div>
          <div className="presta-grid">
            {PRESTATIONS.map((p) => (
              <div className="presta" key={p.nom}><b>{p.nom}</b><div className="p">{fcfa(p.prix)}</div><div className="d">Durée {p.duree}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="diag reveal">
            <div>
              <span className="tag-pill">Exclusivité BeautyConnect</span>
              <h2 style={{ marginTop: 16 }}>Diagnostic capillaire intelligent</h2>
              <p>Renseignez votre type de cheveux, leur longueur et leur épaisseur. Nous suggérons les coiffures adaptées, les salons spécialisés et une estimation de prix, avant même de réserver.</p>
              <Link to="/diagnostic" className="btn btn-gold">Lancer mon diagnostic</Link>
            </div>
            <div className="diag-card">
              <div className="line"><span>Type de cheveux</span><b>Crépus 4C</b></div>
              <div className="line"><span>Longueur</span><b>Mi-longs</b></div>
              <div className="line"><span>Suggestion</span><b style={{ color: 'var(--gold-300)' }}>Locks twists</b></div>
              <div className="line"><span>Estimation</span><b>15 000 FCFA</b></div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--cream-2)' }}>
        <div className="container">
          <div className="section-head"><p className="eyebrow">Sélection</p><h2>Salons les mieux notés</h2></div>
          <div className="grid-3">{top3.map((s) => <SalonCard key={s.id} s={s} />)}</div>
          <div style={{ textAlign: 'center', marginTop: 40 }}><Link to="/recherche" className="btn btn-primary">Voir tous les salons</Link></div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head center"><p className="eyebrow">Elles nous font confiance</p><h2>Avis de nos clientes</h2></div>
          <div className="grid-3">
            <div className="quote reveal"><div className="stars">★★★★★</div><p>Très satisfaite de mes tresses, salon propre et personnel accueillant. J'ai réservé en deux minutes.</p><div className="who">Aïcha K.<small>Cocody</small></div></div>
            <div className="quote reveal" style={{ animationDelay: '.1s' }}><div className="stars">★★★★★</div><p>Plus besoin d'attendre des heures. Je vois les prix à l'avance et je choisis mon créneau.</p><div className="who">Fatou D.<small>Marcory</small></div></div>
            <div className="quote reveal" style={{ animationDelay: '.2s' }}><div className="stars">★★★★★</div><p>Le diagnostic capillaire m'a aidée à choisir la bonne coiffure. Service vraiment moderne.</p><div className="who">Mariam T.<small>Plateau</small></div></div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="cta-salon reveal">
            <p className="eyebrow" style={{ color: 'var(--bordeaux-800)' }}>Vous êtes professionnel</p>
            <h2>Développez votre salon avec BeautyConnect</h2>
            <p>Recevez plus de clientes, gérez vos rendez-vous, réduisez les absences et gagnez en visibilité en ligne.</p>
            <Link to="/connexion?mode=signup&profil=salon" className="btn btn-primary">Inscrire mon salon</Link>
          </div>
        </div>
      </section>
    </>
  )
}
