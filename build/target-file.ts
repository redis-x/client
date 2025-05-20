import node_path from 'node:path';
import { parseSync } from 'oxc-parser';
import { type CommandFile } from './command-file.js';

type TargetFileOptions = {
	getReturnType: (return_type: string) => string,
}

class TargetFile {
	private contents = {
		0: '',
		methods: '',
		1: '',
		imports: '',
		2: '',
	};

	get text() {
		return this.contents[0] + this.contents.methods + this.contents[1] + this.contents.imports + this.contents[2];
	}

	constructor(
		private path: string,
		contents: string,
		private options: TargetFileOptions,
	) {
		const oxc = parseSync(path, contents);

		let index_commands_start: number | null = null;
		let index_commands_end: number | null = null;
		let index_imports_start: number | null = null;
		let index_imports_end: number | null = null;

		for (const comment of oxc.comments) {
			if (comment.type === 'Line') {
				switch (comment.value.trim()) {
					case 'MARK: commands':
						index_commands_start = comment.end + 1;
						break;

					case 'MARK: end commands':
						if (index_commands_start === null) {
							throw new Error('"end commands" marker was found before "commands" marker.');
						}

						index_commands_end = comment.start - 1;
						break;

					case 'MARK: imports':
						index_imports_start = comment.end + 1;
						break;

					case 'MARK: end imports':
						if (index_imports_start === null) {
							throw new Error('"end imports" marker was found before "imports" marker.');
						}

						index_imports_end = comment.start;
						break;
				}
			}
		}

		if (index_commands_start === null) {
			throw new Error('"commands" marker was never found.');
		}

		if (index_commands_end === null) {
			throw new Error('"end commands" marker was never found.');
		}

		if (index_imports_start === null) {
			throw new Error('"imports" marker was never found.');
		}

		if (index_imports_end === null) {
			throw new Error('"end imports" marker was never found.');
		}

		// this.contents.commands = contents.slice(index_commands_start, index_commands_end);
		// this.contents.imports = contents.slice(index_imports_start, index_imports_end);

		this.contents[0] = contents.slice(
			0,
			Math.min(index_commands_start, index_imports_start),
		);
		this.contents[1] = contents.slice(
			Math.min(index_commands_end, index_imports_end),
			Math.max(index_commands_start, index_imports_start),
		);
		this.contents[2] = contents.slice(
			Math.max(index_commands_end, index_imports_end),
		);
	}

	addCommand(commandFile: CommandFile) {
		for (const overload of commandFile.overloads) {
			this.contents.methods += `\t${overload.getJsDoc().replaceAll(/\n/g, '\n\t')}\n`;
			this.contents.methods += `\t${commandFile.command}${overload.type_parameters}${overload.arguments.raw}: ${this.options.getReturnType(overload.return_type).replaceAll(/\n/g, '\n\t')};\n`;
		}

		if (commandFile.implementation.getJsDoc) {
			this.contents.methods += `\t${commandFile.implementation.getJsDoc().replaceAll(/\n/g, '\n\t')}`;
		}
		this.contents.methods += `\n\t${commandFile.command}${commandFile.implementation.type_parameters}${commandFile.implementation.arguments.raw}${commandFile.implementation.return_type ? `: ${this.options.getReturnType(commandFile.implementation.return_type).replaceAll(/\n/g, '\n\t')}` : ''} {\n`;
		this.contents.methods += `\t\treturn this.useCommand(${commandFile.import_input}(${commandFile.implementation.arguments.list}));\n`;
		this.contents.methods += `\t}\n\n`;

		let import_path = node_path.relative(
			node_path.dirname(this.path),
			commandFile.path,
		).replace(/\.ts$/, '.js');
		if (import_path.startsWith('.') !== true) {
			import_path = `./${import_path}`;
		}
		this.contents.imports += `import ${commandFile.imports} from '${import_path}';\n`;
	}

	print() {
		console.log(this.text);
	}

	async write() {
		await Bun.write(
			this.path,
			this.text,
		);
	}
}

export async function createTargetFile(
	path: string,
	options: TargetFileOptions,
) {
	const file = Bun.file(path);

	return new TargetFile(
		path,
		await file.text(),
		options,
	);
}
