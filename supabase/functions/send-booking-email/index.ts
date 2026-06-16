import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function emailHTML(data: {
  clientName: string
  salonNom: string
  commune: string
  serviceName: string
  duree: string
  dateRdv: string
  heureRdv: string
  montant: string
  bookingId: number
}) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Réservation confirmée — BeautyConnect</title></head>
<body style="margin:0;padding:0;background:#F4ECE0;font-family:Georgia,serif;color:#2A141A">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4ECE0;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- En-tête -->
        <tr><td style="background:linear-gradient(135deg,#511325,#3D0E1C);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center">
          <p style="margin:0;font-size:1.4rem;font-weight:700;color:#FBF7F1;letter-spacing:-.01em">
            <span style="display:inline-block;width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#D7B968,#6E1E33);line-height:36px;text-align:center;font-size:.95rem;margin-right:10px;vertical-align:middle">BC</span>
            Beauty<span style="color:#C9A24B">Connect</span>
          </p>
          <p style="margin:20px 0 0;font-size:.85rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(251,247,241,.7)">Réservation confirmée</p>
        </td></tr>

        <!-- Corps -->
        <tr><td style="background:#fff;padding:40px">
          <p style="margin:0 0 8px;font-size:.82rem;letter-spacing:.2em;text-transform:uppercase;color:#C9A24B;font-weight:600">Bonjour</p>
          <h1 style="margin:0 0 20px;font-size:1.7rem;font-weight:600;line-height:1.2;color:#3D0E1C">${data.clientName}</h1>
          <p style="margin:0 0 28px;font-size:1.05rem;color:#7C6A6F;line-height:1.7">
            Votre rendez-vous chez <strong style="color:#3D0E1C">${data.salonNom}</strong> a bien été enregistré. Retrouvez le récapitulatif ci-dessous.
          </p>

          <!-- Récapitulatif -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F1;border-radius:12px;overflow:hidden;margin-bottom:28px">
            <tr><td colspan="2" style="padding:18px 24px 12px;font-size:.78rem;letter-spacing:.15em;text-transform:uppercase;color:#C9A24B;font-weight:600;border-bottom:1px solid #E6D9CB">Détails du rendez-vous</td></tr>
            <tr style="border-bottom:1px solid #E6D9CB">
              <td style="padding:14px 24px;color:#7C6A6F;font-size:.95rem">Salon</td>
              <td style="padding:14px 24px;font-weight:600;color:#3D0E1C;font-size:.95rem;text-align:right">${data.salonNom} · ${data.commune}</td>
            </tr>
            <tr style="border-bottom:1px solid #E6D9CB">
              <td style="padding:14px 24px;color:#7C6A6F;font-size:.95rem">Prestation</td>
              <td style="padding:14px 24px;font-weight:600;color:#3D0E1C;font-size:.95rem;text-align:right">${data.serviceName} (${data.duree})</td>
            </tr>
            <tr style="border-bottom:1px solid #E6D9CB">
              <td style="padding:14px 24px;color:#7C6A6F;font-size:.95rem">Date</td>
              <td style="padding:14px 24px;font-weight:600;color:#3D0E1C;font-size:.95rem;text-align:right">${data.dateRdv}</td>
            </tr>
            <tr style="border-bottom:1px solid #E6D9CB">
              <td style="padding:14px 24px;color:#7C6A6F;font-size:.95rem">Heure</td>
              <td style="padding:14px 24px;font-weight:600;color:#3D0E1C;font-size:.95rem;text-align:right">${data.heureRdv}</td>
            </tr>
            <tr style="border-bottom:1px solid #E6D9CB">
              <td style="padding:14px 24px;color:#7C6A6F;font-size:.95rem">Paiement</td>
              <td style="padding:14px 24px;font-weight:600;color:#3D0E1C;font-size:.95rem;text-align:right">Sur place</td>
            </tr>
            <tr>
              <td style="padding:16px 24px;font-weight:600;color:#3D0E1C">Total</td>
              <td style="padding:16px 24px;font-weight:700;font-size:1.1rem;color:#6E1E33;text-align:right">${data.montant}</td>
            </tr>
          </table>

          <p style="margin:0 0 8px;font-size:.88rem;color:#7C6A6F">Référence : <strong style="color:#3D0E1C">#${data.bookingId}</strong></p>
          <p style="margin:0 0 28px;font-size:.88rem;color:#7C6A6F;line-height:1.6">Vous recevrez un rappel la veille de votre rendez-vous. En cas d'empêchement, annulez depuis votre espace client au moins 24h à l'avance.</p>

          <!-- Bouton -->
          <table cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:linear-gradient(135deg,#D7B968,#C9A24B)">
            <a href="https://beautyconnect.ci/#/mes-reservations" style="display:inline-block;padding:14px 32px;font-family:Georgia,serif;font-size:1rem;font-weight:600;color:#3D0E1C;text-decoration:none;border-radius:999px">
              Voir mes réservations
            </a>
          </td></tr></table>
        </td></tr>

        <!-- Pied de page -->
        <tr><td style="background:#3D0E1C;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center">
          <p style="margin:0 0 6px;font-size:.82rem;color:rgba(251,247,241,.6)">BeautyConnect · Abidjan, Côte d'Ivoire</p>
          <p style="margin:0;font-size:.78rem;color:rgba(251,247,241,.4)">contact@beautyconnect.ci</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const body = await req.json()
    const { to, clientName, salonNom, commune, serviceName, duree, dateRdv, heureRdv, montant, bookingId } = body

    if (!to || !salonNom || !serviceName) {
      return new Response(JSON.stringify({ error: 'Champs manquants' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const html = emailHTML({ clientName, salonNom, commune, serviceName, duree, dateRdv, heureRdv, montant, bookingId })

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BeautyConnect <onboarding@resend.dev>',
        to: [to],
        subject: `Réservation confirmée — ${salonNom}`,
        html,
      }),
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message ?? 'Erreur Resend')

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('send-booking-email error:', e.message)
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
