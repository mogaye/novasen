import { NextResponse } from 'next/server';
import { createPaydunyaPayment } from '@/lib/paydunya';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      itemName,
      itemPrice,
      refCommand,
      description,
      customData,
      returnUrl,
      cancelUrl,
    } = body;

    if (!itemName || !itemPrice || !refCommand) {
      return NextResponse.json(
        { error: 'Paramètres manquants (itemName, itemPrice, refCommand obligatoires)' },
        { status: 400 }
      );
    }

    const result = await createPaydunyaPayment({
      itemName,
      itemPrice: Number(itemPrice),
      refCommand: String(refCommand),
      description: description || `Paiement ${itemName} #${refCommand}`,
      customData,
      returnUrl,
      cancelUrl,
    });

    if (!result.success && result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      redirectUrl: result.redirectUrl,
      token: result.token,
    });
  } catch (error: any) {
    console.error('[API PayDunya Error]', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
