import { NextResponse } from 'next/server';
import { createPaytechPayment } from '@/lib/paytech';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      itemName,
      itemPrice,
      refCommand,
      commandName,
      customField,
      successUrl,
      cancelUrl,
    } = body;

    if (!itemName || !itemPrice || !refCommand) {
      return NextResponse.json(
        { error: 'Paramètres manquants (itemName, itemPrice, refCommand obligatoires)' },
        { status: 400 }
      );
    }

    const result = await createPaytechPayment({
      itemName,
      itemPrice: Number(itemPrice),
      refCommand: String(refCommand),
      commandName: commandName || `Paiement NovaSen #${refCommand}`,
      customField,
      successUrl,
      cancelUrl,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      redirectUrl: result.redirectUrl,
      token: result.token,
    });
  } catch (error: any) {
    console.error('[API PayTech Error]', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
