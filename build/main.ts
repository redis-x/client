import { Glob } from 'bun';
import { createCommandFile } from './command-file.js';
import { createTargetFile } from './target-file.js';

const targetFiles = await Promise.all([
	createTargetFile('src/client.ts', {
		getReturnType: (return_type: string) => `Promise<${return_type}>`,
	}),
	createTargetFile('src/transaction.ts', {
		getReturnType: (return_type: string) =>
			`RedisXTransaction<AddToList<L, ${return_type}>, C, D>`,
	}),
	createTargetFile('src/transaction/use.ts', {
		getReturnType: (return_type: string) =>
			`RedisXTransactionCommand<${return_type}>`,
	}),
]);

const glob = new Glob('src/commands/*/*.ts');
const glob_exclude = new Glob('**/*.test.ts');
for await (const path of glob.scan('.')) {
	if (glob_exclude.match(path) !== true) {
		const commandFile = await createCommandFile(path);

		for (const targetFile of targetFiles) {
			targetFile.addCommand(commandFile);
		}
	}
}

if (process.argv.includes('--dry-run')) {
	for (const [index, targetFile] of targetFiles.entries()) {
		if (index > 0) {
			console.log(); // oxlint-disable-line no-console
			console.log('------------------------------------------'); // oxlint-disable-line no-console
			console.log(); // oxlint-disable-line no-console
		}

		targetFile.print();
	}
} else {
	const promises = [];
	for (const targetFile of targetFiles) {
		promises.push(targetFile.write());
	}

	await Promise.all(promises);
}
