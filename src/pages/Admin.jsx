import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminDashboard } from '../hooks/useAdminDashboard'

const css = `
.dash{display:grid;grid-template-columns:250px 1fr;min-height:100vh;background:var(--cream-2)}
.side{background:var(--bordeaux-900);color:var(--cream);padding:26px 18px;position:sticky;top:0;height:100vh;overflow-y:auto}
.side .brand{color:var(--cream);margin-bottom:6px}.side .brand b,.side .brand b span{color:var(--cream)}
.side .role{color:var(--gold-300);font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:30px;padding-left:50px}
.side nav a{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:var(--radius-sm);color:rgba(251,247,241,.78);font-size:.97rem;margin-bottom:4px;cursor:pointer;transition:all .18s}
.side nav a:hover{background:rgba(255,255,255,.06);color:var(--cream)}
.side nav a.on{background:linear-gradient(135deg,var(--gold-400),var(--gold-500));color:var(--bordeaux-900);font-weight:600}
.side .dot{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.8}
.dmain{padding:30px 38px}
.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}.topbar h1{font-size:1.7rem}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:24px}
.kpi{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:20px}
.kpi span{color:var(--muted);font-size:.88rem}.kpi b{display:block;font-size:1.9rem;color:var(--bordeaux-700);font-weight:600;margin-top:4px}
.kpi .delta{font-size:.82rem;color:var(--success)}
.kpi .delta-warn{font-size:.82rem;color:#c47f1a}
.row2{display:grid;grid-template-columns:1.5fr 1fr;gap:22px}
.panel{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:24px;margin-bottom:22px}
.panel h3{margin-bottom:16px}
.chart{display:flex;align-items:flex-end;gap:14px;height:200px;padding-top:10px}
.chart .col{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px}
.chart .bar{width:100%;border-radius:10px 10px 0 0;background:linear-gradient(180deg,var(--gold-400),var(--bordeaux-700))}
.chart small{color:var(--muted);font-size:.78rem}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding:10px 12px;border-bottom:1px solid var(--line)}
td{padding:14px 12px;border-bottom:1px solid var(--line);font-size:.95rem}tr:last-child td{border:0}
.status{padding:5px 12px;border-radius:999px;font-size:.8rem;font-weight:600}
.status.ok{background:rgba(63,125,91,.12);color:var(--success)}
.status.wait{background:rgba(201,162,75,.16);color:#9a7a1e}
.status.bad{background:rgba(135,42,66,.12);color:var(--bordeaux-600)}
.verif{display:flex;gap:6px;flex-wrap:wrap}
.verif span{font-size:.74rem;padding:3px 9px;border-radius:999px;background:rgba(63,125,91,.12);color:var(--success)}
.actions{display:flex;gap:8px}
.empty-row{text-align:center;padding:32px;color:var(--muted);font-size:.95rem}
@media (max-width:900px){.dash{grid-template-columns:1fr}.side{position:static;height:auto}.kpis{grid-template-columns:1fr 1fr}.row2{grid-template-columns:1fr}}
`

const NAV = [
  ['apercu',       'Tableau de bord'],
  ['salons',       'Salons'],
  ['clientes',     'Clientes'],
  ['reservations', 'Réservations'],
  ['paiements',    'Paiements'],
  ['reclamations', 'Réclamations'],
]

function fcfa(n) {
  if (!n && n !== 0) return '—'
  return Number(n).toLocaleString('fr-FR') + ' FCFA'
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtHeure(h) {
  if (!h) return ''
  return h.slice(0, 5)
}

const STATUT_CLASS  = { confirme: 'ok',   en_attente: 'wait', annule: 'bad' }
const STATUT_LABEL  = { confirme: 'Confirmée', en_attente: 'En attente', annule: 'Annulée' }

const PAIEMENTS = [
  { salon: 'Maison Awa',    plan: 'Premium',  montant: '19 900', date: '01 juin 2026', st: 'ok' },
  { salon: 'Studio Nappy',  plan: 'Pro',       montant: '9 900',  date: '01 juin 2026', st: 'ok' },
  { salon: 'Belle Époque',  plan: 'Premium',  montant: '19 900', date: '01 juin 2026', st: 'ok' },
  { salon: 'Tresses & Co',  plan: 'Pro',       montant: '9 900',  date: '01 juin 2026', st: 'wait' },
  { salon: 'Salon Royal',   plan: 'Premium',  montant: '19 900', date: '15 mai 2026', st: 'bad' },
]

const RECLAMATIONS = [
  { id: '#C-412', cliente: 'Awa S.',   salon: 'Tresses & Co', motif: 'Retard sur rendez-vous', date: '14 juin 2026', st: 'ok' },
  { id: '#C-411', cliente: 'Nadia B.', salon: 'Afro Glam',    motif: 'Annulation tardive',     date: '13 juin 2026', st: 'wait' },
  { id: '#C-410', cliente: 'Linda K.', salon: 'Studio Nappy', motif: 'Prestation non conforme', date: '10 juin 2026', st: 'bad' },
  { id: '#C-409', cliente: 'Fatou D.', salon: 'Belle Époque', motif: 'Prix différent du site',  date: '8 juin 2026',  st: 'ok' },
]

const RECL_LABELS = { ok: 'Résolue', wait: 'En cours', bad: 'Ouverte' }

export default function Admin() {
  const [sec, setSec] = useState('apercu')
  const { loading, kpis, salons, pendingSalons, clientes, bookings, communeStats, validerSalon, refuserSalon } = useAdminDashboard()

  return (
    <>
      <style>{css}</style>
      <div className="dash">
        <aside className="side">
          <Link className="brand" to="/"><span className="mark">BC</span><b>Beauty<span>Connect</span></b></Link>
          <div className="role">Administration</div>
          <nav>
            {NAV.map(([k, l]) => (
              <a key={k} className={sec === k ? 'on' : ''} onClick={() => setSec(k)}>
                <span className="dot" />{l}
                {k === 'salons' && kpis.pending > 0 && (
                  <span style={{ marginLeft: 'auto', background: 'var(--bordeaux-600)', color: '#fff', borderRadius: 999, fontSize: '.72rem', padding: '2px 7px', fontWeight: 700 }}>
                    {kpis.pending}
                  </span>
                )}
              </a>
            ))}
          </nav>
        </aside>

        <main className="dmain">
          <div className="topbar">
            <div>
              <p className="eyebrow">Vue d'ensemble</p>
              <h1>{NAV.find(([k]) => k === sec)?.[1] ?? 'Tableau de bord'}</h1>
            </div>
            <Link to="/" className="btn btn-ghost btn-sm">Quitter</Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>Chargement…</div>
          ) : (
            <>
              {sec === 'apercu' && (
                <>
                  <div className="kpis">
                    <div className="kpi">
                      <span>Réservations (mois)</span>
                      <b>{kpis.bookings}</b>
                      <span className="delta">ce mois</span>
                    </div>
                    <div className="kpi">
                      <span>Salons actifs</span>
                      <b>{kpis.salons}</b>
                      {kpis.pending > 0 && <span className="delta-warn">{kpis.pending} en attente</span>}
                    </div>
                    <div className="kpi">
                      <span>Clientes inscrites</span>
                      <b>{kpis.clientes}</b>
                    </div>
                    <div className="kpi">
                      <span>Total réservations</span>
                      <b>{bookings.length}</b>
                      <span className="delta">chargées</span>
                    </div>
                  </div>

                  <div className="row2">
                    <div className="panel">
                      <h3>Réservations récentes</h3>
                      <table>
                        <thead>
                          <tr><th>Cliente</th><th>Salon</th><th>Prestation</th><th>Date</th><th>Montant</th><th>Statut</th></tr>
                        </thead>
                        <tbody>
                          {bookings.slice(0, 6).map((b) => (
                            <tr key={b.id}>
                              <td><b>{b.profiles?.nom ?? '—'}</b></td>
                              <td>{b.salons?.nom ?? '—'}</td>
                              <td>{b.services?.nom ?? '—'}</td>
                              <td style={{ color: 'var(--muted)' }}>{fmtDate(b.date_rdv)} {fmtHeure(b.heure_rdv)}</td>
                              <td style={{ fontWeight: 600, color: 'var(--bordeaux-700)' }}>{fcfa(b.montant)}</td>
                              <td><span className={'status ' + (STATUT_CLASS[b.statut] ?? 'wait')}>{STATUT_LABEL[b.statut] ?? b.statut}</span></td>
                            </tr>
                          ))}
                          {bookings.length === 0 && (
                            <tr><td colSpan={6} className="empty-row">Aucune réservation pour le moment.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="panel">
                      <h3>Salons par commune</h3>
                      <table>
                        <tbody>
                          {communeStats.slice(0, 8).map(([commune, count]) => (
                            <tr key={commune}>
                              <td>{commune}</td>
                              <td style={{ textAlign: 'right' }}><b>{count}</b> salon{count > 1 ? 's' : ''}</td>
                            </tr>
                          ))}
                          {communeStats.length === 0 && (
                            <tr><td colSpan={2} className="empty-row">Aucun salon actif.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {pendingSalons.length > 0 && (
                    <div className="panel">
                      <h3>Salons en attente de validation ({pendingSalons.length})</h3>
                      <table>
                        <thead>
                          <tr><th>Salon</th><th>Commune</th><th>Gérant</th><th>Statut</th><th></th></tr>
                        </thead>
                        <tbody>
                          {pendingSalons.map((s) => (
                            <tr key={s.id}>
                              <td><b>{s.nom}</b><br /><small style={{ color: 'var(--muted)' }}>{s.quartier}</small></td>
                              <td>{s.commune}</td>
                              <td>{s.profiles?.nom ?? '—'}<br /><small style={{ color: 'var(--muted)' }}>{s.profiles?.telephone ?? ''}</small></td>
                              <td><span className="status wait">A valider</span></td>
                              <td>
                                <div className="actions">
                                  <button className="btn btn-gold btn-sm" onClick={() => validerSalon(s.id)}>Valider</button>
                                  <button className="btn btn-ghost btn-sm" onClick={() => refuserSalon(s.id)}>Refuser</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {sec === 'salons' && (
                <>
                  {pendingSalons.length > 0 && (
                    <div className="panel" style={{ borderLeft: '4px solid #c47f1a' }}>
                      <h3 style={{ marginBottom: 16 }}>En attente de validation ({pendingSalons.length})</h3>
                      <table>
                        <thead>
                          <tr><th>Salon</th><th>Commune</th><th>Gérant</th><th>Date inscription</th><th></th></tr>
                        </thead>
                        <tbody>
                          {pendingSalons.map((s) => (
                            <tr key={s.id}>
                              <td><b>{s.nom}</b><br /><small style={{ color: 'var(--muted)' }}>{s.quartier}</small></td>
                              <td>{s.commune}</td>
                              <td>{s.profiles?.nom ?? '—'}</td>
                              <td style={{ color: 'var(--muted)' }}>{fmtDate(s.created_at)}</td>
                              <td>
                                <div className="actions">
                                  <button className="btn btn-gold btn-sm" onClick={() => validerSalon(s.id)}>Valider</button>
                                  <button className="btn btn-ghost btn-sm" onClick={() => refuserSalon(s.id)}>Refuser</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h3 style={{ margin: 0 }}>Salons actifs ({salons.length})</h3>
                    </div>
                    <table>
                      <thead>
                        <tr><th>Salon</th><th>Commune</th><th>Note</th><th>Avis</th><th>Gérant</th><th>Statut</th><th></th></tr>
                      </thead>
                      <tbody>
                        {salons.map((s) => (
                          <tr key={s.id}>
                            <td><b>{s.nom}</b><br /><small style={{ color: 'var(--muted)' }}>{s.quartier}</small></td>
                            <td>{s.commune}</td>
                            <td><span style={{ color: 'var(--star)' }}>★</span> {s.note ?? '—'}</td>
                            <td>{s.nb_avis ?? 0}</td>
                            <td>{s.profiles?.nom ?? '—'}</td>
                            <td><span className="status ok">Actif</span></td>
                            <td><Link to={'/salon/' + s.id} className="btn btn-ghost btn-sm">Voir</Link></td>
                          </tr>
                        ))}
                        {salons.length === 0 && (
                          <tr><td colSpan={7} className="empty-row">Aucun salon actif pour le moment.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {sec === 'clientes' && (
                <div className="panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>Clientes ({clientes.length})</h3>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Cliente</th><th>Telephone</th><th>Reservations</th><th>Inscription</th></tr>
                    </thead>
                    <tbody>
                      {clientes.map((c) => (
                        <tr key={c.id}>
                          <td><b>{c.nom}</b></td>
                          <td style={{ color: 'var(--muted)' }}>{c.telephone ?? '—'}</td>
                          <td>{(c.bookings?.[0]?.count ?? 0)} RDV</td>
                          <td style={{ color: 'var(--muted)' }}>{fmtDate(c.created_at)}</td>
                        </tr>
                      ))}
                      {clientes.length === 0 && (
                        <tr><td colSpan={4} className="empty-row">Aucune cliente inscrite pour le moment.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {sec === 'reservations' && (
                <div className="panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>Reservations ({bookings.length})</h3>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Cliente</th><th>Salon</th><th>Prestation</th><th>Date</th><th>Heure</th><th>Montant</th><th>Statut</th></tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id}>
                          <td><b>{b.profiles?.nom ?? '—'}</b></td>
                          <td>{b.salons?.nom ?? '—'}</td>
                          <td>{b.services?.nom ?? '—'}</td>
                          <td style={{ color: 'var(--muted)' }}>{fmtDate(b.date_rdv)}</td>
                          <td style={{ color: 'var(--muted)' }}>{fmtHeure(b.heure_rdv)}</td>
                          <td style={{ fontWeight: 600, color: 'var(--bordeaux-700)' }}>{fcfa(b.montant)}</td>
                          <td><span className={'status ' + (STATUT_CLASS[b.statut] ?? 'wait')}>{STATUT_LABEL[b.statut] ?? b.statut}</span></td>
                        </tr>
                      ))}
                      {bookings.length === 0 && (
                        <tr><td colSpan={7} className="empty-row">Aucune reservation pour le moment.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {sec === 'paiements' && (
                <>
                  <div className="kpis" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                    <div className="kpi"><span>Revenus ce mois</span><b>—</b><span className="delta">module a venir</span></div>
                    <div className="kpi"><span>Abonnements Premium</span><b>—</b></div>
                    <div className="kpi"><span>Abonnements Pro</span><b>—</b></div>
                  </div>
                  <div className="panel">
                    <h3>Apercu des abonnements (exemple)</h3>
                    <table>
                      <thead><tr><th>Salon</th><th>Formule</th><th>Montant</th><th>Date</th><th>Statut</th></tr></thead>
                      <tbody>
                        {PAIEMENTS.map((p, i) => (
                          <tr key={i}>
                            <td><b>{p.salon}</b></td>
                            <td><span className="tag-pill" style={{ fontSize: '.78rem' }}>{p.plan}</span></td>
                            <td style={{ fontWeight: 600, color: 'var(--bordeaux-700)' }}>{p.montant} FCFA</td>
                            <td style={{ color: 'var(--muted)' }}>{p.date}</td>
                            <td><span className={'status ' + p.st}>{p.st === 'ok' ? 'Paye' : p.st === 'wait' ? 'En attente' : 'Retard'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {sec === 'reclamations' && (
                <div className="panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>Reclamations (exemple)</h3>
                  </div>
                  <table>
                    <thead><tr><th>Ref.</th><th>Cliente</th><th>Salon</th><th>Motif</th><th>Date</th><th>Statut</th><th></th></tr></thead>
                    <tbody>
                      {RECLAMATIONS.map((r) => (
                        <tr key={r.id}>
                          <td style={{ color: 'var(--muted)', fontSize: '.88rem' }}>{r.id}</td>
                          <td><b>{r.cliente}</b></td>
                          <td>{r.salon}</td>
                          <td>{r.motif}</td>
                          <td style={{ color: 'var(--muted)' }}>{r.date}</td>
                          <td><span className={'status ' + r.st}>{RECL_LABELS[r.st]}</span></td>
                          <td><button className="btn btn-ghost btn-sm">Traiter</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}
