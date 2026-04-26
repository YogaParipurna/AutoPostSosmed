'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import Image from '@tiptap/extension-image'

interface EditorProps {
  content: string
  onChange: (content: string, text: string) => void
}

const limit = 3000

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      CharacterCount.configure({
        limit,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-6',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getText())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  const characterCount = editor.storage.characterCount.characters()
  const percentage = Math.round((characterCount / limit) * 100)

  return (
    <div className="flex flex-col h-full border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white/50 dark:bg-black/30">
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center text-sm text-gray-500">
        <div>
          {characterCount} / {limit} characters
        </div>
        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${percentage > 90 ? 'bg-red-500' : 'bg-primary-500'}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
