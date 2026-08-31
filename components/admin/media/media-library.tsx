'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Copy, FileText, Search, Image as ImageIcon } from 'lucide-react';
import { uploadMedia, deleteMedia } from '@/lib/actions/media';
import { toast } from 'sonner';

export function MediaLibrary({ initialMedia }: { initialMedia: any[] }) {
  const [media, setMedia] = useState(initialMedia || []);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = media.filter(item => 
    item.filename.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadMedia(formData);
      if (res.success && res.data) {
        setMedia([res.data, ...media]);
        toast.success('File uploaded successfully');
      } else {
        toast.error(typeof res.error === 'string' ? res.error : 'Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteMedia(id);
      if (res.success) {
        setMedia(media.filter(item => item.id !== id));
        toast.success('File deleted');
      } else {
        toast.error('Delete failed');
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search media files..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
          />
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <Button onClick={handleUploadClick} disabled={isUploading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer">
            {isUploading ? 'Uploading...' : <><Upload className="mr-2 h-4 w-4" /> Upload Asset</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMedia.map(item => (
          <Card key={item.id} className="overflow-hidden bg-white border-slate-200 shadow-sm hover:shadow-md transition-all rounded-2xl group">
            <div className="aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden">
              {item.type.startsWith('image/') ? (
                <img src={item.url} alt={item.filename} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <FileText className="h-12 w-12 text-slate-400" />
              )}
              
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" onClick={() => copyUrl(item.url)} className="h-8 w-8 rounded-lg cursor-pointer bg-white hover:bg-slate-100 text-slate-900" title="Copy URL">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)} className="h-8 w-8 rounded-lg cursor-pointer bg-red-600 hover:bg-red-700 text-white" title="Delete Asset">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-xs font-bold text-slate-900 truncate" title={item.filename}>
                {item.filename}
              </p>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                <span>{formatSize(item.size)}</span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredMedia.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No media assets found</p>
            <p className="text-xs text-slate-400 mt-1">Upload images or documents using the button above.</p>
          </div>
        )}
      </div>
    </div>
  );
}