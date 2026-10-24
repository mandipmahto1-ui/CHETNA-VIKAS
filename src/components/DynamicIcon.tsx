import React from 'react';
import type { LucideProps } from 'lucide-react';
import {
  Combine,
  Split,
  Layers,
  Trash2,
  Crop,
  Shuffle,
  Minimize2,
  Contrast,
  Wrench,
  FileCheck2,
  Image,
  FileText,
  Table,
  AlignLeft,
  FileImage,
  FileEdit,
  Type,
  Code,
  RotateCw,
  PenTool,
  Hash,
  FileSignature,
  Stamp,
  Lock,
  Unlock,
  FileCog,
  ShieldAlert,
  FileCheck,
  Zap,
} from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Combine':
      return <Combine {...props} />;
    case 'Split':
      return <Split {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'Trash2':
      return <Trash2 {...props} />;
    case 'Crop':
      return <Crop {...props} />;
    case 'Shuffle':
      return <Shuffle {...props} />;
    case 'Minimize2':
      return <Minimize2 {...props} />;
    case 'Contrast':
      return <Contrast {...props} />;
    case 'Wrench':
      return <Wrench {...props} />;
    case 'FileCheck2':
      return <FileCheck2 {...props} />;
    case 'Image':
      return <Image {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'Table':
      return <Table {...props} />;
    case 'AlignLeft':
      return <AlignLeft {...props} />;
    case 'FileImage':
      return <FileImage {...props} />;
    case 'FileEdit':
      return <FileEdit {...props} />;
    case 'Type':
      return <Type {...props} />;
    case 'Code':
      return <Code {...props} />;
    case 'RotateCw':
      return <RotateCw {...props} />;
    case 'PenTool':
      return <PenTool {...props} />;
    case 'Hash':
      return <Hash {...props} />;
    case 'FileSignature':
      return <FileSignature {...props} />;
    case 'Stamp':
      return <Stamp {...props} />;
    case 'Lock':
      return <Lock {...props} />;
    case 'Unlock':
      return <Unlock {...props} />;
    case 'FileCog':
      return <FileCog {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    default:
      return <FileCheck {...props} />;
  }
};
