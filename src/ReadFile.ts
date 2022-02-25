import { readFileSync } from 'fs';

export type ProcessFileCallback = (line: string) => void;

//.b=9
class ReadFile {

	filename: string;

	fileformat: string;

	lines: string[];

	//.i
	constructor(filename: string) { 

		this.filename = filename.split('.')[0];

		this.fileformat = filename.split('.')[1];		
	}

	//.i
	readFile = () => {

		// const dir = join(__dirname, `${this.filename}.${this.fileformat}`);

		// console.log(dir)

		this.lines = readFileSync(`./${this.filename}.${this.fileformat}`, 'utf-8').split(/\r?\n/);
	};

	//.i
	proccesFile = (callback: ProcessFileCallback) => { //.m
		
		this.lines.forEach(callback);
	};
}

export default ReadFile;
