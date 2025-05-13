import { error, redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_KEY } from '$env/static/private';

const DEFAULT_LOCALE = 'en-US';

const stripe = new Stripe(STRIPE_KEY, {
	apiVersion: '2025-04-30.basil'
});

export const load: ServerLoad = async ({ request, fetch }) => {
	const countryCode = request.headers.get('x-vercel-ip-country') ?? '';

	const raw = request.headers.get('accept-language');
	const primary = raw?.split(',')[0].split(';')[0] ?? DEFAULT_LOCALE;
	const [locale] = Intl.getCanonicalLocales(primary) || [DEFAULT_LOCALE];

	//Not all eu countries have eur prices, they will probably still have a better understanding about the price of eur compared to usd
	const euCountries = [
		'AT',
		'BE',
		'BG',
		'CY',
		'CZ',
		'DE',
		'DK',
		'EE',
		'ES',
		'FI',
		'FR',
		'HR',
		'HU',
		'IE',
		'IT',
		'LT',
		'LU',
		'LV',
		'MT',
		'NL',
		'PL',
		'PT',
		'RO',
		'SE',
		'SI',
		'SK'
	];
	const currency = euCountries.includes(countryCode) ? 'eur' : 'usd';

	const priceResponse = await fetch('/api/prices');
	if (!priceResponse.ok) throw error(priceResponse.status, 'Failed to load prices');
	const prices = (await priceResponse.json()) as Stripe.Price[];

	const customerId = null;
	let activeSub: Stripe.Subscription | null = null;
	if (customerId != null) {
		const subs = await stripe.subscriptions.list({
			customer: customerId,
			status: 'active',
			limit: 1
		});
		if (subs.data.length > 0) {
			activeSub = subs.data[0];
		}
	}

	return {
		prices,
		activeSub,
		currency,
		locale
	};
};

export const actions: Actions = {
	checkout: async ({ url, request }) => {
		const applicationUserId = undefined;
		const [form_data, customerId] = await Promise.all([request.formData(), undefined]);

		const priceId = form_data.get('price') as string;
		const mode = form_data.get('mode') as string;
		if (mode != 'subscription' && mode != 'payment') {
			error(400, 'No mode selected');
		}
		if (!priceId) {
			error(400, 'No price selected');
		}
		let session;
		const line_items = [
			{
				price: priceId,
				quantity: 1
			}
		];

		let stripeProperties: Stripe.Checkout.SessionCreateParams = {
			line_items,
			success_url: `${url.origin}/confirmed?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${url.origin}/pricing`,
			automatic_tax: { enabled: true },
			client_reference_id: applicationUserId,
			allow_promotion_codes: true,
			customer: customerId
		};

		if (mode === 'subscription') {
			stripeProperties = {
				...stripeProperties,
				subscription_data: {
					metadata: {
						user_id: applicationUserId || null
					}
				}
			};
		} else if (mode === 'payment' && !customerId) {
			stripeProperties = {
				...stripeProperties,
				customer_creation: 'always'
			};
		}

		try {
			session = await stripe.checkout.sessions.create({
				mode,
				...stripeProperties
			});
		} catch (err) {
			console.error('> Stripe rawType:', err.rawType);
			console.error('> Stripe message:', err.message);
			console.error('> Stripe param:', err.param);
			throw error(400, `Stripe error: ${err.message}`);
		}
		if (session.url) {
			redirect(303, session.url);
		}
		error(420, 'Enhance your calm');
	},
	portal: async ({ url }) => {
		const customerId = null;
		if (customerId == null) {
			redirect(303, '/pricing');
		}
		const stripeSessions = await stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: `${url.origin}/pricing`
		});
		redirect(303, stripeSessions.url);
	}
};
