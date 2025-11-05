import Stripe from 'npm:stripe@14.11.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  apiVersion: '2023-10-16',
});

// LIVE MODE Price ID (already correct)
const MEMBERSHIP_PRICE_ID = 'price_1SNgQEFi0RuJvUIcEGuImKdd';

Deno.serve(async (req) => {
  try {
    const { email, customerName, metadata } = await req.json();

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
    console.log('Creating checkout session with price:', MEMBERSHIP_PRICE_ID);

    // Create checkout session - FIXED REDIRECT URLS
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: MEMBERSHIP_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/PaymentCancelled`,
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