import React, { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';

interface ImageUploaderProps {
  imageUrl?: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
  label: string;
  recommendedSize: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  onUpload,
  onRemove,
  label,
  recommendedSize
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setError('Only JPG, JPEG and PNG files are allowed');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }
    
    setError('');
    setIsUploading(true);
    
    try {
      await onUpload(file);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleRemoveImage = async () => {
    setIsUploading(true);
    try {
      await onRemove();
    } catch (err) {
      setError('Failed to remove image. Please try again.');
      console.error('Remove error:', err);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-xs text-gray-500">({recommendedSize})</span>
      </label>
      
      {error && (
        <div className="mb-2 p-2 bg-red-100 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      
      {imageUrl ? (
        <div className="mb-2 relative border rounded-md overflow-hidden">
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-auto max-h-48 object-contain"
          />
          <button
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
          >
            {isUploading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        </div>
      ) : (
        <div className="mb-2 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
             onClick={() => fileInputRef.current?.click()}>
          {isUploading ? (
            <Loader className="h-8 w-8 text-purple-500 animate-spin mb-2" />
          ) : (
            <Upload className="h-8 w-8 text-purple-500 mb-2" />
          )}
          <p className="text-sm text-gray-600">
            {isUploading ? 'Uploading...' : 'Click to upload an image'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG or JPEG (max 5MB)
          </p>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUploader;