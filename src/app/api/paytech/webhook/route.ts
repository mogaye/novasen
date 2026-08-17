import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // PayTech IPN payload fields
    const {
      type_event,
      ref_command,
      item_name,
      item_price,
      currency,
      command_name,
      custom_field,
      api_key_sha256,
      api_secret_sha256,
    } = body;

    console.log(`[PayTech Webhook] Notification reçue pour la commande #${ref_command}:`, body);

    // Verify SHA256 signatures if API keys are set
    const expectedApiKeyHash = process.env.PAYTECH_API_KEY
      ? crypto.createHash('sha256').update(process.env.PAYTECH_API_KEY).digest('hex')
      : null;
    const expectedApiSecretHash = process.env.PAYTECH_API_SECRET
      ? crypto.createHash('sha256').update(process.env.PAYTECH_API_SECRET).digest('hex')
      : null;

    if (expectedApiKeyHash && api_key_sha256 && api_key_sha256 !== expectedApiKeyHash) {
      console.error('[PayTech Webhook] Clé API invalide dans le Webhook');
      return NextResponse.json({ error: 'Signature API Key invalide' }, { status: 403 });
    }

    if (expectedApiSecretHash && api_secret_sha256 && api_secret_sha256 !== expectedApiSecretHash) {
      console.error('[PayTech Webhook] Clé Secrète invalide dans le Webhook');
      return NextResponse.json({ error: 'Signature API Secret invalide' }, { status: 403 });
    }

    // Success response to PayTech server
    return NextResponse.json({
      received: true,
      status: 'success',
      refCommand: ref_command,
    });
  } catch (error: any) {
    console.error('[PayTech Webhook Error]', error);
    return NextResponse.json({ error: error.message || 'Erreur traitement webhook' }, { status: 500 });
  }
}
