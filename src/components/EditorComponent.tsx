// components/EditorComponent.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import types from EditorJS
import type { OutputData } from "@editorjs/editorjs";

interface EditorComponentProps {
  initialContent: string;
  onChange: (content: string) => void;
}

const EditorComponent = ({
  initialContent,
  onChange,
}: EditorComponentProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // Store initial content in a ref to prevent re-initialization
  const initialContentRef = useRef(initialContent);

  useEffect(() => {
    let isMounted = true;

    const initializeEditor = async () => {
      // Dynamically import EditorJS and tools only on client-side
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const Quote = (await import("@editorjs/quote")).default;
      const Embed = (await import("@editorjs/embed")).default;
      const Table = (await import("@editorjs/table")).default;
      const Marker = (await import("@editorjs/marker")).default;
      const InlineCode = (await import("@editorjs/inline-code")).default;
      const ImageTool = (await import("@editorjs/image")).default;
      const CodeTool = (await import("@editorjs/code")).default; // Import the Code tool

      if (!editorInstance.current && editorRef.current && isMounted) {
        // Parse initial content
        const parsedContent = initialContentRef.current
          ? (JSON.parse(initialContentRef.current) as OutputData)
          : { blocks: [] };

        // Use type assertion to help TypeScript understand the tools configuration
        const editor = new EditorJS({
          holder: editorRef.current,
          tools: {
            header: Header as any, // Using type assertion to bypass strict type checking
            list: List as any,
            quote: Quote as any,
            embed: Embed as any,
            table: Table as any,
            marker: Marker as any,
            inlineCode: InlineCode as any,
            code: CodeTool as any, // Add the Code tool
            image: {
              class: ImageTool as any,
              config: {
                uploader: {
                  uploadByFile(file: File) {
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        resolve({
                          success: 1,
                          file: {
                            url: e.target?.result,
                          },
                        });
                      };
                      reader.readAsDataURL(file);
                    });
                  },
                },
              },
            },
          },
          data: parsedContent,
          placeholder: "Start writing your post here...",
          async onChange(api) {
            const content = await api.saver.save();
            onChange(JSON.stringify(content));
          },
        });

        editorInstance.current = editor;
        setIsLoaded(true);
      }
    };

    initializeEditor();

    return () => {
      isMounted = false;
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []); // Remove initialContent from the dependency array

  return (
    <div>
      <div
        id="editorjs"
        ref={editorRef}
        className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[200px] bg-white"
      />
      {!isLoaded && (
        <div className="py-4 text-center text-gray-500">Loading editor...</div>
      )}
    </div>
  );
};

export default EditorComponent;
