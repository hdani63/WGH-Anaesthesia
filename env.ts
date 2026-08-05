const runtimeProcess = globalThis as typeof globalThis & {
	process?: {
		env?: {
			EXPO_PUBLIC_API_URL?: string;
		};
	};
};

export const BACKEND_URL = runtimeProcess.process?.env?.EXPO_PUBLIC_API_URL || 'https://wgh-api.projectco.space/api';

// The News Admin password is no longer bundled: the check moved to the server
// (POST /admin/news/login), which issues a short-lived bearer token. Set
// ADMIN_PASSWORD in the backend's environment instead.
