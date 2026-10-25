export type ToolCategory =
  | 'all'
  | 'organize'
  | 'convert'
  | 'edit'
  | 'security-ai';

export type OperationId =
  // 1-8: Document Assembly & Page Management
  | 'merge'
  | 'split'
  | 'organize'
  | 'delete-page'
  | 'rotate'
  | 'insert-page'
  | 'crop'
  | 'page-numbering'
  // 9-17: Conversion & Optimization
  | 'compress'
  | 'pdf-to-word'
  | 'pdf-to-pptx'
  | 'pdf-to-excel'
  | 'word-to-pdf'
  | 'pptx-to-pdf'
  | 'excel-to-pdf'
  | 'pdf-to-jpg'
  | 'jpg-to-pdf'
  // 18-19: Security & Access Control
  | 'protect'
  | 'unlock'
  // 20-21: AI & Intelligent Processing
  | 'ai-summarizer'
  | 'translate'
  // 22-30: In-Place Editing, Annotations & Markup
  | 'add-text'
  | 'find-replace'
  | 'add-links'
  | 'add-image'
  | 'add-signature'
  | 'whiteout'
  | 'annotate'
  | 'shapes'
  | 'undo-history';

export interface PdfOperationMeta {
  id: OperationId;
  name: string;
  category: ToolCategory;
  description: string;
  iconName: string;
  badge?: string;
  isCanvasTool?: boolean;
}

export interface AnnotationItem {
  id: string;
  type: 'text' | 'drawing' | 'highlight' | 'shape' | 'whiteout' | 'image' | 'signature' | 'link';
  pageIndex: number;
  x: number; // percentage or pt
  y: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  color?: string;
  fillColor?: string;
  opacity?: number;
  strokeWidth?: number;
  shapeType?: 'rectangle' | 'ellipse' | 'line' | 'arrow';
  imageDataUrl?: string;
  linkUrl?: string;
  points?: { x: number; y: number }[]; // for freehand/highlighter
}

export interface DocumentSnapshot {
  pdfBytes: Uint8Array;
  fileName: string;
  pageCount: number;
  annotations: AnnotationItem[];
  timestamp: number;
  description: string;
}
