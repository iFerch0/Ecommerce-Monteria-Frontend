import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = body?.event;
    const data = body?.data;
    const signature = body?.signature;

    // Only handle transaction.updated events
    if (event !== 'transaction.updated') {
      return NextResponse.json({ received: true });
    }

    // Validate checksum
    const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
    if (eventsSecret && signature?.checksum) {
      const properties = signature.properties || [];
      const values = properties.map((prop: string) => {
        const keys = prop.split('.');
        let value: unknown = body;
        for (const key of keys) {
          value = (value as Record<string, unknown>)?.[key];
        }
        return value;
      });
      values.push(body.timestamp);
      values.push(eventsSecret);

      const concatenated = values.join('');
      const encoded = new TextEncoder().encode(concatenated);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const computedChecksum = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      if (computedChecksum !== signature.checksum) {
        console.error('Wompi webhook: Invalid checksum');
        return NextResponse.json({ error: 'Invalid checksum' }, { status: 401 });
      }
    }

    const transaction = data?.transaction;
    if (!transaction) {
      return NextResponse.json({ received: true });
    }

    const wompiStatus = transaction.status;
    const wompiId = transaction.id;
    const reference = transaction.reference;
    const paymentMethod = transaction.payment_method_type;

    // Map Wompi status to our payment status
    const statusMap: Record<string, string> = {
      APPROVED: 'approved',
      DECLINED: 'declined',
      VOIDED: 'voided',
      ERROR: 'error',
    };
    const paymentStatus = statusMap[wompiStatus] || 'pending';

    // Map to order status
    const orderStatusMap: Record<string, string> = {
      APPROVED: 'confirmed',
      DECLINED: 'cancelled',
      VOIDED: 'cancelled',
      ERROR: 'pending',
    };
    const orderStatus = orderStatusMap[wompiStatus] || 'pending';

    // Find order by orderNumber (reference)
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (STRAPI_TOKEN) {
      headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
    }

    // Find the order
    const orderRes = await fetch(
      `${STRAPI_URL}/api/orders?filters[orderNumber][$eq]=${reference}&populate=payment`,
      { headers }
    );

    if (!orderRes.ok) {
      console.error('Wompi webhook: Failed to find order', reference);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = await orderRes.json();
    const order = orderData?.data?.[0];

    if (!order) {
      console.error('Wompi webhook: Order not found for reference', reference);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update payment
    if (order.payment?.documentId) {
      await fetch(`${STRAPI_URL}/api/payments/${order.payment.documentId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          data: {
            wompiTransactionId: wompiId,
            paymentStatus: paymentStatus,
            paymentMethod: paymentMethod || null,
            wompiResponse: transaction,
          },
        }),
      });
    }

    // Update order status
    await fetch(`${STRAPI_URL}/api/orders/${order.documentId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        data: { orderStatus: orderStatus },
      }),
    });

    console.log(
      `Wompi webhook: Order ${reference} → ${wompiStatus} (payment: ${paymentStatus}, order: ${orderStatus})`
    );

    return NextResponse.json({ received: true, orderNumber: reference, status: orderStatus });
  } catch (error) {
    console.error('Wompi webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
