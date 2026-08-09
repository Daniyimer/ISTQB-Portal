"use client";

import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';

export default function IssueCertificatePage() {
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    // In a full implementation, we'd:
    // 1. Get the pre-signed URL from /api/upload/url
    // 2. Upload the file to S3/MinIO
    // 3. Create the Certificate record in the DB via a server action
    setTimeout(() => {
      setIsUploading(false);
      alert('Certificate issued successfully! (Placeholder action)');
    }, 1500);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Issue Certificate</h1>
      
      <div className="bg-card border rounded-xl p-8 shadow-sm max-w-2xl">
        <form className="space-y-6" onSubmit={handleUpload}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="candidate">Select Candidate</label>
            <select id="candidate" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">-- Choose Candidate --</option>
              {/* These would be populated from the DB */}
              <option value="user1">John Doe (john@example.com)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="certification">Select Certification</label>
            <select id="certification" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">-- Choose Certification --</option>
              {/* These would be populated from the DB */}
              <option value="cert1">CTFL - Foundation Level</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="grade">Grade / Score</label>
            <input id="grade" type="text" placeholder="e.g. 85%" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="file">Certificate File (PDF or Image)</label>
            <input id="file" type="file" accept=".pdf,image/*" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring file:border-0 file:bg-transparent file:text-sm file:font-medium" />
            <p className="text-xs text-muted-foreground mt-1">This file will be available publicly via the verification page.</p>
          </div>
          
          <button type="submit" disabled={isUploading} className={buttonVariants({ className: 'w-full' })}>
            {isUploading ? 'Uploading...' : 'Upload & Issue Certificate'}
          </button>
        </form>
      </div>
    </div>
  );
}
