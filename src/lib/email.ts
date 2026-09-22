import { Resend } from 'resend';

// Initialize Resend client with API key from environment
const resendApiKey = process.env.RESEND_API_KEY || '';
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Default sender and admin recipient
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'Ogedecor Concierge <onboarding@resend.dev>';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@ogedecor.com';

export interface OrderItemEmailData {
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };
  items: OrderItemEmailData[];
  deliveryMethodTitle: string;
  deliveryFee: number;
  subtotal: number;
  grandTotal: number;
  currency: string;
  paymentMethod: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  trackingNumber?: string;
  carrier?: string;
  specialInstructions?: string;
}

function getCurrencySymbol(curr: string): string {
  if (curr === 'NGN') return '₦';
  if (curr === 'EUR') return '€';
  if (curr === 'GBP') return '£';
  return '$';
}

function getPaymentMethodLabel(method: string): string {
  switch (method) {
    case 'bank_transfer':
      return 'Direct Bank Transfer / Wire';
    case 'card':
      return 'Online Debit / Credit Card';
    case 'pos_showroom':
      return 'Showroom POS / Payment on Delivery';
    default:
      return method;
  }
}

function getDeliveryStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'Order Placed & Awaiting Confirmation';
    case 'crafting':
      return 'In Crafting & Handcrafting Production';
    case 'inspection':
      return 'Quality & Material Inspection Passed';
    case 'dispatched':
      return 'Dispatched to Delivery Carrier';
    case 'out_for_delivery':
      return 'Out for White-Glove Delivery Today';
    case 'delivered':
      return 'Delivered Successfully';
    case 'cancelled':
      return 'Order Cancelled';
    default:
      return status;
  }
}

/**
 * Send Luxury Order Confirmation to the Customer
 */
export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY not configured. Skipping customer order confirmation email.');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  const symbol = getCurrencySymbol(order.currency);
  const itemsRowsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px 12px; border-bottom: 1px solid #27272A; vertical-align: top;">
          ${
            item.imageUrl
              ? `<img src="${item.imageUrl}" alt="${item.name}" width="60" height="60" style="border-radius: 8px; object-fit: cover; border: 1px solid rgba(212, 175, 55, 0.3); display: inline-block; margin-right: 12px; vertical-align: middle;" />`
              : ''
          }
          <div style="display: inline-block; vertical-align: middle;">
            <strong style="color: #F4F4F5; font-size: 15px; display: block;">${item.name}</strong>
            <span style="color: #A1A1AA; font-size: 13px;">Qty: ${item.quantity} × ${symbol}${item.price.toLocaleString()}</span>
          </div>
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #27272A; text-align: right; vertical-align: middle; color: #D4AF37; font-weight: 700; font-size: 15px;">
          ${symbol}${item.lineTotal.toLocaleString()}
        </td>
      </tr>
    `
    )
    .join('');

  const bankTransferInstructions =
    order.paymentMethod === 'bank_transfer'
      ? `
      <div style="margin-top: 24px; padding: 20px; border-radius: 10px; background-color: #141418; border: 1px solid rgba(212, 175, 55, 0.35);">
        <h4 style="margin: 0 0 10px 0; color: #D4AF37; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">
          🏛️ Bank Transfer / Wire Details
        </h4>
        <p style="margin: 0 0 8px 0; color: #E4E4E7; font-size: 13px;">
          Please wire your order grand total of <strong>${symbol}${order.grandTotal.toLocaleString()}</strong> using reference <strong>${order.orderNumber}</strong>:
        </p>
        <table style="width: 100%; font-size: 13px; color: #D4D4D8;">
          <tr><td style="padding: 3px 0; width: 120px; color: #A1A1AA;">Bank Name:</td><td style="color: #FFFFFF; font-weight: 600;">Zenith Bank / Guaranty Trust Bank</td></tr>
          <tr><td style="padding: 3px 0; color: #A1A1AA;">Account Name:</td><td style="color: #FFFFFF; font-weight: 600;">OgeDecor Interior Architecture Ltd</td></tr>
          <tr><td style="padding: 3px 0; color: #A1A1AA;">Account Number:</td><td style="color: #D4AF37; font-weight: 700; font-size: 15px;">1019284756</td></tr>
          <tr><td style="padding: 3px 0; color: #A1A1AA;">Reference / Narration:</td><td style="color: #FFFFFF;">${order.orderNumber}</td></tr>
        </table>
        <p style="margin: 10px 0 0 0; color: #A1A1AA; font-size: 12px;">
          Send proof of payment to <a href="mailto:orders@ogedecor.com" style="color: #D4AF37;">orders@ogedecor.com</a> or WhatsApp concierge for express dispatch.
        </p>
      </div>
    `
      : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - Ogedecor</title>
      </head>
      <body style="background-color: #09090B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 24px 12px; color: #F4F4F5;">
        <div style="max-width: 620px; margin: 0 auto; background: #0F0F13; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.6);">
          
          <!-- Top Brand Header -->
          <div style="background: linear-gradient(180deg, #181822 0%, #0F0F13 100%); padding: 36px 32px 28px 32px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
            <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #D4AF37; font-family: Georgia, serif;">
              OGEDECOR
            </h1>
            <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #A1A1AA;">
              Interior Architecture & Fine Decor
            </p>
          </div>

          <!-- Body Content -->
          <div style="padding: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <div>
                <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.4); color: #4ADE80; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
                  Order Confirmed
                </span>
                <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #FFFFFF;">
                  Thank you, ${order.customerName}
                </h2>
              </div>
            </div>

            <p style="color: #A1A1AA; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
              Your order has been safely placed with our Victoria Island atelier. Each piece is prepared with exacting craftsmanship and scheduled for insured white-glove transit.
            </p>

            <!-- Order Metadata Pill -->
            <div style="background-color: #141418; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 16px; margin-bottom: 24px;">
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="color: #A1A1AA; padding: 4px 0;">Order Reference:</td>
                  <td style="color: #D4AF37; font-weight: 700; text-align: right;">${order.orderNumber}</td>
                </tr>
                <tr>
                  <td style="color: #A1A1AA; padding: 4px 0;">Delivery Method:</td>
                  <td style="color: #FFFFFF; font-weight: 500; text-align: right;">${order.deliveryMethodTitle}</td>
                </tr>
                <tr>
                  <td style="color: #A1A1AA; padding: 4px 0;">Payment Method:</td>
                  <td style="color: #FFFFFF; font-weight: 500; text-align: right;">${getPaymentMethodLabel(order.paymentMethod)}</td>
                </tr>
              </table>
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #A1A1AA; border-bottom: 1px solid #27272A;">Item</th>
                  <th style="text-align: right; padding: 8px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #A1A1AA; border-bottom: 1px solid #27272A;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRowsHtml}
              </tbody>
            </table>

            <!-- Financials Summary -->
            <div style="border-top: 1px solid #27272A; padding-top: 16px; margin-bottom: 24px;">
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="color: #A1A1AA; padding: 4px 0;">Subtotal:</td>
                  <td style="color: #FFFFFF; text-align: right; font-weight: 600;">${symbol}${order.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="color: #A1A1AA; padding: 4px 0;">Delivery & Logistics:</td>
                  <td style="color: #FFFFFF; text-align: right; font-weight: 600;">${symbol}${order.deliveryFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="color: #D4AF37; font-size: 16px; font-weight: 700; padding: 12px 0 0 0;">Grand Total:</td>
                  <td style="color: #D4AF37; font-size: 20px; font-weight: 700; text-align: right; padding: 12px 0 0 0;">${symbol}${order.grandTotal.toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <!-- Shipping Address -->
            <div style="background-color: #141418; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 16px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 8px 0; color: #D4AF37; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
                📍 Shipping Destination
              </h4>
              <p style="margin: 0; color: #E4E4E7; font-size: 13px; line-height: 1.5;">
                ${order.customerName}<br>
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state}${order.shippingAddress.postalCode ? ' ' + order.shippingAddress.postalCode : ''}<br>
                ${order.shippingAddress.country}<br>
                ${order.customerPhone ? `<span style="color: #A1A1AA;">Phone: ${order.customerPhone}</span>` : ''}
              </p>
            </div>

            ${bankTransferInstructions}
          </div>

          <!-- Luxury Footer -->
          <div style="background-color: #0B0B0E; border-top: 1px solid rgba(212, 175, 55, 0.15); padding: 24px 32px; text-align: center;">
            <p style="margin: 0 0 6px 0; color: #A1A1AA; font-size: 12px;">
              Questions regarding your commission or delivery?
            </p>
            <p style="margin: 0; color: #D4AF37; font-size: 13px; font-weight: 600;">
              Ogedecor Concierge: <a href="mailto:concierge@ogedecor.com" style="color: #D4AF37; text-decoration: none;">concierge@ogedecor.com</a>
            </p>
            <p style="margin: 12px 0 0 0; color: #71717A; font-size: 11px;">
              Victoria Island, Lagos, Nigeria • Handcrafted Luxury Afro-Contemporary Living
            </p>
          </div>

        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [order.customerEmail],
      subject: `Order Confirmed: ${order.orderNumber} | Ogedecor`,
      html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('[Resend] Failed to send customer order confirmation:', error);
    return { success: false, error };
  }
}

/**
 * Send Immediate Admin Alert for New Order Placed
 */
export async function sendAdminNewOrderAlert(order: OrderEmailData) {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY not configured. Skipping admin order alert.');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  const symbol = getCurrencySymbol(order.currency);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ogedecor.com';

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="background-color: #09090B; font-family: -apple-system, sans-serif; color: #F4F4F5; padding: 24px;">
        <div style="max-width: 580px; margin: 0 auto; background: #121216; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; padding: 28px;">
          <h2 style="color: #D4AF37; margin: 0 0 16px 0; font-size: 22px;">
            🔔 New Customer Order Received
          </h2>
          <p style="color: #E4E4E7; font-size: 14px; margin-bottom: 20px;">
            A new order <strong>${order.orderNumber}</strong> has been submitted through the Ogedecor storefront.
          </p>

          <table style="width: 100%; font-size: 13px; color: #D4D4D8; margin-bottom: 20px;">
            <tr><td style="padding: 6px 0; color: #A1A1AA;">Customer:</td><td style="font-weight: 600; color: #FFFFFF;">${order.customerName}</td></tr>
            <tr><td style="padding: 6px 0; color: #A1A1AA;">Email:</td><td style="color: #FFFFFF;"><a href="mailto:${order.customerEmail}" style="color: #D4AF37;">${order.customerEmail}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #A1A1AA;">Phone:</td><td style="color: #FFFFFF;">${order.customerPhone || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; color: #A1A1AA;">Grand Total:</td><td style="color: #D4AF37; font-weight: 700; font-size: 16px;">${symbol}${order.grandTotal.toLocaleString()}</td></tr>
            <tr><td style="padding: 6px 0; color: #A1A1AA;">Payment Method:</td><td style="color: #FFFFFF;">${getPaymentMethodLabel(order.paymentMethod)}</td></tr>
            <tr><td style="padding: 6px 0; color: #A1A1AA;">Delivery Method:</td><td style="color: #FFFFFF;">${order.deliveryMethodTitle}</td></tr>
            <tr><td style="padding: 6px 0; color: #A1A1AA;">Destination:</td><td style="color: #FFFFFF;">${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}</td></tr>
          </table>

          <div style="margin-bottom: 24px;">
            <strong style="color: #A1A1AA; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">Ordered Items:</strong>
            <ul style="margin: 0; padding-left: 20px; color: #E4E4E7; font-size: 13px;">
              ${order.items.map((i) => `<li><strong>${i.name}</strong> × ${i.quantity} (${symbol}${i.lineTotal.toLocaleString()})</li>`).join('')}
            </ul>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${serverUrl}/admin/collections/orders" style="background: linear-gradient(135deg, #D4AF37 0%, #AA820A 100%); color: #09090B; padding: 12px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 13px; display: inline-block;">
              Open Order in Payload CMS &rarr;
            </a>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [ADMIN_EMAIL],
      subject: `🔔 New Store Order: ${order.orderNumber} - ${symbol}${order.grandTotal.toLocaleString()} (${order.customerName})`,
      html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('[Resend] Failed to send admin order alert:', error);
    return { success: false, error };
  }
}

/**
 * Send Customer Notification on Order Delivery Status Change
 */
export async function sendOrderStatusUpdateEmail(order: OrderEmailData, newStatus: string) {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY not configured. Skipping status update email.');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  const statusLabel = getDeliveryStatusLabel(newStatus);
  const symbol = getCurrencySymbol(order.currency);

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="background-color: #09090B; font-family: -apple-system, sans-serif; color: #F4F4F5; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #0F0F13; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 14px; padding: 32px;">
          <h1 style="margin: 0 0 12px 0; font-size: 22px; color: #D4AF37; font-family: Georgia, serif; letter-spacing: 0.1em; text-transform: uppercase;">
            OGEDECOR
          </h1>
          <h2 style="color: #FFFFFF; font-size: 18px; margin: 0 0 16px 0;">
            Order Status Update: ${order.orderNumber}
          </h2>
          <p style="color: #A1A1AA; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            Dear ${order.customerName}, the status of your order has been updated:
          </p>

          <div style="background-color: #141418; border-left: 4px solid #D4AF37; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
            <span style="color: #A1A1AA; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 4px;">Current Status</span>
            <strong style="color: #F4E8C1; font-size: 16px;">${statusLabel}</strong>
            ${
              order.carrier
                ? `<div style="margin-top: 8px; font-size: 13px; color: #A1A1AA;">Carrier Partner: <strong style="color: #FFFFFF;">${order.carrier}</strong></div>`
                : ''
            }
            ${
              order.trackingNumber
                ? `<div style="margin-top: 4px; font-size: 13px; color: #A1A1AA;">Tracking Number: <strong style="color: #D4AF37;">${order.trackingNumber}</strong></div>`
                : ''
            }
          </div>

          <p style="color: #A1A1AA; font-size: 13px; line-height: 1.5;">
            Our white-glove team ensures seamless handling. For real-time updates or delivery window coordination, contact our concierge at <a href="mailto:concierge@ogedecor.com" style="color: #D4AF37;">concierge@ogedecor.com</a>.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [order.customerEmail],
      subject: `Order Update: ${order.orderNumber} is now ${statusLabel} | Ogedecor`,
      html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('[Resend] Failed to send status update email:', error);
    return { success: false, error };
  }
}

/**
 * Send Consultation / Bespoke Inquiry Notification
 */
export async function sendInquiryNotificationEmail(data: {
  contactName: string;
  contactInfo: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  mood?: string;
}) {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY not configured. Skipping inquiry notification.');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  // 1. Notify Admin of new high-value consultation inquiry
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <body style="background-color: #09090B; font-family: -apple-system, sans-serif; color: #F4F4F5; padding: 24px;">
        <div style="max-width: 580px; margin: 0 auto; background: #121216; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; padding: 28px;">
          <h2 style="color: #D4AF37; margin: 0 0 16px 0;">
            ✨ New Bespoke Design Consultation Request
          </h2>
          <table style="width: 100%; font-size: 14px; color: #D4D4D8;">
            <tr><td style="padding: 6px 0; color: #A1A1AA; width: 140px;">Client Name:</td><td style="color: #FFFFFF; font-weight: 600;">${data.contactName}</td></tr>
            <tr><td style="padding: 6px 0; color: #A1A1AA;">Contact:</td><td style="color: #D4AF37;">${data.contactInfo}</td></tr>
            <tr><td style="padding: 6px 0; color: #A1A1AA;">Project Scope:</td><td style="color: #FFFFFF;">${data.projectType || 'Not specified'}</td></tr>
            <tr><td style="padding: 6px 0; color: #A1A1AA;">Budget Range:</td><td style="color: #FFFFFF;">${data.budget || 'Not specified'}</td></tr>
            <tr><td style="padding: 6px 0; color: #A1A1AA;">Timeline:</td><td style="color: #FFFFFF;">${data.timeline || 'Not specified'}</td></tr>
            <tr><td style="padding: 6px 0; color: #A1A1AA;">Aesthetic Mood:</td><td style="color: #FFFFFF;">${data.mood || 'Not specified'}</td></tr>
          </table>
        </div>
      </body>
    </html>
  `;

  try {
    const adminRes = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [ADMIN_EMAIL],
      subject: `✨ New Bespoke Consultation: ${data.contactName} (${data.projectType || 'Interior Project'})`,
      html: adminHtml,
    });

    // If contactInfo looks like an email address, send a confirmation to the client as well
    if (data.contactInfo.includes('@')) {
      const clientHtml = `
        <!DOCTYPE html>
        <html>
          <body style="background-color: #09090B; font-family: -apple-system, sans-serif; color: #F4F4F5; padding: 24px;">
            <div style="max-width: 600px; margin: 0 auto; background: #0F0F13; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 14px; padding: 32px;">
              <h1 style="margin: 0 0 12px 0; font-size: 22px; color: #D4AF37; font-family: Georgia, serif; letter-spacing: 0.1em; text-transform: uppercase;">
                OGEDECOR
              </h1>
              <h2 style="color: #FFFFFF; font-size: 18px; margin: 0 0 16px 0;">
                Consultation Request Received
              </h2>
              <p style="color: #A1A1AA; font-size: 14px; line-height: 1.6;">
                Dear ${data.contactName}, thank you for reaching out to Ogedecor. Our lead design architect will review your project brief and connect with you within 24 business hours to schedule your bespoke consultation.
              </p>
              <p style="color: #71717A; font-size: 12px; margin-top: 24px;">
                Victoria Island, Lagos, Nigeria • Bespoke Interior Architecture & Fine Living
              </p>
            </div>
          </body>
        </html>
      `;

      await resend.emails.send({
        from: DEFAULT_FROM,
        to: [data.contactInfo.trim()],
        subject: `Your Design Consultation Request | Ogedecor`,
        html: clientHtml,
      });
    }

    return { success: true, data: adminRes };
  } catch (error) {
    console.error('[Resend] Failed to send inquiry email:', error);
    return { success: false, error };
  }
}
