import { Resend } from "resend";

export const sendOrderEmail = async (order) => {
  const isResendConfigured = !!process.env.RESEND_API_KEY;
  const emailHtml = generateInvoiceHtml(order);

  if (isResendConfigured) {
    try {
      // Lazy-import to prevent errors if not installed
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: 'Anera Foods <thiruna.codezela@gmail.com>',
        to: order.customer.email,
        subject: `Order Confirmed - ${order.orderNumber}`,
        html: emailHtml,
      });
      console.log(`[Email Service] Live email sent successfully to ${order.customer.email}`);
      return { success: true, mode: "live" };
    } catch (error) {
      console.error("[Email Service] Live email sending failed:", error);
    }
  }

  // Local fallback log
  console.log("-----------------------------------------");
  console.log(`[SIMULATED EMAIL DISPATCH] TO: ${order.customer.email}`);
  console.log(`SUBJECT: Order Confirmed - ${order.orderNumber}`);
  console.log(`BODY SUMMARY:`);
  console.log(`Customer: ${order.customer.name}`);
  console.log(`Phone: ${order.customer.phone}`);
  console.log(`Items: ${order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}`);
  console.log(`Subtotal: LKR ${order.subtotal}`);
  console.log(`Shipping: LKR ${order.shippingCost}`);
  console.log(`Total: LKR ${order.totalAmount}`);
  console.log("-----------------------------------------");
  
  return { success: true, mode: "simulated", html: emailHtml };
};

export const generateInvoiceHtml = (order) => {
  const itemsHtml = order.items && order.items.length > 0
    ? order.items.map(item => `
        <tr style="border-bottom: 1px solid #F2F2F2;">
          <td style="padding: 8px 0; font-size: 13px; color: #222;">
            ${item.name} <strong>(x${item.quantity})</strong>
          </td>
          <td style="padding: 8px 0; text-align: right; font-size: 13px; color: #222; font-family: monospace;">
            LKR ${(item.price * item.quantity).toLocaleString()}
          </td>
        </tr>
      `).join("")
    : `<tr><td colspan="2" style="padding: 8px 0; font-size: 13px; color: #666; text-align: center;">No items found</td></tr>`;

  const fullAddress = [
    order.customer?.address,
    order.customer?.city,
    order.customer?.district
  ].filter(Boolean).join(", ") || "-";

  return `
    <div style="font-family: 'Outfit', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; background-color: #FFFFFF;">
      <div style="text-align: center; margin-bottom: 16px;">
        <h1 style="color: #1E3A2F; margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: bold; letter-spacing: 1px;">ANERA FOODS</h1>
        <p style="color: #C27D38; margin: 4px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold;">PREMIUM SRI LANKAN FOODS</p>
      </div>

      <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #FDFBF7; border-radius: 8px; border: 1px dashed #E1A926;">
        <h2 style="margin: 0; font-size: 18px; color: #1E3A2F; font-family: Georgia, serif;">Order Confirmed!</h2>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #555;">Thank you for your purchase. We are preparing your order.</p>
      </div>

      <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #EEEEEE;">
        <h3 style="color: #1E3A2F; font-size: 14px; margin: 0 0 10px 0; font-family: Georgia, serif; border-bottom: 2px solid #1E3A2F; padding-bottom: 4px;">Buyer Details</h3>
        <table style="width: 100%; font-size: 13px; color: #222; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; width: 80px; color: #666;"><strong>Name:</strong></td>
            <td style="padding: 4px 0;">${order.customer?.name || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #666;"><strong>Phone:</strong></td>
            <td style="padding: 4px 0;">${order.customer?.phone || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #666;"><strong>Email:</strong></td>
            <td style="padding: 4px 0;">${order.customer?.email || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #666; vertical-align: top;"><strong>Address:</strong></td>
            <td style="padding: 4px 0; line-height: 1.4;">${fullAddress}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="color: #1E3A2F; font-size: 14px; margin: 0 0 10px 0; font-family: Georgia, serif; border-bottom: 2px solid #1E3A2F; padding-bottom: 4px;">Items Purchased</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #EEEEEE;">
              <th style="text-align: left; padding-bottom: 8px; font-size: 12px; color: #666; text-transform: uppercase;">Item Description</th>
              <th style="text-align: right; padding-bottom: 8px; font-size: 12px; color: #666; text-transform: uppercase;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <div style="margin-left: auto; width: 250px; margin-bottom: 20px;">
        <table style="width: 100%; font-size: 13px; color: #222;">
          <tr>
            <td style="padding: 4px 0; color: #666;">Subtotal:</td>
            <td style="padding: 4px 0; text-align: right; font-family: monospace;">LKR ${order.subtotal ? order.subtotal.toLocaleString() : "0"}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #666;">Delivery Fee:</td>
            <td style="padding: 4px 0; text-align: right; font-family: monospace;">LKR ${order.shippingCost ? order.shippingCost.toLocaleString() : "0"}</td>
          </tr>
          <tr style="border-top: 1px solid #CCCCCC; font-weight: bold; font-size: 14px;">
            <td style="padding: 8px 0; color: #1E3A2F;">Invoice Total:</td>
            <td style="padding: 8px 0; text-align: right; color: #1E3A2F; font-family: monospace;">LKR ${order.totalAmount ? order.totalAmount.toLocaleString() : "0"}</td>
          </tr>
        </table>
      </div>
      <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #EEEEEE; padding-top: 15px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Anera Foods. All Rights Reserved.</p>
      </div>
    </div>
  `;
};
