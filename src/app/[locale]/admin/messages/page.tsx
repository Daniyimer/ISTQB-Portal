import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { MessageSquare, Inbox } from 'lucide-react';
import { StaffReplyForm } from '@/components/StaffReplyForm';

export default async function AdminMessagesPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  const messages = await prisma.message.findMany({
    where: { recipientId: session?.user?.id, parentId: null },
    include: {
      sender: { select: { id: true, fullName: true, email: true } },
      certification: { select: { id: true, title: true } },
      replies: {
        include: {
          sender: { select: { id: true, fullName: true, email: true, role: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const unread = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Inbox className="h-8 w-8 text-primary" /> Staff Inbox
        </h1>
        <p className="text-muted-foreground mt-1">
          {messages.length} message{messages.length !== 1 ? 's' : ''}{unread > 0 && ` · ${unread} unread`}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-16 text-center text-muted-foreground shadow-sm">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="font-semibold">No messages yet.</p>
          <p className="text-sm mt-1">Student questions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`bg-card border rounded-2xl shadow-sm overflow-hidden transition-all ${
              !msg.isRead ? 'border-primary/40' : 'border-border'
            }`}>
              {/* Message Header */}
              <div className={`px-6 py-4 ${!msg.isRead ? 'bg-primary/5' : 'bg-muted/20'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {msg.sender.fullName?.charAt(0) || msg.sender.email?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {msg.sender.fullName || msg.sender.email}
                        {!msg.isRead && (
                          <span className="ml-2 text-[10px] font-bold uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">New</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{msg.sender.email}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</p>
                    {msg.certification && (
                      <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full mt-1 block">
                        {msg.certification.title}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold mt-3">{msg.subject}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{msg.body}</p>
              </div>

              {/* Replies */}
              {msg.replies.length > 0 && (
                <div className="px-6 py-4 border-t border-border space-y-3">
                  {msg.replies.map(reply => (
                    <div key={reply.id} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        reply.sender.role === 'CANDIDATE'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {reply.sender.fullName?.charAt(0) || '?'}
                      </div>
                      <div className={`flex-1 rounded-xl px-4 py-3 text-sm ${
                        reply.sender.role === 'CANDIDATE'
                          ? 'bg-muted/40'
                          : 'bg-primary/5 border border-primary/10'
                      }`}>
                        <p className="font-semibold text-xs mb-1">
                          {reply.sender.fullName || reply.sender.email}
                          {reply.sender.role !== 'CANDIDATE' && (
                            <span className="ml-1 text-primary text-[10px]">· Staff</span>
                          )}
                        </p>
                        <p className="leading-relaxed">{reply.body}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{new Date(reply.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              <div className="px-6 py-4 border-t border-border bg-muted/10">
                <StaffReplyForm parentId={msg.id} studentId={msg.sender.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
