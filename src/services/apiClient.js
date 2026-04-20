import { BACKEND_URL } from '../../env';

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

	try {
		response = await fetch(`${BACKEND_URL}${path}`, {
			method: options.method || 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(options.headers || {}),
			},
			body: options.body,
		});
	} catch {
		throw new Error(
			`Cannot connect to API at ${BACKEND_URL}. Set EXPO_PUBLIC_API_URL to point at the same backend if you need a different host.`
		);
	}

	const payload = await parseResponse(response);
	const message = payload?.message || `Request failed (${response.status})`;

	if (!response.ok || payload?.success === false) {
		throw new Error(message);
	}

	if (!payload && response.status !== 204) {
		throw new Error(`Invalid API response from ${BACKEND_URL}`);
	}

	return payload?.data ?? payload;
}
