"use client";

import { useCallback, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  type EditorState,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode, type HeadingTagType } from "@lexical/rich-text";
import {
  ListNode,
  ListItemNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Pilcrow,
} from "lucide-react";

const editorNodes = [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode];

const editorTheme = {
  paragraph: "mb-3 last:mb-0",
  heading: {
    h2: "mb-2 mt-4 text-lg font-bold text-white first:mt-0",
    h3: "mb-2 mt-3 text-base font-bold text-white first:mt-0",
  },
  quote: "my-3 border-l-2 border-red-600/50 pl-3 italic text-gray-400",
  list: {
    ul: "mb-3 list-disc space-y-1 pl-5",
    ol: "mb-3 list-decimal space-y-1 pl-5",
    listitem: "leading-relaxed",
  },
  link: "text-red-400 underline hover:text-red-300",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
};

function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const insertLink = () => {
    const url = window.prompt("Σύνδεσμος URL:");
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url || null);
  };

  const btn =
    "rounded-md p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white";

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/5 px-2 py-1.5">
      <button type="button" className={btn} title="Έντονα" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
        <Bold className="h-4 w-4" />
      </button>
      <button type="button" className={btn} title="Πλάγια" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
        <Italic className="h-4 w-4" />
      </button>
      <button type="button" className={btn} title="Υπογράμμιση" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
        <Underline className="h-4 w-4" />
      </button>
      <span className="mx-1 h-4 w-px bg-white/10" />
      <button type="button" className={btn} title="Παράγραφος" onClick={formatParagraph}>
        <Pilcrow className="h-4 w-4" />
      </button>
      <button type="button" className={btn} title="Επικεφαλίδα 2" onClick={() => formatHeading("h2")}>
        <Heading2 className="h-4 w-4" />
      </button>
      <button type="button" className={btn} title="Επικεφαλίδα 3" onClick={() => formatHeading("h3")}>
        <Heading3 className="h-4 w-4" />
      </button>
      <button type="button" className={btn} title="Παράθεση" onClick={formatQuote}>
        <Quote className="h-4 w-4" />
      </button>
      <span className="mx-1 h-4 w-px bg-white/10" />
      <button
        type="button"
        className={btn}
        title="Λίστα"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={btn}
        title="Αριθμημένη λίστα"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button type="button" className={btn} title="Σύνδεσμος" onClick={insertLink}>
        <LinkIcon className="h-4 w-4" />
      </button>
      <span className="mx-1 h-4 w-px bg-white/10" />
      <button type="button" className={btn} title="Αναίρεση" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        <Undo2 className="h-4 w-4" />
      </button>
      <button type="button" className={btn} title="Επανάληψη" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  );
}

interface RichTextEditorProps {
  name: string;
  label: string;
  /** Raw Lexical serialized state as stored by Payload, e.g. `doc.content`. */
  defaultValue?: unknown;
  hint?: string;
}

/**
 * Minimal Lexical-based rich text editor for the club-admin dashboard. It
 * serializes to the same JSON shape Payload's lexicalEditor stores (built on
 * the same @lexical/* packages), so content written here round-trips
 * correctly through Payload's collections without going through /admin.
 */
export function RichTextEditor({ name, label, defaultValue, hint }: RichTextEditorProps) {
  const [serialized, setSerialized] = useState<string>(() =>
    defaultValue ? JSON.stringify(defaultValue) : ""
  );

  const handleChange = useCallback((editorState: EditorState) => {
    setSerialized(JSON.stringify(editorState.toJSON()));
  }, []);

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-400">{label}</label>
      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
        <LexicalComposer
          initialConfig={{
            namespace: `club-admin-${name}`,
            nodes: editorNodes,
            theme: editorTheme,
            editorState: defaultValue ? JSON.stringify(defaultValue) : undefined,
            onError: (error: Error) => console.error(error),
          }}
        >
          <Toolbar />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="min-h-[180px] px-3 py-2.5 text-sm text-white focus:outline-none" />
              }
              placeholder={
                <div className="pointer-events-none absolute left-3 top-[52px] text-sm text-gray-600">
                  Γράψτε εδώ…
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
        </LexicalComposer>
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      <input type="hidden" name={name} value={serialized} />
    </div>
  );
}
