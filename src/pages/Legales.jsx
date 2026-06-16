import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const css = `
.leg-hero{background:radial-gradient(700px 380px at 90% -20%,rgba(201,162,75,.18),transparent 60%),var(--cream-2);padding:48px 0 40px;border-bottom:1px solid var(--line)}
.leg-layout{display:grid;grid-template-columns:220px 1fr;gap:48px;padding:48px 0 96px;align-items:start}
.leg-nav{position:sticky;top:90px;border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;background:var(--white)}
.leg-nav a{display:block;padding:13px 18px;font-size:.93rem;color:var(--muted);border-bottom:1px solid var(--line);cursor:pointer;transition:all .15s}
.leg-nav a:last-child{border:0}
.leg-nav a.on{background:var(--bordeaux-700);color:var(--cream);font-weight:600}
.leg-nav a:hover:not(.on){background:var(--cream-2);color:var(--ink)}
.leg-content section{margin-bottom:56px;padding-top:8px}
.leg-content h2{font-size:1.5rem;border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:22px}
.leg-content h3{font-size:1.1rem;margin:24px 0 10px}
.leg-content p{color:var(--muted);line-height:1.75;margin-bottom:14px}
.leg-content ul{padding-left:22px;color:var(--muted);line-height:1.75}
.leg-content ul li{margin-bottom:6px}
.leg-content .updated{font-size:.85rem;color:var(--muted);margin-bottom:28px}
.leg-content strong{color:var(--ink)}
@media(max-width:800px){.leg-layout{grid-template-columns:1fr}.leg-nav{position:static;display:flex;flex-wrap:wrap;gap:0}.leg-nav a{flex:1;min-width:120px;text-align:center;border-bottom:none;border-right:1px solid var(--line)}.leg-nav a:last-child{border-right:0}}
`

const SECTIONS = [
  { id: 'cgu',      label: 'Conditions d\'utilisation' },
  { id: 'privacy',  label: 'Politique de confidentialité' },
  { id: 'mentions', label: 'Mentions légales' },
]

export default function Legales() {
  const location = useLocation()
  const [active, setActive] = useState('cgu')

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (hash && SECTIONS.some((s) => s.id === hash)) setActive(hash)
  }, [location.hash])

  function scrollTo(id) {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', '#' + id)
  }

  return (
    <>
      <style>{css}</style>

      <div className="leg-hero">
        <div className="container">
          <p className="eyebrow">BeautyConnect</p>
          <h1>Informations légales</h1>
          <p style={{ color: 'var(--muted)', marginTop: 10 }}>Conditions d'utilisation, protection des données et mentions légales.</p>
        </div>
      </div>

      <div className="container">
        <div className="leg-layout">
          {/* Navigation latérale */}
          <nav className="leg-nav">
            {SECTIONS.map((s) => (
              <a key={s.id} className={active === s.id ? 'on' : ''} onClick={() => scrollTo(s.id)}>
                {s.label}
              </a>
            ))}
          </nav>

          {/* Contenu */}
          <div className="leg-content">

            {/* CGU */}
            <section id="cgu">
              <h2>Conditions Générales d'Utilisation</h2>
              <p className="updated">Dernière mise à jour : 1er janvier 2025</p>

              <h3>1. Objet</h3>
              <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme BeautyConnect, accessible à l'adresse <strong>beautyconnect.ci</strong>, éditée par BeautyConnect CI. En utilisant la plateforme, vous acceptez sans réserve les présentes CGU.</p>

              <h3>2. Description du service</h3>
              <p>BeautyConnect est une plateforme en ligne permettant :</p>
              <ul>
                <li>Aux <strong>clientes</strong> de rechercher des salons de coiffure et de beauté à Abidjan, de consulter leurs prestations et tarifs, et de réserver un rendez-vous en ligne.</li>
                <li>Aux <strong>salons partenaires</strong> de publier leur fiche, de gérer leurs réservations et de développer leur clientèle.</li>
              </ul>

              <h3>3. Inscription et compte utilisateur</h3>
              <p>L'accès à certaines fonctionnalités (réservation, espace salon) requiert la création d'un compte. Vous vous engagez à fournir des informations exactes et à maintenir la confidentialité de vos identifiants. BeautyConnect ne saurait être tenu responsable des conséquences d'une utilisation non autorisée de votre compte.</p>

              <h3>4. Réservations</h3>
              <p>Une réservation effectuée via BeautyConnect constitue un engagement entre la cliente et le salon. BeautyConnect agit en tant qu'intermédiaire technique. Toute annulation doit être effectuée au moins 2 heures avant le rendez-vous via l'espace "Mes réservations". Les conditions d'annulation propres à chaque salon s'appliquent également.</p>

              <h3>5. Avis clients</h3>
              <p>Les avis ne peuvent être publiés que pour des prestations dont le statut a été marqué "Terminé" par le salon. BeautyConnect se réserve le droit de supprimer tout avis injurieux, diffamatoire ou non conforme à la réalité d'une prestation. Un seul avis est autorisé par réservation.</p>

              <h3>6. Responsabilité</h3>
              <p>BeautyConnect ne garantit pas la disponibilité permanente de la plateforme et ne saurait être tenu responsable des dommages directs ou indirects résultant d'une indisponibilité temporaire. La responsabilité relative à la qualité des prestations incombe exclusivement aux salons partenaires.</p>

              <h3>7. Propriété intellectuelle</h3>
              <p>L'ensemble des contenus de la plateforme (logo, textes, design, code) est la propriété exclusive de BeautyConnect CI. Toute reproduction, même partielle, sans autorisation écrite préalable est strictement interdite.</p>

              <h3>8. Modification des CGU</h3>
              <p>BeautyConnect se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par email de toute modification substantielle. L'utilisation de la plateforme après modification vaut acceptation des nouvelles CGU.</p>

              <h3>9. Droit applicable</h3>
              <p>Les présentes CGU sont soumises au droit ivoirien. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents d'Abidjan seront seuls habilités à connaître du différend.</p>
            </section>

            {/* Politique de confidentialité */}
            <section id="privacy">
              <h2>Politique de Confidentialité</h2>
              <p className="updated">Dernière mise à jour : 1er janvier 2025</p>

              <h3>1. Responsable du traitement</h3>
              <p>Le responsable du traitement des données personnelles est <strong>BeautyConnect CI</strong>, dont le siège social est situé à Abidjan, Côte d'Ivoire. Contact : <strong>contact@beautyconnect.ci</strong>.</p>

              <h3>2. Données collectées</h3>
              <p>Nous collectons les données suivantes :</p>
              <ul>
                <li><strong>Données d'identification :</strong> nom, adresse email, numéro de téléphone.</li>
                <li><strong>Données de réservation :</strong> date, heure, prestation choisie, historique des rendez-vous.</li>
                <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées (via des cookies techniques).</li>
                <li><strong>Pour les salons partenaires :</strong> informations professionnelles (nom du salon, commune, services, tarifs).</li>
              </ul>

              <h3>3. Finalités du traitement</h3>
              <p>Vos données sont utilisées pour :</p>
              <ul>
                <li>Gérer votre compte et vos réservations.</li>
                <li>Vous envoyer des confirmations et rappels de rendez-vous par email.</li>
                <li>Améliorer nos services et personnaliser votre expérience.</li>
                <li>Prévenir la fraude et assurer la sécurité de la plateforme.</li>
              </ul>

              <h3>4. Conservation des données</h3>
              <p>Vos données sont conservées pour la durée de vie de votre compte, augmentée d'une période de 3 ans après la dernière activité, conformément aux obligations légales en vigueur.</p>

              <h3>5. Partage des données</h3>
              <p>Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec :</p>
              <ul>
                <li>Les <strong>salons partenaires</strong>, dans la mesure strictement nécessaire à l'exécution d'une réservation.</li>
                <li>Nos <strong>prestataires techniques</strong> (hébergement Supabase, envoi d'emails Resend) dans le respect de leurs politiques de confidentialité respectives.</li>
              </ul>

              <h3>6. Vos droits</h3>
              <p>Conformément à la législation applicable, vous disposez des droits suivants sur vos données personnelles :</p>
              <ul>
                <li>Droit d'accès et de rectification</li>
                <li>Droit à l'effacement ("droit à l'oubli")</li>
                <li>Droit à la portabilité</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
              <p>Pour exercer ces droits, contactez-nous à <strong>contact@beautyconnect.ci</strong>.</p>

              <h3>7. Sécurité</h3>
              <p>BeautyConnect met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction (chiffrement HTTPS, Row Level Security en base de données, tokens d'authentification sécurisés).</p>

              <h3>8. Cookies</h3>
              <p>La plateforme utilise uniquement des cookies techniques strictement nécessaires au bon fonctionnement du service (session, préférences). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.</p>
            </section>

            {/* Mentions légales */}
            <section id="mentions">
              <h2>Mentions Légales</h2>
              <p className="updated">Conformément aux dispositions légales en vigueur en Côte d'Ivoire.</p>

              <h3>Éditeur de la plateforme</h3>
              <ul>
                <li><strong>Raison sociale :</strong> BeautyConnect CI</li>
                <li><strong>Forme juridique :</strong> SARL (en cours d'immatriculation)</li>
                <li><strong>Siège social :</strong> Abidjan, Cocody, Côte d'Ivoire</li>
                <li><strong>Email :</strong> contact@beautyconnect.ci</li>
                <li><strong>Téléphone :</strong> +225 07 00 00 00 00</li>
              </ul>

              <h3>Directeur de la publication</h3>
              <p>Le directeur de la publication est le représentant légal de BeautyConnect CI.</p>

              <h3>Hébergement</h3>
              <ul>
                <li><strong>Hébergeur base de données :</strong> Supabase Inc., 970 Toa Payoh North, Singapour</li>
                <li><strong>Hébergeur frontend :</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
              </ul>

              <h3>Propriété intellectuelle</h3>
              <p>L'ensemble des éléments constituant la plateforme BeautyConnect (structure, textes, logos, graphismes, icônes, images) est la propriété exclusive de BeautyConnect CI et est protégé par les lois relatives à la propriété intellectuelle en vigueur en Côte d'Ivoire et à l'international.</p>
              <p>Toute reproduction totale ou partielle de ces éléments est strictement interdite sans autorisation préalable et écrite de BeautyConnect CI.</p>

              <h3>Liens hypertextes</h3>
              <p>La plateforme BeautyConnect peut contenir des liens vers des sites externes. BeautyConnect CI ne saurait être tenu responsable du contenu de ces sites tiers et de l'utilisation qui pourrait en être faite.</p>

              <h3>Litiges</h3>
              <p>En cas de litige, et à défaut de résolution amiable dans un délai de 30 jours à compter de la saisine écrite, les tribunaux compétents du ressort d'Abidjan (Côte d'Ivoire) seront seuls habilités à connaître du différend.</p>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}
