import { Link } from 'react-router-dom'

const css = `
.ins-hero{background:linear-gradient(135deg,var(--bordeaux-800),var(--bordeaux-900));color:var(--cream);padding:72px 0 80px;position:relative;overflow:hidden}
.ins-hero::after{content:"";position:absolute;right:-100px;top:-100px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(201,162,75,.35),transparent 70%)}
.ins-hero h1{color:var(--cream);max-width:640px}
.ins-hero p{color:rgba(251,247,241,.8);max-width:580px;margin:18px 0 32px;font-size:1.12rem;line-height:1.7}
.ins-hero-actions{display:flex;gap:14px;flex-wrap:wrap}
.stat-band{background:var(--cream-2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.stat-band .inner{display:flex;justify-content:center;gap:56px;padding:32px 0;flex-wrap:wrap}
.stat-band .stat b{display:block;font-size:2rem;color:var(--bordeaux-700);font-weight:600;line-height:1.1}
.stat-band .stat span{font-size:.9rem;color:var(--muted)}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.feat{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:30px 26px}
.feat .icon{width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,var(--gold-400),var(--gold-500));display:grid;place-items:center;margin-bottom:18px}
.feat h3{font-size:1.1rem;margin-bottom:8px}
.feat p{color:var(--muted);font-size:.95rem;line-height:1.6}
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.plan{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:30px;position:relative}
.plan.popular{border-color:var(--gold-500);box-shadow:0 0 0 3px rgba(201,162,75,.18)}
.plan .badge-pop{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--gold-400),var(--gold-500));color:var(--bordeaux-900);font-size:.78rem;font-weight:700;padding:5px 16px;border-radius:999px;white-space:nowrap}
.plan h3{font-size:1.1rem;margin-bottom:6px}
.plan .price{font-size:2.1rem;font-weight:600;color:var(--bordeaux-700);line-height:1.1;margin:14px 0 4px}
.plan .price small{font-size:1rem;font-weight:400;color:var(--muted)}
.plan .period{font-size:.85rem;color:var(--muted);margin-bottom:22px}
.plan ul{list-style:none;padding:0;margin:0 0 26px}
.plan ul li{padding:8px 0;border-bottom:1px solid var(--line);font-size:.94rem;display:flex;align-items:center;gap:10px}
.plan ul li:last-child{border:0}
.plan ul li::before{content:"✓";color:var(--success);font-weight:700;flex-shrink:0}
.how-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.how-step{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:28px 22px;text-align:center;position:relative}
.how-step .num{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--gold-400),var(--gold-500));color:var(--bordeaux-900);font-weight:700;font-size:1.1rem;display:grid;place-items:center;margin:0 auto 16px}
.how-step h4{margin-bottom:6px;font-size:1rem}
.how-step p{color:var(--muted);font-size:.88rem}
.testimonial-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.testimonial{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:26px}
.testimonial .stars{color:var(--star);letter-spacing:2px;margin-bottom:14px}
.testimonial p{font-style:italic;color:var(--ink);line-height:1.6;margin-bottom:16px}
.testimonial .who{font-weight:600;font-size:.93rem}
.testimonial .who small{display:block;color:var(--muted);font-weight:400}
.ins-cta{background:linear-gradient(135deg,var(--gold-400),var(--gold-500));border-radius:var(--radius-lg);padding:60px;text-align:center;color:var(--bordeaux-900)}
.ins-cta h2{color:var(--bordeaux-900)}.ins-cta p{color:rgba(61,14,28,.8);max-width:520px;margin:16px auto 28px;font-size:1.05rem}
.ins-cta-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
@media(max-width:900px){.feat-grid,.pricing-grid,.how-grid,.testimonial-grid{grid-template-columns:1fr}.ins-cta{padding:36px}}
@media(max-width:600px){.stat-band .inner{gap:28px}.ins-hero-actions{flex-direction:column}}
`

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--bordeaux-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    title: 'Agenda en ligne',
    desc: 'Vos clientes réservent directement sur votre fiche, 24h/24. Plus de rendez-vous manqués, plus de doubles réservations.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--bordeaux-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    ),
    title: 'Tableau de bord',
    desc: 'Suivez vos revenus, vos clientes et votre taux de présence en temps réel depuis votre espace gérant.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--bordeaux-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/>
      </svg>
    ),
    title: 'Notifications automatiques',
    desc: 'Vos clientes reçoivent un email de confirmation à chaque réservation. Moins d\'absences, plus de sérénité.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--bordeaux-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
      </svg>
    ),
    title: 'Avis clients',
    desc: 'Chaque prestation terminée peut être notée. Construisez votre réputation et gagnez en visibilité.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--bordeaux-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    title: 'Fiche salon optimisée',
    desc: 'Une page dédiée avec vos prestations, vos prix, vos photos et votre localisation. Visible par des milliers de clientes.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--bordeaux-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Paiements sécurisés',
    desc: 'Vos revenus sont suivis dans votre dashboard. Encaissement sur place ou pré-paiement selon votre formule.',
  },
]

const PLANS = [
  {
    name: 'Essentiel',
    price: 'Gratuit',
    period: 'Pour démarrer',
    items: ['Fiche salon publique', 'Jusqu\'à 3 prestations', '20 réservations/mois', 'Notifications email', 'Support communauté'],
    cta: 'Commencer gratuitement',
    popular: false,
  },
  {
    name: 'Pro',
    price: '9 900',
    period: 'FCFA / mois',
    items: ['Fiche salon optimisée', 'Prestations illimitées', 'Réservations illimitées', 'Dashboard complet', 'Rappels SMS clients', 'Support prioritaire'],
    cta: 'Essai gratuit 30 jours',
    popular: true,
  },
  {
    name: 'Premium',
    price: '19 900',
    period: 'FCFA / mois',
    items: ['Tout le plan Pro', 'Mise en avant dans les résultats', 'Statistiques avancées', 'Multi-coiffeuses', 'Manager de compte dédié', 'Intégration WhatsApp'],
    cta: 'Contacter les ventes',
    popular: false,
  },
]

const STEPS = [
  { num: 1, title: 'Créez votre compte', desc: 'Inscription en 2 minutes, sans carte bancaire.' },
  { num: 2, title: 'Remplissez votre fiche', desc: 'Ajoutez vos prestations, tarifs et disponibilités.' },
  { num: 3, title: 'Recevez des clientes', desc: 'Votre salon apparaît immédiatement dans les résultats.' },
  { num: 4, title: 'Gérez votre agenda', desc: 'Confirmez, annulez ou reschedulez depuis votre dashboard.' },
]

const TEMOIGNAGES = [
  {
    stars: '★★★★★',
    text: 'Depuis que j\'ai rejoint BeautyConnect, j\'ai 30% de rendez-vous en plus. Les clientes réservent même la nuit quand je dors.',
    name: 'Mariama S.',
    salon: 'Salon Mariama · Cocody',
  },
  {
    stars: '★★★★★',
    text: 'Le dashboard est vraiment pratique. Je vois mes revenus du mois, qui vient aujourd\'hui, et mes meilleures clientes, tout en un coup d\'œil.',
    name: 'Awa D.',
    salon: 'Studio Awa · Marcory',
  },
  {
    stars: '★★★★★',
    text: 'Les clientes qui réservent en ligne arrivent toujours. Avant je perdais du temps avec des gens qui ne venaient pas.',
    name: 'Fatou K.',
    salon: 'Belle Coiffure · Yopougon',
  },
]

export default function InscriptionSalon() {
  return (
    <>
      <style>{css}</style>

      {/* Hero */}
      <section className="ins-hero">
        <div className="container">
          <span className="tag-pill" style={{ background: 'rgba(201,162,75,.2)', color: 'var(--gold-300)' }}>Espace professionnel</span>
          <h1 style={{ marginTop: 16 }}>Développez votre salon avec BeautyConnect</h1>
          <p>Rejoignez plus de 120 salons partenaires à Abidjan. Recevez plus de clientes, gérez vos rendez-vous en ligne et construisez votre réputation.</p>
          <div className="ins-hero-actions">
            <Link to="/connexion?mode=signup&profil=salon" className="btn btn-gold" style={{ fontSize: '1.05rem', padding: '14px 28px' }}>
              Inscrire mon salon gratuitement
            </Link>
            <a href="#tarifs" className="btn" style={{ border: '1px solid rgba(201,162,75,.5)', color: 'var(--gold-300)', background: 'transparent', fontSize: '1.05rem', padding: '14px 28px' }}>
              Voir les tarifs
            </a>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <div className="stat-band">
        <div className="container">
          <div className="inner">
            <div className="stat"><b>120+</b><span>Salons partenaires</span></div>
            <div className="stat"><b>8 500+</b><span>Réservations / mois</span></div>
            <div className="stat"><b>4,8</b><span>Note moyenne des salons</span></div>
            <div className="stat"><b>8</b><span>Communes couvertes</span></div>
          </div>
        </div>
      </div>

      {/* Fonctionnalités */}
      <section>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Tout ce dont vous avez besoin</p>
            <h2>Une plateforme complète pour votre salon</h2>
            <p>De la réservation en ligne à la gestion des avis, BeautyConnect s'occupe de tout pour que vous puissiez vous concentrer sur votre art.</p>
          </div>
          <div className="feat-grid">
            {FEATURES.map((f) => (
              <div className="feat reveal" key={f.title}>
                <div className="icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section style={{ background: 'var(--cream-2)' }}>
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Simple et rapide</p>
            <h2>Rejoignez-nous en 4 étapes</h2>
          </div>
          <div className="how-grid">
            {STEPS.map((s) => (
              <div className="how-step reveal" key={s.num}>
                <div className="num">{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs">
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Tarifs transparents</p>
            <h2>Choisissez votre formule</h2>
            <p>Commencez gratuitement, passez au Pro quand vous êtes prêt.</p>
          </div>
          <div className="pricing-grid">
            {PLANS.map((plan) => (
              <div className={'plan reveal' + (plan.popular ? ' popular' : '')} key={plan.name}>
                {plan.popular && <div className="badge-pop">Le plus populaire</div>}
                <h3>{plan.name}</h3>
                <div className="price">
                  {plan.price === 'Gratuit' ? 'Gratuit' : <>{plan.price.toLocaleString('fr-FR')} <small>FCFA</small></>}
                </div>
                <div className="period">{plan.period}</div>
                <ul>
                  {plan.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <Link
                  to="/connexion?mode=signup&profil=salon"
                  className={'btn btn-block' + (plan.popular ? ' btn-gold' : ' btn-ghost')}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section style={{ background: 'var(--cream-2)' }}>
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Ils nous font confiance</p>
            <h2>Ce que disent nos partenaires</h2>
          </div>
          <div className="testimonial-grid">
            {TEMOIGNAGES.map((t) => (
              <div className="testimonial reveal" key={t.name}>
                <div className="stars">{t.stars}</div>
                <p>"{t.text}"</p>
                <div className="who">{t.name}<small>{t.salon}</small></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section>
        <div className="container">
          <div className="ins-cta reveal">
            <p className="eyebrow" style={{ color: 'var(--bordeaux-800)' }}>Prêt à vous lancer ?</p>
            <h2>Inscrivez votre salon aujourd'hui</h2>
            <p>Rejoignez les salons partenaires et commencez à recevoir des réservations en ligne dès demain.</p>
            <div className="ins-cta-actions">
              <Link to="/connexion?mode=signup&profil=salon" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '14px 28px' }}>
                Commencer gratuitement
              </Link>
              <a href="mailto:contact@beautyconnect.ci" className="btn btn-ghost" style={{ fontSize: '1.05rem', padding: '14px 28px' }}>
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
