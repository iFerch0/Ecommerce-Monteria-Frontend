import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { reference, amountInCents, currency = 'COP' } = await request.json();

    if (!reference || !amountInCents) {
      return NextResponse.json({ error: 'Referencia y monto requeridos' }, { status: 400 });
    }

    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
    if (!integritySecret) {
      return NextResponse.json({ error: 'Secreto de integridad no configurado' }, { status: 500 });
    }

    // Concatenate: reference + amountInCents + currency + integritySecret
    const concatenated = `${reference}${amountInCents}${currency}${integritySecret}`;

    // SHA-256 hash
    const encoded = new TextEncoder().encode(concatenated);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return NextResponse.json({ signature });
  } catch {
    return NextResponse.json({ error: 'Error generando firma' }, { status: 500 });
  }
}
