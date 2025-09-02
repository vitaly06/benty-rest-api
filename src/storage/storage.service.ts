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

    // Минимальная обработка контента - сохраняем всё как есть
    const contentStr = JSON.stringify(content, null, 2);

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

    try {
      const contentStr = await readFile(filePath, 'utf8');

      if (!contentStr || contentStr === 'null' || contentStr === '"null"') {
        console.warn(`File ${fileName} contains null or empty content`);
        return null;
      }

      const parsedContent = JSON.parse(contentStr);

      // Восстанавливаем структуру Slate
      return this.restoreSlateContent(parsedContent);
    } catch (error) {
      console.error(`Error loading content from file ${fileName}:`, error);
      return null;
    }
  }

  private cleanSlateContent(content: any): any {
    if (!content || typeof content !== 'object') return content;

    // Если это массив (основная структура Slate)
    if (Array.isArray(content)) {
      return content.map((item) => this.cleanNode(item));
    }

    // Если это отдельный node
    return this.cleanNode(content);
  }

  private cleanNode(node: any): any {
    if (!node || typeof node !== 'object') return node;

    // Удаляем только React-specific поля, но сохраняем все стили
    const { key, __react, ...cleanedNode } = node;

    // Text node - сохраняем все стили
    if (cleanedNode.text !== undefined) {
      const textNode: any = { text: cleanedNode.text };

      // Сохраняем ВСЕ стили текста
      if (cleanedNode.bold !== undefined) textNode.bold = cleanedNode.bold;
      if (cleanedNode.italic !== undefined)
        textNode.italic = cleanedNode.italic;
      if (cleanedNode.underline !== undefined)
        textNode.underline = cleanedNode.underline;
      if (cleanedNode.color) textNode.color = cleanedNode.color;
      if (cleanedNode.fontSize) textNode.fontSize = cleanedNode.fontSize;
      if (cleanedNode.fontFamily) textNode.fontFamily = cleanedNode.fontFamily;
      // Добавляем другие возможные стили
      if (cleanedNode.backgroundColor)
        textNode.backgroundColor = cleanedNode.backgroundColor;
      if (cleanedNode.textAlign) textNode.textAlign = cleanedNode.textAlign;
      if (cleanedNode.lineHeight) textNode.lineHeight = cleanedNode.lineHeight;

      return textNode;
    }

    // Element node - обрабатываем children
    if (cleanedNode.children && Array.isArray(cleanedNode.children)) {
      cleanedNode.children = cleanedNode.children
        .map((child) =>
          typeof child === 'object' ? this.cleanNode(child) : child,
        )
        .filter((child) => child !== null);
    }

    // Сохраняем все свойства элемента
    if (cleanedNode.type) cleanedNode.type = cleanedNode.type;
    if (cleanedNode.url) cleanedNode.url = cleanedNode.url;
    if (cleanedNode.align) cleanedNode.align = cleanedNode.align;
    // Добавляем другие возможные свойства элементов
    if (cleanedNode.style) cleanedNode.style = cleanedNode.style;

    return cleanedNode;
  }

  // Восстановление Slate контента
  private restoreSlateContent(content: any): any {
    // Просто возвращаем контент как есть, без изменений
    return content;
  }

  private restoreNode(node: any): any {
    if (!node || typeof node !== 'object') return node;

    // Восстанавливаем стандартную структуру Slate
    const restoredNode: any = {};

    // Text node
    if (node.text !== undefined) {
      Object.assign(restoredNode, node);
      return restoredNode;
    }

    // Element node
    if (node.type) {
      restoredNode.type = node.type;

      if (node.children && Array.isArray(node.children)) {
        restoredNode.children = node.children.map((child) =>
          this.restoreNode(child),
        );
      }

      // Сохраняем дополнительные свойства элемента
      if (node.url) restoredNode.url = node.url;
      if (node.align) restoredNode.align = node.align;

      return restoredNode;
    }

    return node;
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
