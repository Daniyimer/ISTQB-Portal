'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function StaffReplyForm({ parentId, studentId }: { parentId: string; studentId: string }) {
  const [body, setBody] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setState('loading');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: body.trim(),
          parentId,
          recipientId: studentId,
        }),
      });

      if (res.ok) {
        setBody('');
        setState('done');
        setTimeout(() => setState('idle'), 2000);
        router.refresh();
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1">
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Type your reply..."
          rows={2}
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <button
        type="submit"
        disabled={state === 'loading' || !body.trim()}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all h-[58px] shrink-0"
      >
        {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {state === 'done' ? 'Sent!' : 'Reply'}
      </button>
    </form>
  );
}
