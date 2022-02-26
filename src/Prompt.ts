import { createInterface, Interface, ReadLineOptions } from 'readline';
//.d=1

const interfaceOptions: ReadLineOptions = {

    input:  process.stdin,

    output:  process.stdout,
};

//.b=21
class Prompt {

	reader: Interface;

	//.d=1

	//.i
	constructor() {

		this.reader = createInterface(interfaceOptions);

		//.d=1
	}

	//.i
	getVar = (message = ''): Promise<string> => { //.m

		return new Promise((resolve) => {

			this.reader.question(message, (answer) => {

				resolve(answer);
			});
		});

		//.d=6
	};

	//.i
	closePrompt = () => {

		this.reader.close();
	};
}

export default Prompt;