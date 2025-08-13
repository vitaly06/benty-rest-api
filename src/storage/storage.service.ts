import {
  writeFile,
  readFile,
  unlink,
  mkdir,
  rename as fsRename, // Импортируем rename с алиасом
} from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  // private readonly storagePath = join(process.cwd(), 'storage', 'projects');

  async saveContent(fileName: string, content: any, type: string) {
    const storagePath = await this.getStoragePath(type);
    await mkdir(storagePath, { recursive: true });
    const filePath = join(storagePath, fileName);
    const contentStr = JSON.stringify(content);
    await writeFile(filePath, contentStr, 'utf8');
    return {
      path: fileName,
      size: Buffer.byteLength(contentStr),
      hash: createHash('sha256').update(contentStr).digest('hex'),
    };
  }

  async loadContent(fileName: string, type: string): Promise<any> {
    const storagePath = await this.getStoragePath(type);
    const filePath = join(storagePath, fileName);
    const contentStr = await readFile(filePath, 'utf8');
    return JSON.parse(contentStr);
  }

  async renameFile(
    oldName: string,
    newName: string,
    type: string,
  ): Promise<string> {
    const storagePath = await this.getStoragePath(type);
    const oldPath = join(storagePath, oldName);
    const newPath = join(storagePath, newName);
    await fsRename(oldPath, newPath); // Используем fsRename вместо rename
    return newName;
  }

  async deleteFile(fileName: string, type: string): Promise<void> {
    const storagePath = await this.getStoragePath(type);
    try {
      const filePath = join(storagePath, fileName);
      await unlink(filePath);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err; // Игнорируем если файл не существует
    }
  }

  async getStoragePath(type: string) {
    return join(process.cwd(), 'storage', type);
  }
}
