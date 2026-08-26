export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(...args: unknown[]): void {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${this.context}`, ...args);
  }
  debug(...args: unknown[]): void {
    // eslint-disable-next-line no-console
    console.debug(`[DEBUG] ${this.context}`, ...args);
  }
  warn(...args: unknown[]): void {
    console.warn(`[WARN] ${this.context}`, ...args);
  }
  error(...args: unknown[]): void {
    console.error(`[ERROR] ${this.context}`, ...args);
  }
}
