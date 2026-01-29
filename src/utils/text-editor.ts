export type RichText = {
  type: 'doc';
  content: BlockNode[];
};

type BlockNode =
  | HeadingNode
  | ParagraphNode;

interface BaseNode {
  type: string;
  content?: InlineNode[];
}

interface HeadingNode extends BaseNode {
  type: 'heading';
  attrs: {
    level: number;
  };
  content: InlineNode[];
}

interface ParagraphNode extends BaseNode {
  type: 'paragraph';
  content: InlineNode[];
}

type InlineNode =
  | TextNode;

interface TextNode {
  type: 'text';
  text: string;
  marks?: Mark[];
}

type Mark =
  | { type: 'bold' }
  | { type: 'italic' };