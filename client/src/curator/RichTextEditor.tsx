/**
 * Rich Text Editor — supports bold, italic, paragraphs, line breaks, quotes, and lists.
 * Uses contentEditable with execCommand (no extra dependencies).
 *
 * Storage format: each top-level block becomes one entry in the string array.
 * Blocks that contain formatting are stored as sanitized HTML fragments
 * (e.g. "<p>Dear <b>Chicko</b>…</p>"); plain blocks are stored as raw text.
 * The public museum renders HTML entries via a guarded dangerouslySetInnerHTML
 * and plain entries as ordinary paragraphs, so old content keeps working.
 */
import { useCallback, useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string[];
  onChange: (lines: string[]) => void;
  placeholder?: string;
  className?: string;
}

const TOOLBAR_BUTTONS: { cmd: string; label: string; arg?: string; title: string; styleClass?: string }[] = [
  { cmd: "bold", label: "B", title: "Bold", styleClass: "font-bold" },
  { cmd: "italic", label: "I", title: "Italic", styleClass: "italic" },
  { cmd: "insertUnorderedList", label: "• List", title: "Bulleted list" },
  { cmd: "insertOrderedList", label: "1. List", title: "Numbered list" },
  { cmd: "formatBlock", label: "❝ Quote", arg: "blockquote", title: "Quote block" },
  { cmd: "formatBlock", label: "¶ Paragraph", arg: "p", title: "Normal paragraph" },
];

/** Tags we allow in stored content. Everything else is unwrapped to text. */
const ALLOWED_TAGS = new Set(["P", "B", "STRONG", "I", "EM", "BR", "BLOCKQUOTE", "UL", "OL", "LI", "DIV"]);

function sanitizeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node as HTMLElement;
  const tag = el.tagName;
  const inner = Array.from(el.childNodes).map(sanitizeNode).join("");
  if (tag === "BR") return "<br>";
  if (!ALLOWED_TAGS.has(tag)) return inner;
  const t = tag === "DIV" ? "p" : tag === "STRONG" ? "b" : tag === "EM" ? "i" : tag.toLowerCase();
  return `<${t}>${inner}</${t}>`;
}

/** Convert editor DOM into the stored string array (one entry per block). */
function editorToLines(root: HTMLElement): string[] {
  const lines: string[] = [];
  Array.from(root.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || "").trim();
      if (text) lines.push(text);
      return;
    }
    const html = sanitizeNode(node);
    if (!html) return;
    // Strip wrapper if the block has no inner formatting — store plain text
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const el = tmp.firstElementChild;
    const isPlainP = el && el.tagName === "P" && el.innerHTML === (el.textContent || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const text = (el?.textContent || "").trim();
    if (!text && !html.includes("<br>")) return;
    lines.push(isPlainP ? text : html);
  });
  return lines;
}

/** Convert stored string array into editor HTML. */
function linesToHtml(value: string[]): string {
  if (!value || value.length === 0) return "<p><br></p>";
  return value
    .map((line) => {
      if (/<[a-z][\s\S]*>/i.test(line)) return line; // already an HTML fragment
      if (line.startsWith("> ")) return `<blockquote>${line.slice(2)}</blockquote>`; // legacy markdown quotes
      return `<p>${line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</p>`;
    })
    .join("");
}

export default function RichTextEditor({ value, onChange, placeholder = "Type your content...", className = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef<string | null>(null);

  // Initialize / sync external value (only when it didn't originate from us)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const incoming = JSON.stringify(value);
    if (incoming === lastEmitted.current) return;
    el.innerHTML = linesToHtml(value);
    lastEmitted.current = incoming;
  }, [value]);

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const lines = editorToLines(el);
    lastEmitted.current = JSON.stringify(lines);
    onChange(lines);
  }, [onChange]);

  const handleExecCommand = useCallback((cmd: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    emit();
  }, [emit]);

  return (
    <div className={`rich-text-editor ${className}`}>
      <div className="flex flex-wrap gap-1 mb-2 p-1 bg-gray-100 rounded border border-gray-300">
        {TOOLBAR_BUTTONS.map((btn, i) => (
          <button
            key={i}
            type="button"
            title={btn.title}
            className="px-2 py-1 text-xs bg-white hover:bg-gray-200 rounded border border-gray-300 transition-colors"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleExecCommand(btn.cmd, btn.arg)}
          >
            <span className={btn.styleClass}>{btn.label}</span>
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className="min-h-[120px] max-h-[50vh] overflow-y-auto p-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm leading-relaxed [&_blockquote]:border-l-2 [&_blockquote]:border-amber-400 [&_blockquote]:pl-3 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-2"
        onInput={emit}
        onBlur={emit}
      />
      <p className="text-xs text-gray-400 mt-1">
        Bold, italics, quotes and lists are preserved. Press Enter for a new paragraph, Shift+Enter for a line break.
      </p>
    </div>
  );
}
