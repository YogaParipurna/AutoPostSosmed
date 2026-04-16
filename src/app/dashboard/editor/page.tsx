'use client'

import { useState } from 'react'
import Editor from '@/components/Editor'
import { Sparkles, Save, Send, CalendarIcon, Loader2 } from 'lucide-react'

export default function EditorPage() {
  const [contentHtml, setContentHtml] = useState('')
  const [contentText, setContentText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

  const handleAiAction = async (type: 'generate' | 'rewrite' | 'hashtags') => {
    if (!aiPrompt && type === 'generate') return
    if (!contentText && type !== 'generate') return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: type === 'generate' ? aiPrompt : contentText,
          type 
        }),
      })
      const data = await response.json()
      if (data.result) {
        if (type === 'generate' || type === 'rewrite') {
          setContentHtml(`<p>${data.result.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`)
        } else if (type === 'hashtags') {
          setContentHtml((prev) => prev + `<p>${data.result}</p>`)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-80px)]">
      <header className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">Draft, optimize, and schedule your LinkedIn post.</p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 h-full pb-10">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <Editor 
            content={contentHtml} 
            onChange={(html, text) => {
              setContentHtml(html)
              setContentText(text)
            }} 
          />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6 overflow-y-auto">
          {/* AI Assistant */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4 font-semibold text-primary-700 dark:text-primary-400">
              <Sparkles size={18} />
              AI Assistant
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Generate from Prompt</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="What do you want to post about?"
                  className="w-full px-3 py-2 text-sm bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-24 font-sans"
                />
                <button
                  onClick={() => handleAiAction('generate')}
                  disabled={isGenerating || !aiPrompt}
                  className="w-full mt-2 bg-primary-100 hover:bg-primary-200 text-primary-800 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 dark:text-primary-300 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : 'Generate Post'}
                </button>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-800 w-full" />

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Optimize Current Content</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAiAction('rewrite')}
                    disabled={isGenerating || !contentText}
                    className="bg-white hover:bg-gray-50 dark:bg-black/40 dark:hover:bg-black/60 border border-gray-200 dark:border-gray-800 text-foreground py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Rewrite
                  </button>
                  <button
                    onClick={() => handleAiAction('hashtags')}
                    disabled={isGenerating || !contentText}
                    className="bg-white hover:bg-gray-50 dark:bg-black/40 dark:hover:bg-black/60 border border-gray-200 dark:border-gray-800 text-foreground py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Hashtags
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Publishing Controls */}
          <div className="glass-card p-5">
            <h3 className="font-semibold mb-4">Publishing</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 dark:bg-black/40 dark:hover:bg-black/60 border border-gray-200 dark:border-gray-800 px-4 py-3 rounded-xl transition-colors">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Save size={18} className="text-gray-500" />
                  Save Draft
                </span>
              </button>
              <button className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white border border-transparent px-4 py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Send size={18} />
                  Publish Now
                </span>
              </button>
              <button className="w-full flex items-center justify-between bg-primary-600 hover:bg-primary-700 text-white border border-transparent px-4 py-3 rounded-xl transition-colors shadow-lg shadow-primary-500/20">
                <span className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon size={18} />
                  Schedule
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
