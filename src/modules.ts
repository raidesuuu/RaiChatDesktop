export class Logger {
  funcName: string;
  info(message: string) {
    console.log(`[${this.funcName}]\n[${new Date().toLocaleString()}]:\n${message}`);
  }
  constructor(funcName: string) {
    this.funcName = funcName
  }
}
