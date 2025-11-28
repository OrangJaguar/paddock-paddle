import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.11.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  apiVersion: '2023-10-16',
});

const BOOKING_OPTIONS = {
  'full_court': { label: 'Full Court (4 players)', spots: 4, price: 40 },
  'single_open': { label: 'Single Open Play (1 player)', spots: 1, price: 15 }
};

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  let event;

  try {
    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  const base44 = createClientFromRequest(req);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const customer = await stripe.customers.retrieve(session.customer);
        
        const userEmail = customer.email;
        const userName = metadata.full_name || customer.name;
        const userPhone = metadata.phone || '';

        console.log('Processing payment for:', userEmail);
        console.log('Session metadata:', metadata);

        // Check if this is a COURT BOOKING payment (has booking_id in metadata)
        if (metadata.booking_id) {
          console.log('Processing court booking payment for booking:', metadata.booking_id);
          
          try {
            // 1. Confirm the booking
            const booking = await base44.asServiceRole.entities.PicleballBooking.update(metadata.booking_id, {
              status: 'confirmed',
              payment_intent_id: session.payment_intent
            });
            console.log('✅ Booking confirmed:', metadata.booking_id);

            // Fetch the full booking data for calendar and emails
            const bookings = await base44.asServiceRole.entities.PicleballBooking.filter({ id: metadata.booking_id });
            const fullBooking = bookings[0];

            if (fullBooking) {
              // 2. Add to Google Calendar (server-side - reliable even if browser closes)
              try {
                await base44.asServiceRole.functions.invoke('addToGoogleCalendar', { 
                  booking: fullBooking 
                });
                console.log('✅ Added to Google Calendar');
              } catch (calendarError) {
                console.error('⚠️ Google Calendar error:', calendarError.message);
              }

              // 3. Send confirmation emails
              const bookingOption = BOOKING_OPTIONS[fullBooking.booking_type] || BOOKING_OPTIONS['full_court'];
              const bookingTypeLabel = bookingOption.label;

              const customerEmailBody = `
                <div style="font-family: sans-serif; line-height: 1.6;">
                  <h2>Thank you for your booking, ${fullBooking.name}!</h2>
                  <p>Your payment has been received and your court is confirmed at Paddock & Paddle.</p>
                  <hr>
                  <h3>Your Booking Details:</h3>
                  <ul>
                    <li><strong>Booking Type:</strong> ${bookingTypeLabel}</li>
                    <li><strong>Court:</strong> Court ${fullBooking.selected_court}</li>
                    <li><strong>Spots Reserved:</strong> ${fullBooking.spots_booked} of 4</li>
                    <li><strong>Date:</strong> ${fullBooking.preferred_date}</li>
                    <li><strong>Time:</strong> ${fullBooking.preferred_time}</li>
                    <li><strong>Duration:</strong> 1 hour</li>
                    <li><strong>Amount Paid:</strong> $${fullBooking.price_paid}</li>
                  </ul>
                  ${fullBooking.spots_booked < 4 ? '<p><em>Note: You are sharing this court with other open-play participants.</em></p>' : ''}
                  <p>We look forward to seeing you on the court!</p>
                  <p>Best,<br>The Paddock & Paddle Team</p>
                </div>
              `;

              const adminEmailBody = `
                <div style="font-family: sans-serif; line-height: 1.6;">
                  <h2>New Paid Pickleball Booking</h2>
                  <hr>
                  <ul>
                    <li><strong>Name:</strong> ${fullBooking.name}</li>
                    <li><strong>Email:</strong> ${fullBooking.email}</li>
                    <li><strong>Phone:</strong> ${fullBooking.phone || 'Not provided'}</li>
                    <li><strong>Booking Type:</strong> ${bookingTypeLabel}</li>
                    <li><strong>Court:</strong> Court ${fullBooking.selected_court}</li>
                    <li><strong>Spots:</strong> ${fullBooking.spots_booked} of 4</li>
                    <li><strong>Date:</strong> ${fullBooking.preferred_date}</li>
                    <li><strong>Time:</strong> ${fullBooking.preferred_time}</li>
                    <li><strong>Amount Paid:</strong> $${fullBooking.price_paid}</li>
                    <li><strong>Message:</strong> ${fullBooking.message || 'None'}</li>
                  </ul>
                </div>
              `;

              await Promise.all([
                base44.asServiceRole.integrations.Core.SendEmail({
                  to: fullBooking.email,
                  subject: `Your Paddock & Paddle Court Booking is Confirmed!`,
                  body: customerEmailBody,
                  from_name: "Paddock & Paddle"
                }),
                base44.asServiceRole.integrations.Core.SendEmail({
                  to: "info@paddockandpaddle.com",
                  subject: `New Paid Booking: ${bookingTypeLabel} - ${fullBooking.name}`,
                  body: adminEmailBody,
                  from_name: "Paddock & Paddle Website"
                })
              ]);
              console.log('✅ Confirmation emails sent');
            }
          } catch (bookingError) {
            console.error('❌ Error confirming booking:', bookingError);
          }
          
          break; // Exit the case - this was a court booking, not membership
        }

        // Otherwise, this is a MEMBERSHIP payment
        const existingUsers = await base44.asServiceRole.entities.User.filter({ email: userEmail });

        if (existingUsers.length > 0) {
          console.log('Activating membership for user:', userEmail);
          
          // Update user: set email_verified to TRUE and membership_status to ACTIVE
          await base44.asServiceRole.entities.User.update(existingUsers[0].id, {
            email_verified: true,  // NOW we verify the email
            membership_status: 'active',  // Activate membership
            membership_start_date: new Date().toISOString().split('T')[0],
            payment_method: 'stripe',
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            phone: userPhone || existingUsers[0].phone
          });

          const referer = req.headers.get('referer') || '';
          const appUrl = referer ? new URL(referer).origin : 'https://paddockandpaddle.com';

          // Send WELCOME email now that everything is complete
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: userEmail,
            subject: 'Welcome to Paddock & Paddle - You\'re All Set! 🎉',
            body: `
              <div style="font-family: sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #C41E3A;">🎉 Welcome to Paddock & Paddle, ${userName}!</h2>
                <p>Congratulations! Your membership is now <strong>fully active</strong> and ready to use.</p>
                
                <div style="background: #D4EDDA; border-left: 4px solid #28A745; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #155724;">✅ You're All Set!</h3>
                  <p style="color: #155724; margin-bottom: 10px;"><strong>Your account is verified, payment confirmed, and you're ready to:</strong></p>
                  <ul style="color: #155724; margin: 10px 0;">
                    <li>🏓 <strong>Book pickleball courts</strong> - Reserve your spot on any of our 5 indoor courts</li>
                    <li>🎾 <strong>Access premium amenities</strong> - Enjoy climate-controlled facilities</li>
                    <li>👥 <strong>Connect with our community</strong> - Meet fellow members</li>
                    <li>⚙️ <strong>Manage your account</strong> - Update preferences anytime</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${appUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #C41E3A 0%, #A91A2E 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
                    Start Booking Courts Now
                  </a>
                </div>

                <div style="background: #F7F3E9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #2D2D2D;">📋 Your Membership Details</h3>
                  <ul style="color: #666;">
                    <li>✓ <strong>Status:</strong> <span style="color: #22c55e; font-weight: bold;">Active & Verified</span></li>
                    <li>✓ <strong>Plan:</strong> Monthly Membership ($25/month)</li>
                    <li>✓ <strong>Start Date:</strong> ${new Date().toLocaleDateString()}</li>
                    <li>✓ <strong>Access:</strong> 5 Indoor Courts • Premium Facilities</li>
                    <li>✓ <strong>Renewal:</strong> Automatic annual renewal</li>
                  </ul>
                </div>

                <p style="margin-top: 30px; font-size: 16px;">We're thrilled to have you as part of our exclusive community. See you on the courts!</p>

                <p style="color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                  Questions? We're here to help!<br><br>
                  <strong>The Paddock & Paddle Team</strong><br>
                  <a href="mailto:info@paddockandpaddle.com" style="color: #C41E3A;">info@paddockandpaddle.com</a> | (614) 123-4567<br>
                  8220 Dublin Road, Dublin, OH 43017
                </p>
              </div>
            `,
            from_name: 'Paddock & Paddle'
          });

          // Send admin notification
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: 'info@paddockandpaddle.com',
            subject: `✅ New Member Activated: ${userName}`,
            body: `
              <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: #22c55e;">✅ New Member Fully Activated!</h2>
                <p>A new member has completed the entire signup process and is now active.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <h3>Member Details:</h3>
                <ul>
                  <li><strong>Name:</strong> ${userName}</li>
                  <li><strong>Email:</strong> ${userEmail}</li>
                  <li><strong>Phone:</strong> ${userPhone || 'Not provided'}</li>
                  <li><strong>Member Since:</strong> ${new Date().toLocaleDateString()}</li>
                  <li><strong>Stripe Customer ID:</strong> ${session.customer}</li>
                  <li><strong>Stripe Subscription ID:</strong> ${session.subscription}</li>
                  <li><strong>Email Verified:</strong> ✅ Yes</li>
                  <li><strong>Membership Status:</strong> <span style="color: #22c55e; font-weight: bold;">ACTIVE</span></li>
                </ul>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="margin-top: 20px; padding: 15px; background: #D4EDDA; border-radius: 5px; color: #155724;">
                  <strong>✅ Ready to Go!</strong> Member can now log in and book courts. Welcome email sent.
                </p>
              </div>
            `,
            from_name: 'Paddock & Paddle System'
          });

          console.log('✅ Member fully activated:', userEmail);

        } else {
          console.error('⚠️ Payment received but user account not found:', userEmail);
          
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: 'info@paddockandpaddle.com',
            subject: '⚠️ Payment Received - User Account Not Found',
            body: `
              <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: #f59e0b;">⚠️ Payment Received - Action Required</h2>
                <p>A payment was processed but the user account was not found in the system.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <h3>Details:</h3>
                <ul>
                  <li><strong>Name:</strong> ${userName}</li>
                  <li><strong>Email:</strong> ${userEmail}</li>
                  <li><strong>Phone:</strong> ${userPhone}</li>
                  <li><strong>Stripe Customer ID:</strong> ${session.customer}</li>
                  <li><strong>Stripe Subscription ID:</strong> ${session.subscription}</li>
                </ul>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="background: #FEE2E2; padding: 15px; border-radius: 5px; color: #991B1B;">
                  <strong>ACTION REQUIRED:</strong> Please manually investigate and activate this member.
                </p>
              </div>
            `,
            from_name: 'Paddock & Paddle System'
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const users = await base44.asServiceRole.entities.User.filter({ 
          stripe_subscription_id: subscription.id 
        });

        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, {
            membership_status: 'expired',
            auto_renew: false
          });

          await base44.asServiceRole.integrations.Core.SendEmail({
            to: users[0].email,
            subject: 'Paddock & Paddle Membership Cancelled',
            body: `
              <div style="font-family: sans-serif; line-height: 1.6;">
                <h2>Membership Cancelled</h2>
                <p>Hi ${users[0].full_name},</p>
                <p>Your Paddock & Paddle membership has been cancelled and will not renew.</p>
                <p>You will continue to have access until the end of your current billing period.</p>
                <p>If you change your mind, you can always rejoin our community!</p>
                <p>Best,<br>The Paddock & Paddle Team</p>
              </div>
            `,
            from_name: 'Paddock & Paddle'
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const users = await base44.asServiceRole.entities.User.filter({ 
          stripe_customer_id: customerId 
        });

        if (users.length > 0) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: users[0].email,
            subject: 'Payment Failed - Action Required',
            body: `
              <div style="font-family: sans-serif; line-height: 1.6;">
                <h2>Payment Failed</h2>
                <p>Hi ${users[0].full_name},</p>
                <p>We were unable to process your membership payment.</p>
                <p>Please update your payment method to continue your membership.</p>
                <p>Need help? Contact us at billing@paddockandpaddle.com</p>
                <p>Best,<br>The Paddock & Paddle Team</p>
              </div>
            `,
            from_name: 'Paddock & Paddle'
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});