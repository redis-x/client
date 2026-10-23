import { defineConfig } from 'tsdown';

// eslint-disable-next-line no-restricted-exports
export default defineConfig({
	entry: ['src/main.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	publint: true,
	deps: {
		neverBundle: ['redis'],
		// Promisable is inlined into declarations, without a runtime dependency.
		onlyBundle: ['type-fest'],
	},
	unused: {
		level: 'error',
		ignore: {
			// Callers supply the Redis client; its types remain part of our API.
			peerDependencies: ['redis'],
		},
	},
	outputOptions: {
		comments: { jsdoc: false, legal: true, annotation: true },
	},
});
