import React, { useState } from 'react';
import {
  X,
  Folder,
  Image as ImageIcon,
  FileText,
  Video,
  Upload,
  Check,
  Search,
  Sparkles,
  Loader2,
  HardDrive,
  Grid,
  List
} from 'lucide-react';
import { CloudinaryFile, CloudinaryFileType } from '../types';
import { uploadFile } from '../services/api';

interface FileManagerModalPickerProps {
  isOpen: boolean;
  onClose: () => void;
  files: CloudinaryFile[];
  onSelectFile?: (fileUrl: string, file: CloudinaryFile) => void;
  onSelectMultiple?: (fileUrls: string[]) => void;
  onUploadNewFile?: (file: CloudinaryFile) => void;
  title?: string;
  filterType?: 'image' | 'video' | 'pdf' | 'all';
  multiSelect?: boolean;
}

export const FileManagerModalPicker: React.FC<FileManagerModalPickerProps> = ({
  isOpen,
  onClose,
  files = [],
  onSelectFile,
  onSelectMultiple,
  onUploadNewFile,
  title = 'Select File from Saved Library',
  filterType = 'all',
  multiSelect = false
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<CloudinaryFileType | 'all'>(
    filterType === 'image' ? 'image' : filterType === 'video' ? 'video' : filterType === 'pdf' ? 'pdf' : 'all'
  );
  
  // Multi-select state
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  
  // Direct upload state inside picker
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  if (!isOpen) return null;

  // Extract unique folders
  const folders = Array.from(new Set(files.map(f => f.folder || '/uploads'))).filter(Boolean);

  // Filter files
  const filteredFiles = files.filter(f => {
    // Type filter
    if (typeFilter !== 'all' && f.fileType !== typeFilter) {
      if (typeFilter === 'image' && f.fileType !== 'image' && f.fileType !== 'floor_plan') return false;
      if (typeFilter === 'video' && f.fileType !== 'video') return false;
      if (typeFilter === 'pdf' && f.fileType !== 'pdf' && f.fileType !== 'document') return false;
    }
    // Folder filter
    if (selectedFolder !== 'all' && f.folder !== selectedFolder) return false;
    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.folder.toLowerCase().includes(q) || f.url.toLowerCase().includes(q);
    }
    return true;
  });

  const handleToggleSelectUrl = (url: string) => {
    if (selectedUrls.includes(url)) {
      setSelectedUrls(selectedUrls.filter(u => u !== url));
    } else {
      setSelectedUrls([...selectedUrls, url]);
    }
  };

  const handleConfirmMultiSelect = () => {
    if (onSelectMultiple && selectedUrls.length > 0) {
      onSelectMultiple(selectedUrls);
      onClose();
    }
  };

  const handleSelectSingle = (file: CloudinaryFile) => {
    if (multiSelect) {
      handleToggleSelectUrl(file.url);
    } else if (onSelectFile) {
      onSelectFile(file.url, file);
      onClose();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    
    setUploading(true);
    setUploadProgress(`Uploading ${uploadedFiles.length} file(s)...`);

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const uploaded = await uploadFile(file, selectedFolder !== 'all' ? selectedFolder : '/uploads');
        if (onUploadNewFile) {
          onUploadNewFile(uploaded);
        }
        if (!multiSelect && i === 0 && onSelectFile) {
          onSelectFile(uploaded.url, uploaded);
          setUploading(false);
          onClose();
          return;
        } else if (multiSelect) {
          setSelectedUrls(prev => [...prev, uploaded.url]);
        }
      }
      setActiveTab('library');
      setUploadProgress('Upload complete!');
    } catch (err: any) {
      console.error('File Manager upload error:', err);
      alert('Failed to upload file: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 font-sans">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/30 rounded-2xl border border-blue-500/40 text-blue-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
                <span>{title}</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30 font-bold">
                  {files.length} Saved Items
                </span>
              </h2>
              <p className="text-xs text-slate-400">Select any saved photo or upload new files to your File Manager</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Main Tabs */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('library')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                activeTab === 'library'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Grid className="w-4 h-4 text-blue-400" />
              <span>Browse Saved Library ({filteredFiles.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload New File</span>
            </button>
          </div>

          {/* Search Box */}
          {activeTab === 'library' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search file name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Secondary Category / Folder Filters */}
        {activeTab === 'library' && (
          <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* File Type Filter */}
            <div className="flex items-center space-x-1 overflow-x-auto py-1">
              {[
                { id: 'all', label: 'All Types' },
                { id: 'image', label: 'Images' },
                { id: 'floor_plan', label: 'Floor Plans' },
                { id: 'pdf', label: 'PDFs' },
                { id: 'video', label: 'Videos' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTypeFilter(t.id as any)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    typeFilter === t.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Folder Dropdown */}
            {folders.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-slate-400">Folder:</span>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-700 focus:outline-none"
                >
                  <option value="all">All Folders ({files.length})</option>
                  {folders.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 min-h-[300px]">
          {activeTab === 'library' ? (
            filteredFiles.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-700">No saved files found in Library</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You haven't uploaded any files here yet, or no files match your search criteria.
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Upload First File
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredFiles.map((file) => {
                  const isSelected = selectedUrls.includes(file.url);
                  const isImage = file.fileType === 'image' || file.fileType === 'floor_plan' || file.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);

                  return (
                    <div
                      key={file.id}
                      onClick={() => handleSelectSingle(file)}
                      className={`group relative bg-white border rounded-2xl p-2 transition-all cursor-pointer flex flex-col justify-between overflow-hidden hover:shadow-md hover:border-blue-400 ${
                        isSelected ? 'border-blue-600 ring-2 ring-blue-500 bg-blue-50/30' : 'border-slate-200'
                      }`}
                    >
                      {/* Selection Badge / Check mark */}
                      {multiSelect && (
                        <div className={`absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected ? 'bg-blue-600 text-white shadow-md' : 'bg-white/80 text-slate-400 border border-slate-300'
                        }`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Image / Icon Preview */}
                      <div className="w-full h-28 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center relative">
                        {isImage ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-1 text-slate-400">
                            {file.fileType === 'pdf' ? <FileText className="w-8 h-8 text-red-500" /> : <Video className="w-8 h-8 text-purple-500" />}
                            <span className="text-[9px] font-bold uppercase">{file.fileType}</span>
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                          {file.folder}
                        </span>
                      </div>

                      {/* File Info */}
                      <div className="mt-2 space-y-0.5 px-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate" title={file.name}>
                          {file.name}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{file.bytes ? `${(file.bytes / 1024).toFixed(0)} KB` : 'Ready'}</span>
                          <span className="text-blue-600 font-bold group-hover:underline">
                            {multiSelect ? (isSelected ? 'Selected' : 'Click to select') : 'Use Image'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Upload New Tab */
            <div className="max-w-lg mx-auto py-8 space-y-6 text-center">
              <div className="border-2 border-dashed border-blue-300 bg-white p-8 rounded-3xl space-y-4 hover:border-blue-500 transition-all">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto border border-blue-100">
                  {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8 stroke-[2.5]" />}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {uploading ? 'Uploading File to Your Library...' : 'Upload File to File Manager'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select JPEG, PNG, WEBP, or PDF files. Once uploaded, files are saved in your File Manager library for future re-use.
                  </p>
                </div>

                <label className="inline-flex bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Processing...' : 'Select File from Device'}</span>
                  <input
                    type="file"
                    multiple={multiSelect}
                    accept="image/*,application/pdf"
                    disabled={uploading}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {uploadProgress && (
                  <p className="text-xs text-blue-600 font-bold animate-pulse">{uploadProgress}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            {multiSelect
              ? `${selectedUrls.length} image(s) selected`
              : 'Click any item in the library to select and attach it instantly.'}
          </p>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            {multiSelect && (
              <button
                onClick={handleConfirmMultiSelect}
                disabled={selectedUrls.length === 0}
                className={`px-5 py-2 font-extrabold text-xs rounded-xl text-white shadow-md transition-all cursor-pointer ${
                  selectedUrls.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                Use Selected Images ({selectedUrls.length})
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
