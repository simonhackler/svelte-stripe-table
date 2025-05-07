import { STRIPE_KEY } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_KEY, {
    apiVersion: '2025-04-30.basil'
});

export const GET: RequestHandler = async ({ setHeaders }) => {
    const prices = await stripe.prices.list({ active: true, expand: ['data.product','data.currency_options'] });

    setHeaders({
        'Cache-Control':           'public, s-maxage=600, stale-while-revalidate=600',
        'CDN-Cache-Control':       'public, s-maxage=600, stale-while-revalidate=600',
        'Vercel-CDN-Cache-Control':'public, s-maxage=3600, stale-while-revalidate=600'
    });

    return new Response(JSON.stringify(prices.data), {
        status: 200,
        headers: { 'content-type': 'application/json' }
    });
};
