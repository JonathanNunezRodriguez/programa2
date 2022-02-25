import ClassObj from './ClassObj';
import Prompt from './Prompt';
import ReadFile, { ProcessFileCallback } from './ReadFile';

const isItem = (line: string) => line === '//.i';

const isBaseCodeLine = (line: string) => line.includes('//.b=');

const isDeletedCodeLine = (line: string) => line.includes('//.d=');

const isModifiedCodeLine = (line: string) => line.substring(line.length - 4) === '//.m';

const startsCommentBlock = (line: string) => line.substring(0, 2) === '/*';

const endsCommentBlock = (line: string) => line.substring(line.length - 2) === '*/';

const hasBrackets = (line: string) => /[{}]/.test(line);

const hasLetter = (line: string) => /[a-zA-Z]/.test(line);

const isCodeLine = (line: string) => {

	if (line === '') return false;

	if (hasBrackets(line) && !hasLetter(line)) return false;

	if (line.substring(0, 2) === '//') return false;

	if (startsCommentBlock(line)) return false;
	
	return true;
};

const printAnswer = (classes: ClassObj[]) => {

	console.log('CLASES BASE:')

	classes.forEach((classObj) => {

		if (classObj.classType === 'base') {

			console.log(classObj.toString());			
		}
	});

	console.log('--------------------------------------------');

	console.log('CLASES NUEVAS');

	classes.forEach((classObj) => {

		if (classObj.classType === 'nueva') {

			console.log(classObj.toString());
		}
	});

	console.log('--------------------------------------------');

	console.log('CLASES REUSADAS');

	classes.forEach((classObj) => {

		if (classObj.classType === 'reusada') {

			console.log(classObj.toString());
		}
	});

	let totalCodeLines = 0;

	classes.forEach(classObj => {

		totalCodeLines += classObj.totalCodeLines;
	})

	console.log('--------------------------------------------');

	console.log('Total de LDC=', totalCodeLines);	
}

//.b=30
const main = async () => {

	const prompter = new Prompt();

	const classesRead = new Set<string>();

	const classes: ClassObj[] = [];

	let currentClass = '';

	let isCommentBlock = false;

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

	while (repeat) {

		const filename = await prompter.getVar();

		if (filename === '') repeat = false;

		else filenames.push(filename);
	}

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

	printAnswer(classes);

	await prompter.getVar('Press enter to exit...');
	
	prompter.closePrompt();
};

main();
