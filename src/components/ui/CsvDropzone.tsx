'use client'

import { useState, useCallback } from 'react'
import { Upload, FileSpreadsheet, X, Check } from 'lucide-react'

interface CsvDropzoneProps {
    onUpload?: (files: File[]) => void
}

export function CsvDropzone({ onUpload }: CsvDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true)
        } else if (e.type === 'dragleave') {
            setIsDragging(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files).filter(
            file => file.type === 'text/csv' || file.name.endsWith('.csv')
        )

        if (files.length > 0) {
            setUploadedFiles(files)
            onUpload?.(files)
        }
    }, [onUpload])

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            setUploadedFiles(files)
            onUpload?.(files)
        }
    }

    const clearFiles = () => {
        setUploadedFiles([])
    }

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
        relative border-2 border-dashed rounded-2xl p-8 
        flex flex-col items-center justify-center text-center 
        transition-all duration-200 cursor-pointer
        ${isDragging
                    ? 'border-accent-lime bg-accent-lime/5'
                    : uploadedFiles.length > 0
                        ? 'border-accent-teal bg-accent-teal/5'
                        : 'border-dark-border hover:border-gray-500 hover:bg-dark-card-hover/30'
                }
      `}
        >
            <input
                type="file"
                accept=".csv"
                multiple
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {uploadedFiles.length > 0 ? (
                <>
                    <div className="w-14 h-14 bg-accent-teal/10 text-accent-teal rounded-2xl flex items-center justify-center mb-4">
                        <FileSpreadsheet size={28} />
                    </div>
                    <div className="text-white font-medium">
                        {uploadedFiles.length === 1 ? (
                            <>
                                <p>{uploadedFiles[0].name}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {(uploadedFiles[0].size / 1024).toFixed(1)} KB
                                </p>
                            </>
                        ) : (
                            <>
                                <p>{uploadedFiles.length} files selected</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Total size: {(uploadedFiles.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1)} KB
                                </p>
                            </>
                        )}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            clearFiles()
                        }}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-dark-card-hover rounded-lg text-gray-400 hover:text-white transition-colors z-10 relative"
                    >
                        <X size={16} />
                        Remove All
                    </button>
                </>
            ) : (
                <>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDragging
                        ? 'bg-accent-lime/20 text-accent-lime'
                        : 'bg-dark-card-hover text-gray-400'
                        }`}>
                        <Upload size={28} />
                    </div>
                    <p className="text-white font-medium">
                        Drop CSV files here
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Upload one or multiple files • Automatically detects bank format
                    </p>
                </>
            )}
        </div>
    )
}
