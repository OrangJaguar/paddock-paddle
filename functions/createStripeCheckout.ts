import Stripe from 'npm:stripe@14.11.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  apiVersion: '2023-10-16',
});

// Price IDs
const MONTHLY_MEMBERSHIP_PRICE_ID = 'price_1SXq04Fi0RuJvUIcy6v637WM'; // $25/month
const FULL_COURT_PRICE_ID = 'price_1SXq2HFi0RuJvUIciUVjP6JZ'; // $40 - Full court (4 spots)
const DOUBLE_OPEN_PRICE_ID = 'price_1SXqJmFi0RuJvUIcacXl3cmN'; // $30 - Double open play (2 spots)
const SINGLE_OPEN_PRICE_ID = 'price_1SXqDCFi0RuJvUIcqai14j7Y'; // $15 - Single open play (1 spot)

Deno.serve(async (req) => {
  try {
    const { email, customerName, metadata, type, bookingType } = await req.json();
    // type: 'membership' (default) or 'court_booking'
    // bookingType: 'full_court', 'double_open', or 'single_open' (for court bookings)

    console.log('Received checkout request:', { email, customerName });

    // Validate required fields
    if (!email || !customerName) {
      return Response.json({ 
        error: 'Email and customer name are required' 
      }, { status: 400 });
    }

    // Create or retrieve Stripe customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
      console.log('Found existing customer:', customer.id);
      if (metadata) {
        customer = await stripe.customers.update(customer.id, {
          metadata: metadata
        });
      }
    } else {
      console.log('Creating new customer');
      customer = await stripe.customers.create({
        email: email,
        name: customerName,
        metadata: metadata || {}
      });
      console.log('Created customer:', customer.id);
    }

    // Get the origin for redirect URLs
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/');
    
    if (!origin) {
      console.error('No origin found in request headers');
      return Response.json({ 
        error: 'Unable to determine origin for redirect URLs' 
      }, { status: 400 });
    }

    console.log('Using origin:', origin);
    
    const isCourtBooking = type === 'court_booking';
    let priceId = MONTHLY_MEMBERSHIP_PRICE_ID;
    let mode = 'subscription';
    
    if (isCourtBooking) {
      mode = 'payment';
      if (bookingType === 'single_open') {
        priceId = SINGLE_OPEN_PRICE_ID;
      } else if (bookingType === 'double_open') {
        priceId = DOUBLE_OPEN_PRICE_ID;
      } else {
        priceId = FULL_COURT_PRICE_ID;
      }
    }
    
    console.log('Creating checkout session with price:', priceId, 'mode:', mode, 'bookingType:', bookingType);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: isCourtBooking 
        ? `${origin}/BookingSuccess?payment=success&session_id={CHECKOUT_SESSION_ID}`
        : `${origin}/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: isCourtBooking
        ? `${origin}/Services?payment=cancelled`
        : `${origin}/PaymentCancelled`,
      metadata: metadata || {},
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    console.log('Checkout session created:', session.id);

    return Response.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    console.error('Error details:', {
      type: error.type,
      code: error.code,
      message: error.message,
      statusCode: error.statusCode
    });
    
    return Response.json({ 
      error: error.message,
      details: error.type || 'unknown_error',
      code: error.code || 'unknown'
    }, { status: 500 });
  }
});