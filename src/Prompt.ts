import { createInterface, Interface } from 'readline';

//.b=12
class Prompt {
	reader: Interface;

	//.i
	constructor() {
		this.reader = createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		//.d=1
	}

	//.i
	getVar = (message: string = ''): Promise<string> => { //.m
		return new Promise((resolve) => {
			this.reader.question(message, (answer) => {
				resolve(answer);
			});
		});
		//.d=5
	};

	//.i
	closePrompt = () => { //.m
		this.reader.close();
	};
}

export default Prompt;
