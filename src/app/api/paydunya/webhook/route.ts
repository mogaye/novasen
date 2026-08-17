import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const masterKey = process.env.PAYDUNYA_MASTER_KEY || '';

    // Vérification de la signature PayDunya si envoyée
    const token = body?.data?.invoice?.token || body?.token;
    const status = body?.data?.status || body?.status;
    const customData = body?.data?.custom_data || {};
    const refCommand = customData?.ref_command || body?.ref_command;

    console.log(`[PayDunya Webhook] Notification reçue pour commande #${refCommand} (Statut: ${status})`);

    // Valider la notification PayDunya si un token est présent
    if (token && masterKey) {
      const hashedMasterKey = crypto.createHash('sha512').update(masterKey).digest('hex');
      const receivedHash = req.headers.get('paydunya-hash') || body?.hash;
      if (receivedHash && receivedHash !== hashedMasterKey) {
        console.warn('[PayDunya Webhook] Hash de validation invalide');
      }
    }

    return NextResponse.json({
      received: true,
      status: 'success',
      refCommand: refCommand || token,
    });
  } catch (error: any) {
    console.error('[PayDunya Webhook Error]', error);
    return NextResponse.json({ error: error.message || 'Erreur traitement webhook' }, { status: 500 });
  }
}
