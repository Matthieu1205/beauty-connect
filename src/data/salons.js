export const SALONS = [
  { id: 1, nom: 'Maison Awa', commune: 'Cocody', quartier: 'Riviera Golf', note: 4.9, avis: 214, prixMin: 3000, types: ['Tresses','Locks','Coupe','Coloration'], desc: 'Institut haut de gamme specialise dans les tresses fines et les soins capillaires premium.', c1: '#6E1E33', c2: '#C9A24B', lat: 5.3599, lng: -3.9803 },
  { id: 2, nom: 'Studio Nappy', commune: 'Marcory', quartier: 'Zone 4', note: 4.7, avis: 168, prixMin: 2500, types: ['Braids','Locks','Défrisage'], desc: 'Specialiste du cheveu naturel et des locks entretenus avec produits bio.', c1: '#872A42', c2: '#D7B968', lat: 5.3002, lng: -3.9950 },
  { id: 3, nom: 'Belle Époque', commune: 'Plateau', quartier: 'Centre', note: 4.8, avis: 301, prixMin: 4000, types: ['Coloration','Coupe','Perruques'], desc: 'Salon elegant au coeur du Plateau, expert en colorations et poses de perruques.', c1: '#511325', c2: '#E7D29A', lat: 5.3247, lng: -4.0218 },
  { id: 4, nom: 'Tresses & Co', commune: 'Yopougon', quartier: 'Selmer', note: 4.6, avis: 142, prixMin: 2000, types: ['Tresses','Braids','Défrisage'], desc: 'Le rendez-vous des tresses africaines, rapide et soigne, a prix accessible.', c1: '#3D0E1C', c2: '#C9A24B', lat: 5.3450, lng: -4.0850 },
  { id: 5, nom: 'Salon Royal', commune: 'Cocody', quartier: 'Angré', note: 4.9, avis: 256, prixMin: 5000, types: ['Perruques','Coloration','Coupe'], desc: 'Experience luxe : perruques sur mesure et colorations signature.', c1: '#511325', c2: '#D7B968', lat: 5.3960, lng: -3.9840 },
  { id: 6, nom: 'Afro Glam', commune: 'Bingerville', quartier: 'Centre-ville', note: 4.5, avis: 98, prixMin: 2500, types: ['Locks','Tresses','Coupe'], desc: 'Ambiance chaleureuse et coiffures afro tendance pour toute occasion.', c1: '#872A42', c2: '#C9A24B', lat: 5.3550, lng: -3.8860 },
];

export const PRESTATIONS = [
  { nom: 'Tresses', prix: 10000, duree: '2h' },
  { nom: 'Braids', prix: 12000, duree: '2h30' },
  { nom: 'Locks', prix: 15000, duree: '3h' },
  { nom: 'Perruques', prix: 18000, duree: '1h30' },
  { nom: 'Défrisage', prix: 7000, duree: '1h' },
  { nom: 'Coupe', prix: 3000, duree: '30 min' },
  { nom: 'Coloration', prix: 14000, duree: '2h' },
];

export const COMMUNES = ['Cocody','Marcory','Plateau','Yopougon','Bingerville'];
export const TYPES = ['Tresses','Braids','Locks','Perruques','Défrisage','Coupe','Coloration'];

export const COMMUNE_COORDS = {
  Cocody: [5.3599, -3.9803], Marcory: [5.3002, -3.9950], Plateau: [5.3247, -4.0218],
  Yopougon: [5.3450, -4.0850], Bingerville: [5.3550, -3.8860], Abidjan: [5.3364, -4.0267],
};

export const fcfa = (n) => n.toLocaleString('fr-FR') + ' FCFA';
export const starsStr = (n) => '★★★★★'.slice(0, Math.round(n)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(n));
