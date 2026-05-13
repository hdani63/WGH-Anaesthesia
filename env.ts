const runtimeProcess = globalThis as typeof globalThis & {
	process?: {
		env?: {
			EXPO_PUBLIC_API_URL?: string;
		};
	};
};

export const BACKEND_URL = runtimeProcess.process?.env?.EXPO_PUBLIC_API_URL || '';
