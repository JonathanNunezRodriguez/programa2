//.d=1
import ClassObj from './ClassObj';
import Prompt from './Prompt';
import ReadFile, { ProcessFileCallback } from './ReadFile';
import WriteFile from './WriteFile';

export type ClassType = 'nueva' | 'base' | 'reusada';

export type CodeLineType = 'base' | 'deleted' | 'modified' | 'added' | 'total';

//.b=39
const main = async () => {

	//.i
	const isItem = (line: string) => line === '//.i';

	//.i
	const isBaseCodeLine = (line: string) => line.includes('//.b=');

	//.i
	const isDeletedCodeLine = (line: string) => line.includes('//.d=');

	//.i
	const isModifiedCodeLine = (line: string) => line.substring(line.length - 4) === '//.m';

	//.i
	const startsCommentBlock = (line: string) => line.substring(0, 2) === '/*';

	//.i
	const endsCommentBlock = (line: string) => line.substring(line.length - 2) === '*/';

	//.i
	const hasBrackets = (line: string) => /[{}]/.test(line);

	//.i
	const hasLetter = (line: string) => /[a-zA-Z]/.test(line);

	//.i
	const isCodeLine = (line: string) => {

		if (line === '') return false;

		if (hasBrackets(line) && !hasLetter(line)) return false;

		if (line.substring(0, 2) === '//') return false;

		if (startsCommentBlock(line)) return false;
		
		return true;
	};

	//.i
	const printAnswer = (classes: ClassObj[]) => {
		
		const answer: string[] = [];

		answer.push('CLASES BASE:')

		classes.forEach((classObj) => {

			if (classObj.classType === 'base') {

				answer.push(classObj.toString());
			}
		});

		answer.push('--------------------------------------------');

		answer.push('CLASES NUEVAS:');

		classes.forEach((classObj) => {

			if (classObj.classType === 'nueva') {

				answer.push(classObj.toString());
			}
		});

		answer.push('--------------------------------------------');

		answer.push('CLASES REUSADAS:');

		classes.forEach((classObj) => {

			if (classObj.classType === 'reusada') {

				answer.push(classObj.toString());
			}
		});

		let totalCodeLines = 0;

		classes.forEach(classObj => {

			totalCodeLines += classObj.totalCodeLines;
		})

		answer.push('--------------------------------------------');

		answer.push(`Total de LDC=${totalCodeLines}`);

		const printLine = (line: string) => {
			
			console.log(line);
		}

		answer.forEach(printLine);

		const writer = new WriteFile('./ConteoLDC.txt');

		writer.addLines(answer);

		writer.writeFile();

		writer.closeWriter();
	};

	const prompter = new Prompt();

	const classesRead = new Set<string>();

	const classes: ClassObj[] = [];

	let currentClass = '';

	let isCommentBlock = false;

	//.i
	const getTypesOfCodeLine: ProcessFileCallback = (line) => {

		line = line.trim();

		const currentClassObj = classes.find(({ name }) => name === currentClass) as ClassObj;

		if (!isCommentBlock) {

			if (isCodeLine(line)) {
				
				currentClassObj.addCodeLines('total');

				if (isModifiedCodeLine(line))

					currentClassObj.addCodeLines('modified');
				
			} else if (isItem(line)) {
				
				currentClassObj.addItem();

			} else if (isBaseCodeLine(line)) {

				const baseCodeLines = parseInt(line.split('=')[1]);

				currentClassObj.addCodeLines('base', baseCodeLines);
				
			} else if (isDeletedCodeLine(line)) {

				const deletedCodeLines = parseInt(line.split('=')[1]);

				currentClassObj.addCodeLines('deleted', deletedCodeLines);
				
			} else if (startsCommentBlock(line) && !endsCommentBlock(line)) {

				isCommentBlock = true;
				
			}
		} else if (endsCommentBlock(line)) {

			isCommentBlock = false;

		}
	};

	const filenames: string[] = [];

	let repeat = true;

	//.d=2

	while (repeat) {

		const filename = await prompter.getVar(); //.m

		if (filename === '') repeat = false;

		else filenames.push(filename);

		//.d=8
	}

	//.d=16

	filenames.forEach((filename) => {

		try {

			const reader = new ReadFile(filename);

			reader.readFile();

			currentClass = reader.filename;

			if (!classesRead.has(currentClass)) {

				classes.push(new ClassObj(currentClass));

				classesRead.add(currentClass);
			}

			reader.proccesFile(getTypesOfCodeLine);

			currentClass = '';

		} catch (error) {

			console.error('no se pudo leer el archivo:', filename);
		}
	});

	classes.forEach((classObj) => {

		classObj.addedCodeLines = classObj.totalCodeLines - classObj.baseCodeLines + classObj.deletedCodeLines;

		if (classObj.baseCodeLines > 0 && (classObj.modifiedCodeLines > 0 || classObj.deletedCodeLines > 0 || classObj.addedCodeLines > 0)) {

			classObj.classType = 'base';

		} else if (classObj.baseCodeLines === 0 && classObj.modifiedCodeLines === 0 && classObj.deletedCodeLines === 0 && classObj.addedCodeLines > 0) {

			classObj.classType = 'nueva';

		} else if (classObj.baseCodeLines > 0 && classObj.modifiedCodeLines === 0 && classObj.deletedCodeLines === 0 && classObj.addedCodeLines === 0) {
			
			classObj.classType = 'reusada';
		}
	});

	//.d=2

	printAnswer(classes);

	await prompter.getVar('Press enter to exit...');
	
	prompter.closePrompt();
};

main();
