export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(...args: unknown[]): void {
    console.info(`[INFO] ${this.context}`, ...args);
  }
  debug(...args: unknown[]): void {
    console.debug(`[DEBUG] ${this.context}`, ...args);
  }
  warn(...args: unknown[]): void {
    console.warn(`[WARN] ${this.context}`, ...args);
  }
  error(...args: unknown[]): void {
    console.error(`[ERROR] ${this.context}`, ...args);
  }
}
