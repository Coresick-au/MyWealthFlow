'use client'

import { useState, useCallback } from 'react'
import { Upload, FileSpreadsheet, X, Check } from 'lucide-react'

interface CsvDropzoneProps {
    onUpload?: (file: File) => void
}

export function CsvDropzone({ onUpload }: CsvDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

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

        const files = e.dataTransfer.files
        if (files && files[0]) {
            const file = files[0]
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                setUploadedFile(file)
                onUpload?.(file)
            }
        }
    }, [onUpload])

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files[0]) {
            setUploadedFile(files[0])
            onUpload?.(files[0])
        }
    }

    const clearFile = () => {
        setUploadedFile(null)
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
                    : uploadedFile
                        ? 'border-accent-teal bg-accent-teal/5'
                        : 'border-dark-border hover:border-gray-500 hover:bg-dark-card-hover/30'
                }
      `}
        >
            <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {uploadedFile ? (
                <>
                    <div className="w-14 h-14 bg-accent-teal/10 text-accent-teal rounded-2xl flex items-center justify-center mb-4">
                        <FileSpreadsheet size={28} />
                    </div>
                    <p className="text-white font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-400 mt-1">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            clearFile()
                        }}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-dark-card-hover rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                        Remove
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
                        Drop Commonwealth, NAB, or ANZ CSVs here
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        or click to browse • Automatically detects bank format
                    </p>
                </>
            )}
        </div>
    )
}
