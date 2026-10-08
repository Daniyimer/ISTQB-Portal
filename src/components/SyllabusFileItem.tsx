'use client';

import { useState } from 'react';
import { BookOpen, ExternalLink, Eye, EyeOff, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type SyllabusFile = {
  id: string;
  fileName: string;
  fileSizeKb: number;
  fileUrl: string;
};

export function SyllabusFileItem({ 
  file, 
  enrollmentId,
  isCompleted 
}: { 
  file: SyllabusFile;
  enrollmentId?: string;
  isCompleted?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(!!isCompleted);
  const router = useRouter();

  const toggleFinished = async () => {
    if (!enrollmentId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/enrollments/${enrollmentId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syllabusFileId: file.id, completed: !completed })
      });
      if (res.ok) {
        setCompleted(!completed);
        router.refresh(); // Refresh to update parent progress bars
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`border-b border-border last:border-0 transition-colors ${completed ? 'bg-muted/5' : ''}`}>
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-muted/10 transition-colors gap-4">
        
        <div className="flex items-center gap-4 flex-1">
          {enrollmentId && (
            <button 
              onClick={toggleFinished}
              disabled={isLoading}
              className={`shrink-0 transition-colors ${completed ? 'text-green-500' : 'text-muted-foreground hover:text-primary'}`}
              title={completed ? "Mark as unfinished" : "Mark as finished"}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : completed ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <Circle className="h-6 w-6" />
              )}
            </button>
          )}

          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${completed ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'}`}>
            <BookOpen className="h-5 w-5" />
          </div>
          <div className={`${completed ? 'opacity-70 line-through decoration-muted-foreground/30' : ''}`}>
            <p className="font-semibold text-sm line-clamp-1">{file.fileName}</p>
            <p className="text-xs text-muted-foreground">{(file.fileSizeKb / 1024).toFixed(1)} MB · PDF</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:ml-auto ml-14">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors"
          >
            {isOpen ? (
              <><EyeOff className="h-4 w-4" /> Close</>
            ) : (
              <><Eye className="h-4 w-4" /> View in Page</>
            )}
          </button>
          
          <a 
            href={file.fileUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
            title="Open in new tab / Download"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4 bg-muted/20 border-t border-border animate-in slide-in-from-top-2 duration-300">
          <iframe 
            src={`${file.fileUrl}#view=FitH`} 
            className="w-full h-[600px] rounded-xl border border-border shadow-inner"
            title={file.fileName}
          />
        </div>
      )}
    </div>
  );
}
