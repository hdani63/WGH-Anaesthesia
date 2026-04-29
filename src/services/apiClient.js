import { BACKEND_URL } from '../../env';

function normalizeApiBase(url) {
	const trimmed = String(url || '').replace(/\/+$/, '');
	if (!trimmed) return '';
	return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

async function parseResponse(response) {
	const contentType = response.headers.get('content-type') || '';
	if (!contentType.includes('application/json')) {
		return null;
	}

	try {
		return await response.json();
	} catch {
		return null;
	}
}

export async function request(path, options = {}) {
	let response;
	const baseUrl = normalizeApiBase(BACKEND_URL);
	const apiPath = path.startsWith('/') ? path : `/${path}`;
	const url = `${baseUrl}${apiPath}`;

	try {
		console.log('[apiClient] request', options.method || 'GET', url);
		response = await fetch(url, {
			method: options.method || 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(options.headers || {}),
			},
			body: options.body,
		});
	} catch {
		throw new Error(
			`Cannot connect to API at ${baseUrl}. Set EXPO_PUBLIC_API_URL to the backend root (for example http://192.168.x.x:9000).`
		);
	}

	const payload = await parseResponse(response);
	const message = payload?.message || `Request failed (${response.status})`;
	console.log('[apiClient] response', response.status, url, payload?.success, payload?.message);

	if (!response.ok || payload?.success === false) {
		throw new Error(message);
	}

	if (!payload && response.status !== 204) {
		throw new Error(`Invalid API response from ${baseUrl}`);
	}

	return payload?.data ?? payload;
}
