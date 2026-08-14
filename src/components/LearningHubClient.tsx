'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, CheckCircle2, MessageSquare, Send, Loader2, BookOpen } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

interface LearningHubClientProps {
  enrollmentId: string;
  initialProgress: number;
  certificationId: string;
}

export function LearningHubClient({ enrollmentId, initialProgress, certificationId }: LearningHubClientProps) {
  const [progress, setProgress] = useState(initialProgress);
  const [isUpdating, setIsUpdating] = useState(false);
  const [msgBody, setMsgBody] = useState('');
  const [msgState, setMsgState] = useState<'idle' | 'loading' | 'done'>('idle');
  const router = useRouter();

  async function updateProgress(newProgress: number) {
    setIsUpdating(true);
    setProgress(newProgress);
    
    try {
      await fetch(`/api/enrollments/${enrollmentId}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progressPercent: newProgress }),
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to update progress', error);
      setProgress(initialProgress); // Revert on failure
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!msgBody.trim()) return;
    setMsgState('loading');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject: 'Question from Learning Hub', 
          body: msgBody, 
          certificationId 
        }),
      });

      if (res.ok) {
        setMsgBody('');
        setMsgState('done');
        setTimeout(() => setMsgState('idle'), 3000);
      } else {
        setMsgState('idle');
      }
    } catch {
      setMsgState('idle');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Progress & Materials */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Progress Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" /> Your Progress
            </h2>
            <span className="text-2xl font-extrabold text-primary">{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => updateProgress(Math.min(100, progress + 10))}
              disabled={isUpdating || progress >= 100}
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              +10% Progress
            </button>
            <button
              onClick={() => updateProgress(100)}
              disabled={isUpdating || progress >= 100}
              className={buttonVariants({ variant: 'default', size: 'sm' })}
            >
              Mark as Completed
            </button>
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2 self-center" />}
          </div>
        </div>
      </div>

      {/* Right Column: Q&A */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-purple-500" /> Ask Instructor
          </h2>
          <form onSubmit={handleSendMessage} className="space-y-3">
            <textarea
              value={msgBody}
              onChange={e => setMsgBody(e.target.value)}
              placeholder="Need help? Ask a quick question here..."
              rows={4}
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
            <button
              type="submit"
              disabled={msgState === 'loading'}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {msgState === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 
               msgState === 'done' ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {msgState === 'done' ? 'Sent!' : 'Send Question'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
