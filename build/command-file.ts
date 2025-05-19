import { parseSync } from 'oxc-parser';

type CommandOverload = {
	getJsDoc: (returns_text?: string) => string,
	arguments: {
		raw: string,
	},
	return_type: string,
}
type CommandImplementation = {
	getJsDoc?: (returns_text?: string) => string,
	arguments: {
		raw: string,
		list: string,
	},
	return_type?: string,
}

function processRawArguments(value: string) {
	// if (value.includes('\n')) {
	// 	console.log('value', value);
	// }

	// value = value.replaceAll(/^\(\n\s*/g, '(')
	// 	.replaceAll(/,\n\s*/g, ', ')
	// 	.replaceAll(/,\n\s*\)$/g, '');

	// if (value.endsWith(',')) {
	// 	value = value.slice(0, -1);
	// }

	value = value.replaceAll(/\n/g, '\n\t');

	return value;
}

export class CommandFile {
	command: string;
	import_input: string;
	imports: string = '';
	overloads: CommandOverload[] = [];
	implementation: CommandImplementation = {
		arguments: {
			raw: '',
			list: '',
		},
	};

	constructor(
		public path: string,
		contents: string,
	) {
		this.command = path.split('/').pop()!.split('.')[0].toUpperCase();
		this.import_input = `input_${this.command.toLowerCase()}`;

		const oxc = parseSync(path, contents);
		const imports: string[] = [];

		const comments = new Map<number, CommandOverload['getJsDoc']>();
		for (const comment of oxc.comments) {
			if (comment.type === 'Block') {
				const comment_text = `/*${comment.value}*/`;
				const comment_lines = comment_text.split('\n');
				const index_returns = comment_lines.findIndex(line => line.startsWith(' * @returns '));

				comments.set(
					comment.end + 1,
					(returns_description?: string) => {
						if (typeof returns_description === 'string') {
							comment_lines[index_returns] = ` * @returns ${returns_description}`;
							return comment_lines.join('\n');
						}

						return comment_text;
					},
				);
			}
		}

		for (const node of oxc.program.body) {
			if (
				node.type === 'TSDeclareFunction'
				&& node.id?.type === 'Identifier'
				&& node.id.name === '_command'
			) {
				const getJsDoc = comments.get(node.start);
				if (!getJsDoc) {
					throw new Error('JsDoc comment not found for command.');
				}
				// console.log('comment:', commentGetter());

				const arguments_raw = contents.slice(node.params.start, node.params.end);
				// console.log('params:', params);

				if (!node.returnType) {
					throw new Error('Every command must have a return type.');
				}

				const return_type = contents.slice(
					node.returnType.typeAnnotation.start,
					node.returnType.typeAnnotation.end,
				);
				// console.log('return_type:', return_type);

				this.overloads.push({
					getJsDoc,
					arguments: {
						raw: processRawArguments(arguments_raw),
					},
					return_type,
				});
			}
			else if (
				node.type === 'ExportNamedDeclaration'
				&& node.declaration?.type === 'FunctionDeclaration'
				&& node.declaration.id?.type === 'Identifier'
				&& node.declaration.id.name === 'input'
			) {
				const getJsDoc = comments.get(node.start);

				let return_type: string | undefined;
				if (
					node.declaration.returnType
					&& node.declaration.returnType.typeAnnotation.type === 'TSTypeReference'
					&& node.declaration.returnType.typeAnnotation.typeName.type === 'Identifier'
					&& node.declaration.returnType.typeAnnotation.typeName.name === 'Command'
					&& node.declaration.returnType.typeAnnotation.typeParameters
				) {
					const { params } = node.declaration.returnType.typeAnnotation.typeParameters;
					if (params[0]) {
						return_type = contents.slice(
							params[0].start,
							params[0].end,
						);
					}
				}

				this.implementation = {
					getJsDoc,
					arguments: {
						raw: processRawArguments(
							contents.slice(
								node.declaration.params.start,
								node.declaration.params.end,
							),
						),
						list: node.declaration.params.items.map((item) => {
							if (
								item.type === 'FormalParameter'
								&& item.pattern.type === 'Identifier'
							) {
								return item.pattern.name;
							}

							if (
								item.type === 'RestElement'
								&& item.argument.type === 'Identifier'
							) {
								return `...${item.argument.name}`;
							}

							throw new Error('Unexpected parameter type.');
						}).join(', '),
					},
					return_type,
				};
			}
			else if (
				node.type === 'ExportNamedDeclaration'
				&& node.declaration?.type === 'TSTypeAliasDeclaration'
				&& node.declaration.id?.type === 'Identifier'
			) {
				imports.push(`\ttype ${node.declaration.id.name},`);
			}
			// else {
			// 	console.log('node:', node);
			// }
		}

		if (
			this.overloads.length === 0
			&& (
				this.implementation.getJsDoc === undefined
				|| this.implementation.return_type === undefined
			)
		) {
			throw new Error(`No overloads found in ${path} and no JsDoc for implementation found.`);
		}

		imports.push(`\tinput as ${this.import_input},`);
		this.imports = `{\n${imports.join('\n')}\n}`;
	}
}

export async function createCommandFile(path: string) {
	const file = Bun.file(path);

	return new CommandFile(
		path,
		await file.text(),
	);
}
