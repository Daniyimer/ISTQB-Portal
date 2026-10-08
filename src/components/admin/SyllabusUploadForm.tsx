'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';

type CertificationOption = {
  id: string;
  title: string;
};

export function SyllabusUploadForm({ certifications }: { certifications: CertificationOption[] }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const certificationId = formData.get('certificationId');
    const file = formData.get('file') as File;

    if (!certificationId) {
      setError('Please select a certification.');
      setIsUploading(false);
      return;
    }
    
    if (!file || file.size === 0) {
      setError('Please select a valid PDF file.');
      setIsUploading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/syllabus', {
        method: 'POST',
        body: formData, // fetch automatically sets the correct Content-Type for FormData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload syllabus');
      }

      alert('Syllabus uploaded successfully!');
      (e.target as HTMLFormElement).reset();
      router.refresh(); // Refresh the page to show the new file
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleUpload}>
      {error && <p className="text-sm font-semibold text-red-500 bg-red-500/10 p-3 rounded-md">{error}</p>}
      
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="certification">For Certification</label>
        <select 
          id="certification" 
          name="certificationId"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          required
        >
          <option value="">-- Choose Certification --</option>
          {certifications.map(cert => (
            <option key={cert.id} value={cert.id}>{cert.title}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="file">Syllabus PDF File</label>
        <input 
          id="file" 
          name="file"
          type="file" 
          accept=".pdf" 
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring file:border-0 file:bg-transparent file:text-sm file:font-medium" 
        />
      </div>
      
      <button type="submit" disabled={isUploading} className={buttonVariants({ className: 'w-full' })}>
        {isUploading ? 'Uploading...' : 'Upload Syllabus'}
      </button>
    </form>
  );
}
