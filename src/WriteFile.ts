import { createWriteStream, existsSync, unlinkSync, WriteStream } from "fs";

class WriteFile {

    lines: string[] = [];

    filename: string;

    #writer: WriteStream;

    //.i
    constructor(filename: string) {

        this.filename = filename;

        this.createWriter();
    }

    //.i
    createWriter = () => {

        if (existsSync(this.filename))

            unlinkSync(this.filename);

        this.#writer = createWriteStream(this.filename, { flags: 'a' });
    }

    //.i
    addLines = (lines: string | string[]) => {

        if (typeof lines === 'string') {

            this.lines.push(lines)            

        } else {

            const addLine = (line: string) => {
                this.lines.push(line);
            }

            lines.forEach(addLine);
        }
    }

    //.i
    writeFile = () => {

        const writeLine = (line: string, i: number) => {

            if (i === this.lines.length - 1)

                this.#writer.write(line);

            else
                this.#writer.write(line + '\n');
        }
        
        this.lines.forEach(writeLine);
    }

    //.i
    closeWriter = () => {

        this.#writer.close();
    }
}

export default WriteFile;