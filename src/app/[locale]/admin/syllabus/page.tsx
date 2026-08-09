"use client";

import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';

export default function ManageSyllabusPage() {
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    // In a full implementation, we'd use the pre-signed URL to upload
    setTimeout(() => {
      setIsUploading(false);
      alert('Syllabus uploaded successfully! (Placeholder action)');
    }, 1500);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Syllabus Files</h1>
      
      <div className="bg-card border rounded-xl p-8 shadow-sm max-w-2xl mb-12">
        <h2 className="text-xl font-semibold mb-6">Upload New Syllabus</h2>
        <form className="space-y-6" onSubmit={handleUpload}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="certification">For Certification</label>
            <select id="certification" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">-- Choose Certification --</option>
              <option value="cert1">CTFL - Foundation Level</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="file">Syllabus PDF File</label>
            <input id="file" type="file" accept=".pdf" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring file:border-0 file:bg-transparent file:text-sm file:font-medium" />
          </div>
          
          <button type="submit" disabled={isUploading} className={buttonVariants({ className: 'w-full' })}>
            {isUploading ? 'Uploading...' : 'Upload Syllabus'}
          </button>
        </form>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Current Files</h2>
      <div className="bg-card border rounded-xl p-6 shadow-sm text-center text-muted-foreground">
        <p>No syllabus files uploaded yet.</p>
      </div>
    </div>
  );
}
