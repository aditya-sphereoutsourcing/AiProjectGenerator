import { 
  type Message, type InsertMessage,
  type File, type InsertFile,
  type Log, type InsertLog
} from "@shared/schema";

export interface IStorage {
  // Messages
  getMessages(): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
  
  // Files
  getFiles(): Promise<File[]>;
  addFile(file: InsertFile): Promise<File>;
  getFileByPath(path: string): Promise<File | undefined>;
  
  // Logs
  getLogs(): Promise<Log[]>;
  addLog(log: InsertLog): Promise<Log>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private files: Map<number, File>;
  private logs: Map<number, Log>;
  private currentIds: {
    messages: number;
    files: number;
    logs: number;
  };

  constructor() {
    this.messages = new Map();
    this.files = new Map();
    this.logs = new Map();
    this.currentIds = {
      messages: 1,
      files: 1,
      logs: 1
    };
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async addMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentIds.messages++;
    const newMessage: Message = {
      ...message,
      id,
      timestamp: new Date()
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getFiles(): Promise<File[]> {
    return Array.from(this.files.values());
  }

  async addFile(file: InsertFile): Promise<File> {
    const id = this.currentIds.files++;
    const newFile: File = {
      ...file,
      id
    };
    this.files.set(id, newFile);
    return newFile;
  }

  async getFileByPath(path: string): Promise<File | undefined> {
    return Array.from(this.files.values()).find(file => file.path === path);
  }

  async getLogs(): Promise<Log[]> {
    return Array.from(this.logs.values());
  }

  async addLog(log: InsertLog): Promise<Log> {
    const id = this.currentIds.logs++;
    const newLog: Log = {
      ...log,
      id,
      timestamp: new Date()
    };
    this.logs.set(id, newLog);
    return newLog;
  }
}

export const storage = new MemStorage();
