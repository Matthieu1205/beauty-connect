import { hairURI, photoURL } from '../lib/illustration'

/* Affiche une vraie photo par-dessus l'illustration de repli.
   Si la photo ne charge pas, elle disparait et l'illustration reste. */
export default function Thumb({ type, c1 = '#6E1E33', c2 = '#C9A24B', className = '', style = {}, children }) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        backgroundImage: `url("${hairURI(type, c1, c2)}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      <img
        src={photoURL(type)}
        alt={'Coiffure ' + type}
        loading="lazy"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
      />
      {children}
    </div>
  )
}
