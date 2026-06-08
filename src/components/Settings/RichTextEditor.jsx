import { useState, useRef, useEffect } from "react"
import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Type
} from "lucide-react"

const RichTextEditor = ({ initialContent, onChange }) => {
    const [content, setContent] = useState(initialContent)
    const editorRef = useRef(null)

    const formatText = (command, value = null) => {
        document.execCommand(command, false, value)
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML)
            if (onChange) onChange(editorRef.current.innerHTML)
        }
    }

    const handleInput = (e) => {
        const newContent = e.currentTarget.innerHTML
        setContent(newContent)
        if (onChange) onChange(newContent)
    }

    // Set initial content
    useEffect(() => {
        if (editorRef.current && initialContent !== undefined) {
            // Do not overwrite content if the user is actively typing
            if (document.activeElement === editorRef.current) {
                return;
            }
            if (editorRef.current.innerHTML !== initialContent) {
                editorRef.current.innerHTML = initialContent
            }
        }
    }, [initialContent])

    return (
        <div className="border border-gray rounded-2xl overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-3 border-b border-gray bg-gray-50/50 flex-wrap">
                <button
                    onClick={() => formatText('bold')}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    title="Bold"
                >
                    <Bold size={18} />
                </button>
                <button
                    onClick={() => formatText('italic')}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    title="Italic"
                >
                    <Italic size={18} />
                </button>
                <button
                    onClick={() => formatText('underline')}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    title="Underline"
                >
                    <Underline size={18} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <button
                    onClick={() => formatText('justifyLeft')}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    title="Align Left"
                >
                    <AlignLeft size={18} />
                </button>
                <button
                    onClick={() => formatText('justifyCenter')}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    title="Align Center"
                >
                    <AlignCenter size={18} />
                </button>
                <button
                    onClick={() => formatText('justifyRight')}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    title="Align Right"
                >
                    <AlignRight size={18} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <button
                    onClick={() => formatText('insertUnorderedList')}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    title="Bullet List"
                >
                    <List size={18} />
                </button>
                <button
                    onClick={() => formatText('insertOrderedList')}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    title="Numbered List"
                >
                    <ListOrdered size={18} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <select
                    onChange={(e) => formatText('fontSize', e.target.value)}
                    className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none cursor-pointer"
                    defaultValue="3"
                >
                    <option value="1">Small</option>
                    <option value="3">Normal</option>
                    <option value="5">Large</option>
                    <option value="7">Huge</option>
                </select>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="p-6 min-h-[400px] outline-none text-gray-700 text-[15px] leading-relaxed py-6 px-8"
                style={{ minHeight: '400px' }}
            >
            </div>
        </div>
    )
}

export default RichTextEditor
