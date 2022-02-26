import { ClassType, CodeLineType } from './main';

class ClassObj {

	name: string;

	items: number = 0;

	classType: ClassType;

	baseCodeLines: number = 0;

	addedCodeLines: number = 0;

	totalCodeLines: number = 0;

	deletedCodeLines: number = 0;

	modifiedCodeLines: number = 0;

	//.i
	constructor(name: string) {

		this.name = name;
	}

	//.i
	addCodeLines = (type: CodeLineType, qty: number = 1) => {

		this[`${type}CodeLines`] += qty;
	};

	//.i
	addItem = () => {

		this.items++;
	};

	//.i
	toString() {

		const { classType, name, totalCodeLines, items, modifiedCodeLines, addedCodeLines, baseCodeLines, deletedCodeLines } = this;

		if (classType === 'base')

			return `   ${name}: T=${totalCodeLines}, I=${items}, B=${baseCodeLines}, D=${deletedCodeLines}, M=${modifiedCodeLines}, A=${addedCodeLines}`;

		else if (classType === 'nueva')

			return `   ${name}: T=${totalCodeLines}, I=${items}`;

		else 
		
			return `   ${name}: T=${totalCodeLines}, I=${items}, B=${baseCodeLines}`;
	}
}

export default ClassObj;
