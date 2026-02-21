/**
 * Command structure for visualization operations
 */
export interface Command {
  key: string | null;
  method: string;
  args: any[];
}

/**
 * Base class for all tracers and layouts
 * Collects commands for visualization playback
 */
export abstract class Commander {
  private static commands: Command[] = [];
  private static objectCount = 0;
  private static readonly MAX_COMMANDS = 1000000;
  private static readonly MAX_OBJECTS = 100;

  protected readonly key: string;

  protected constructor(iArguments: IArguments) {
    Commander.objectCount++;
    const className = (this as any).constructor.name;
    this.key = Commander.randomizeKey();
    this.command(className, iArguments);
  }

  /**
   * Initialize the command collector
   */
  public static init() {
    this.commands = [];
    this.objectCount = 0;
  }

  /**
   * Get all collected commands
   */
  public static getCommands(): Command[] {
    return this.commands;
  }

  /**
   * Add a command to the collection
   */
  protected static command(key: string | null, method: string, iArguments: IArguments) {
    const args = Array.from(iArguments);
    this.commands.push({
      key,
      method,
      args: JSON.parse(JSON.stringify(args)),
    });

    if (this.commands.length > this.MAX_COMMANDS) {
      throw new Error('Too Many Commands');
    }
    if (this.objectCount > this.MAX_OBJECTS) {
      throw new Error('Too Many Objects');
    }
  }

  /**
   * Generate random key for tracer identification
   */
  private static randomizeKey(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Remove the tracer
   */
  destroy() {
    Commander.objectCount--;
    this.command('destroy', arguments);
  }

  /**
   * Add instance command
   */
  protected command(method: string, iArguments: IArguments) {
    Commander.command(this.key, method, iArguments);
  }

  /**
   * JSON serialization returns the key
   */
  protected toJSON() {
    return this.key;
  }
}
