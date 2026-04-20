import type { BoardElement } from './element';

export interface SnippetElement extends BoardElement {
  relX: number;
  relY: number;
}

export interface Snippet {
  id: string;
  name: string;
  category: string;
  elements: SnippetElement[];
  bboxWidth: number;
  bboxHeight: number;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}
