'use client'

import React, { useState, useRef, DragEvent } from 'react'
import { ContainerDocument } from '@/types'
import { Upload, File, X, FileText, Image, FileSpreadsheet } from 'lucide-react'
import toast from 'react-hot-toast'

interface FileUploadProps {
  documents: ContainerDocument[]
  onDocumentsChange: (documents: ContainerDocument[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  maxSize?: number // MB
  documentType?: 'CMR' | 'T1' | 'OTHER'
}

const FileUpload: React.FC<FileUploadProps> = ({
  documents,
  onDocumentsChange,
  maxFiles = 10,
  acceptedTypes = ['.pdf', '.xlsx', '.xls', '.jpg', '.jpeg', '.png', '.gif'],
  maxSize = 10,
  documentType = 'OTHER'
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />
      case 'excel':
        return <FileSpreadsheet className="w-6 h-6 text-green-500" />
      case 'image':
        return <Image className="w-6 h-6 text-blue-500" />
      default:
        return <File className="w-6 h-6 text-gray-500" />
    }
  }

  const getFileType = (file: File): 'PDF' | 'EXCEL' | 'IMAGE' => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    if (extension === 'pdf') return 'PDF'
    if (extension === 'xlsx' || extension === 'xls') return 'EXCEL'
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'IMAGE'
    
    return 'PDF' // default
  }

  const validateFile = (file: File): boolean => {
    // Dosya boyutu kontrolü
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Dosya boyutu ${maxSize}MB'dan büyük olamaz`)
      return false
    }

    // Dosya tipi kontrolü
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedTypes.includes(extension)) {
      toast.error('Desteklenmeyen dosya formatı')
      return false
    }

    return true
  }

  const handleFileSelect = (files: FileList) => {
    if (documents.length + files.length > maxFiles) {
      toast.error(`Maksimum ${maxFiles} dosya yükleyebilirsiniz`)
      return
    }

    const newDocuments: ContainerDocument[] = []

    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        const document: ContainerDocument = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: documentType, // Otomatik olarak belirlenen tip
          fileType: getFileType(file),
          file: file,
          uploadDate: new Date().toISOString(),
          size: file.size
        }
        newDocuments.push(document)
      }
    })

    if (newDocuments.length > 0) {
      onDocumentsChange([...documents, ...newDocuments])
      toast.success(`${newDocuments.length} dosya başarıyla eklendi`)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFileSelect(files)
    }
    // Input'u sıfırla
    e.target.value = ''
  }

  const removeDocument = (id: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== id))
    toast.success('Dosya kaldırıldı')
  }


  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Dosyalarınızı buraya sürükleyin
        </p>
        <p className="text-sm text-gray-500 mb-4">
          veya dosya seçmek için tıklayın
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Dosya Seç
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
        <p className="text-xs text-gray-400 mt-2">
          Desteklenen formatlar: PDF, Excel, Resim • Maksimum {maxSize}MB
        </p>
      </div>

      {/* File List */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Yüklenen Dosyalar ({documents.length}/{maxFiles})
          </h4>
          
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(document.fileType)}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {document.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {document.size && formatFileSize(document.size)} • {document.fileType}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Document Type Badge */}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  document.type === 'CMR' ? 'bg-blue-100 text-blue-800' :
                  document.type === 'T1' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {document.type}
                </span>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeDocument(document.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload
