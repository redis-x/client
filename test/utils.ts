/**
 * Creates a random key for Redis.
 * @returns Random key.
 */
export function createRandomKey(): string {
	const random_id = Math.random()
		.toString(36)
		.slice(2, 12);

	return `key:${random_id}`;
}
