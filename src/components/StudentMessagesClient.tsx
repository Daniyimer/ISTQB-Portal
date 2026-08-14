'use client';

import { useState } from 'react';
import { Send, Loader2, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Certification {
  id: string;
  title: string;
}

interface Message {
  id: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  certification: { title: string } | null;
  replies: {
    id: string;
    body: string;
    createdAt: string;
    sender: { fullName: string | null; email: string | null; role: string };
  }[];
}

export function StudentMessagesClient({
  certifications,
  messages: initialMessages,
  userRole,
}: {
  certifications: Certification[];
  messages: Message[];
  userRole: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [certificationId, setCertificationId] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [replyBody, setReplyBody] = useState<Record<string, string>>({});
  const [replyState, setReplyState] = useState<Record<string, 'idle' | 'loading' | 'done'>>({});
  const router = useRouter();

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !subject.trim()) return;
    setState('loading');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, certificationId: certificationId || null }),
      });

      if (res.ok) {
        setSubject('');
        setBody('');
        setCertificationId('');
        setState('done');
        setTimeout(() => setState('idle'), 3000);
        router.refresh();
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  async function handleReply(e: React.FormEvent, parentId: string) {
    e.preventDefault();
    const rb = replyBody[parentId];
    if (!rb?.trim()) return;
    setReplyState(s => ({ ...s, [parentId]: 'loading' }));

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: rb, parentId }),
      });

      if (res.ok) {
        setReplyBody(s => ({ ...s, [parentId]: '' }));
        setReplyState(s => ({ ...s, [parentId]: 'done' }));
        setTimeout(() => setReplyState(s => ({ ...s, [parentId]: 'idle' })), 2000);
        router.refresh();
      }
    } catch {}
  }

  return (
    <div className="space-y-8">
      {/* Compose */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary/5">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Ask Your Instructor
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your instructor will receive your question and reply shortly.
          </p>
        </div>
        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="subject">Subject</label>
            <input
              id="subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Question about CTFL syllabus unit 2"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="cert">Certification (optional)</label>
            <select
              id="cert"
              value={certificationId}
              onChange={e => setCertificationId(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">— General question —</option>
              {certifications.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="body">Your Question</label>
            <textarea
              id="body"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Describe your question in detail..."
              rows={4}
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
          <button
            type="submit"
            disabled={state === 'loading'}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> :
             state === 'done' ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {state === 'done' ? 'Message Sent!' : state === 'loading' ? 'Sending...' : 'Send Question'}
          </button>
        </form>
      </div>

      {/* Message Threads */}
      <div>
        <h2 className="text-xl font-bold mb-4">My Conversations</h2>
        {messages.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-sm">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No conversations yet.</p>
            <p className="text-sm mt-1">Ask your instructor a question above to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-muted/20">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold">{msg.subject}</h3>
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {msg.certification && (
                    <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                      {msg.certification.title}
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{msg.body}</p>
                </div>

                {/* Replies */}
                {msg.replies.length > 0 && (
                  <div className="px-6 py-4 border-t border-border space-y-3">
                    {msg.replies.map(reply => (
                      <div key={reply.id} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          reply.sender.role === 'CANDIDATE' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                        }`}>
                          {reply.sender.fullName?.charAt(0) || '?'}
                        </div>
                        <div className={`flex-1 rounded-xl px-4 py-3 text-sm ${
                          reply.sender.role === 'CANDIDATE' ? 'bg-muted/40' : 'bg-primary/5 border border-primary/10'
                        }`}>
                          <p className="font-semibold text-xs mb-1 text-primary">
                            {reply.sender.role !== 'CANDIDATE' ? '👨‍🏫 Instructor' : 'You'}
                          </p>
                          <p className="leading-relaxed">{reply.body}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {new Date(reply.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Follow-up reply */}
                <div className="px-6 py-3 border-t border-border bg-muted/10">
                  <form onSubmit={e => handleReply(e, msg.id)} className="flex gap-2">
                    <input
                      value={replyBody[msg.id] || ''}
                      onChange={e => setReplyBody(s => ({ ...s, [msg.id]: e.target.value }))}
                      placeholder="Follow up..."
                      className="flex-1 h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <button
                      type="submit"
                      disabled={replyState[msg.id] === 'loading'}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all"
                    >
                      {replyState[msg.id] === 'loading' ? '...' : replyState[msg.id] === 'done' ? '✓' : 'Reply'}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
