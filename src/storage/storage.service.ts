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

    // Проверяем, что контент валидный
    if (content === null || content === undefined) {
      throw new Error('Контент не может быть null или undefined');
    }

    // Если это строка "null" или "undefined", выбрасываем ошибку
    if (
      typeof content === 'string' &&
      (content === 'null' || content === 'undefined')
    ) {
      throw new Error('Контент не может быть строкой "null" или "undefined"');
    }

    const contentStr = JSON.stringify(content);

    // Проверяем, что после stringify не получилась строка "null"
    if (contentStr === 'null') {
      throw new Error('Результат stringify - null, неверные данные');
    }

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

    // Проверяем, что файл не содержит строку "null"
    if (contentStr === 'null' || contentStr === '"null"') {
      console.warn(`File ${fileName} contains null string`);
      return null;
    }

    try {
      return JSON.parse(contentStr);
    } catch (error) {
      console.error(`Error parsing content from file ${fileName}:`, error);
      return null;
    }
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
