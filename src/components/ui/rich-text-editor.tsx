"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useMemo, useCallback } from "react";

// ─── Dynamic import to avoid SSR issues ──────────────────────────
const ReactQuill = dynamic(
    () => import("react-quill-new"),
    { ssr: false, loading: () => <EditorFallback /> }
);

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    rows?: number;
    direction?: "ltr" | "rtl";
}

// ─── Quill Module & Format Config ─────────────────────────────────
const QUILL_MODULES = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { color: [] },
            { background: [] },
        ],
        [
            { align: [] },
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image", "video"],
        ["code-block"],
        ["clean"],
    ],
};

const QUILL_FORMATS = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "color",
    "background",
    "align",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
];

// ─── Fallback loader ──────────────────────────────────────────────
function EditorFallback() {
    return (
        <div className="flex items-center justify-center min-h-[250px] bg-gray-50 border border-gray-300 rounded-lg">
            <div className="flex flex-col items-center gap-2 text-gray-400">
                <svg
                    className="animate-spin h-8 w-8 text-emerald-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
                <span className="text-sm font-medium">Loading editor…</span>
            </div>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────
export default function RichTextEditor({
    value,
    onChange,
    direction = "ltr",
    placeholder = "Write your content…",
    rows = 10,
}: RichTextEditorProps) {
    const isRtl = direction === "rtl";

    // react-quill-new types may use `Delta` or `string` depending on version;
    // we bind to the `value` as an HTML string.
    const handleChange = useCallback(
        (content: string) => {
            // Quill fires with the HTML string when not using Delta mode
            onChange(content);
        },
        [onChange]
    );

    const editorStyle = useMemo(
        () => ({
            minHeight: `${Math.max(rows * 28, 250)}px`,
            fontFamily: isRtl ? "var(--font-urdu)" : undefined,
        }),
        [rows, isRtl]
    );

    return (
        <div
            dir={direction}
            className="rich-editor-wrapper border border-gray-300 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition-all"
            style={isRtl ? { fontFamily: "var(--font-urdu)" } : undefined}
        >
            <ReactQuill
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder={placeholder}
                style={editorStyle}
            />
        </div>
    );
}