import Stripe from 'npm:stripe@14.11.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  apiVersion: '2023-10-16',
});

Deno.serve(async (req) => {
  try {
    // Get all products with their prices
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    });

    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true
        });
        return {
          product,
          prices: prices.data
        };
      })
    );

    return Response.json(productsWithPrices);

  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});