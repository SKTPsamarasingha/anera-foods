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
  const itemsRows = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #E2E8F0; font-size: 14px;">${item.name} <span style="color:#718096; font-size: 12px;">(${item.weight})</span></td>
      <td style="padding: 12px; border-bottom: 1px solid #E2E8F0; text-align: center; font-size: 14px;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #E2E8F0; text-align: right; font-size: 14px;">LKR ${item.price.toLocaleString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid #E2E8F0; text-align: right; font-size: 14px; font-weight: bold;">LKR ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join("");

  return `
    <div style="font-family: 'Outfit', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px; background-color: #FDFBF7;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #1E3A2F; margin: 0; font-family: Georgia, serif; font-size: 28px;">ANERA FOODS</h1>
        <p style="color: #C27D38; margin: 5px 0 0 0; font-size: 14px; letter-spacing: 2px;">PREMIUM SRI LANKAN FOODS</p>
      </div>
      
      <div style="background-color: #1E3A2F; color: #FDFBF7; padding: 15px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
        <h2 style="margin: 0; font-size: 18px;">Order Confirmed!</h2>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Thank you for your purchase. We are preparing your order.</p>
      </div>

      <div style="margin-bottom: 20px; font-size: 14px; line-height: 1.5; color: #22252A;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td><strong>Order Number:</strong> ${order.orderNumber}</td>
            <td style="text-align: right;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td><strong>Payment Method:</strong> Cash on Delivery (COD)</td>
            <td style="text-align: right;"><strong>Status:</strong> Pending Confirmation</td>
          </tr>
        </table>
      </div>

      <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />

      <div style="margin-bottom: 25px;">
        <h3 style="color: #1E3A2F; font-size: 16px; margin-top: 0;">Delivery Details</h3>
        <p style="font-size: 14px; margin: 5px 0; color: #22252A;">
          <strong>Name:</strong> ${order.customer.name}<br />
          <strong>Phone:</strong> ${order.customer.phone}<br />
          <strong>Email:</strong> ${order.customer.email}<br />
          <strong>Shipping Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.district}
        </p>
      </div>

      <h3 style="color: #1E3A2F; font-size: 16px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #F0F4F1; color: #1E3A2F;">
            <th style="padding: 10px; border-bottom: 2px solid #E2E8F0; text-align: left; font-size: 13px;">Item</th>
            <th style="padding: 10px; border-bottom: 2px solid #E2E8F0; text-align: center; font-size: 13px;">Qty</th>
            <th style="padding: 10px; border-bottom: 2px solid #E2E8F0; text-align: right; font-size: 13px;">Price</th>
            <th style="padding: 10px; border-bottom: 2px solid #E2E8F0; text-align: right; font-size: 13px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div style="width: 50%; margin-left: auto; font-size: 14px; color: #22252A;">
        <table style="width: 100%; line-height: 2;">
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">LKR ${order.subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Delivery Fee:</td>
            <td style="text-align: right;">LKR ${order.shippingCost.toLocaleString()}</td>
          </tr>
          <tr style="font-weight: bold; font-size: 16px; color: #1E3A2F; border-top: 2px solid #1E3A2F;">
            <td>Total:</td>
            <td style="text-align: right; padding-top: 5px;">LKR ${order.totalAmount.toLocaleString()}</td>
          </tr>
        </table>
      </div>

      <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 25px 0;" />

      <div style="text-align: center; color: #718096; font-size: 12px; line-height: 1.5;">
        <p>If you have any questions, reply to this email or contact us on WhatsApp at +94 76 913 8608.</p>
        <p>&copy; ${new Date().getFullYear()} Anera Foods. All Rights Reserved.</p>
      </div>
    </div>
  `;
};
