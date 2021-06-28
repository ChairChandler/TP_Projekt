import { PythonShell } from 'python-shell';
import { InternalServerErrorException } from '@nestjs/common';

export class Subprocess {
    private script: PythonShell;
    private stdout: string[] = [];

    constructor(private path: string) {}

    run() {
        this.script = new PythonShell(this.path);
        this.script.on('message', msg => this.stdout.push(msg));
    }

    send(data: string) {
        this.script.send(data);
    }

    read(): string {
        return this.stdout.shift();
    }

    async waitForExit(): Promise<void> {
        const exit_code: number = await new Promise((resolve, reject) => {
            this.script.end((err, code, signal) => {
                if(err) {
                    console.error(err, signal);
                    reject(err);
                }
                resolve(code);
            })
        });
        
        
        if(exit_code) {
            throw new InternalServerErrorException(`Invalid subprocess exit code: ${exit_code}`);
        }
    }
}