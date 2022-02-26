import { readFileSync } from 'fs';

export type ProcessFileCallback = (line: string) => void;

//.b=14
class ReadFile {

	filename: string;

	fileformat: string;

	lines: string[];

	//.i
	constructor(filename: string) { 

		this.filename = filename.split('.')[0]; //.m

		this.fileformat = filename.split('.')[1]; //.m
	}

	//.i
	readFile = () => { //.m

		this.lines = readFileSync(`./${this.filename}.${this.fileformat}`, 'utf-8').split(/\r?\n/); //.m

		//.d=1
	};

	//.i
	proccesFile = (callback: ProcessFileCallback) => {
		
		this.lines.forEach(callback);
	};
}

export default ReadFile;