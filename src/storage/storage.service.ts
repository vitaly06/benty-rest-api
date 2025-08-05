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
  private readonly storagePath = join(process.cwd(), 'storage', 'projects');

  async saveContent(fileName: string, content: any) {
    await mkdir(this.storagePath, { recursive: true });
    const filePath = join(this.storagePath, fileName);
    const contentStr = JSON.stringify(content);
    await writeFile(filePath, contentStr, 'utf8');
    return {
      path: fileName,
      size: Buffer.byteLength(contentStr),
      hash: createHash('sha256').update(contentStr).digest('hex'),
    };
  }

  async loadContent(fileName: string): Promise<any> {
    const filePath = join(this.storagePath, fileName);
    const contentStr = await readFile(filePath, 'utf8');
    return JSON.parse(contentStr);
  }

  async renameFile(oldName: string, newName: string): Promise<string> {
    const oldPath = join(this.storagePath, oldName);
    const newPath = join(this.storagePath, newName);
    await fsRename(oldPath, newPath); // Используем fsRename вместо rename
    return newName;
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = join(this.storagePath, fileName);
      await unlink(filePath);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err; // Игнорируем если файл не существует
    }
  }
}
