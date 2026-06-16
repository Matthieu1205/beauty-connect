import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid">
          <div>
            <Link className="brand" to="/"><span className="mark">BC</span><b>Beauty<span>Connect</span></b></Link>
            <p>La plateforme de réservation beauté et coiffure à Abidjan, et bientôt dans toute la Côte d'Ivoire.</p>
          </div>
          <div><h4>Clientes</h4><ul>
            <li><Link to="/recherche">Rechercher un salon</Link></li>
            <li><Link to="/diagnostic">Diagnostic capillaire</Link></li>
            <li><Link to="/connexion">Mon compte</Link></li>
            <li><Link to="/mes-reservations">Mes réservations</Link></li>
          </ul></div>
          <div><h4>Salons partenaires</h4><ul>
            <li><Link to="/inscrire-mon-salon">Inscrire mon salon</Link></li>
            <li><Link to="/inscrire-mon-salon#tarifs">Tarifs d'abonnement</Link></li>
            <li><Link to="/espace-salon">Espace gérant</Link></li>
          </ul></div>
          <div><h4>Contact</h4><ul>
            <li>Abidjan, Côte d'Ivoire</li>
            <li><a href="mailto:contact@beautyconnect.ci">contact@beautyconnect.ci</a></li>
            <li>+225 07 00 00 00 00</li>
          </ul></div>
        </div>
        <div className="legal">
          <span>© {new Date().getFullYear()} BeautyConnect. Tous droits réservés.</span>
          <span>
            <Link to="/legales#cgu">Conditions</Link>
            {' · '}
            <Link to="/legales#privacy">Confidentialité</Link>
            {' · '}
            <Link to="/legales#mentions">Mentions légales</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
