export type ToolCategory = 
  | 'all'
  | 'organize'
  | 'optimize'
  | 'convert-to'
  | 'convert-from'
  | 'edit-sign'
  | 'security';

export interface PdfTool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  badge?: string;
  badgeColor?: string;
  iconName: string;
  popular?: boolean;
  isInteractive?: boolean;
  supportedFormats?: string[];
  actionType: 
    | 'merge'
    | 'split'
    | 'image-to-pdf'
    | 'rotate-watermark'
    | 'text-to-pdf'
    | 'metadata'
    | 'compress'
    | 'generic';
}

export interface NavItem {
  label: string;
  page?: 'home' | 'founder';
  category?: ToolCategory;
  hasDropdown?: boolean;
}

export interface MergedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

export interface ImageToPdfItem {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
}
