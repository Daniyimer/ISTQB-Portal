'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

export function DeleteSyllabusButton({ id, fileName }: { id: string; fileName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${fileName}"? This will immediately remove it from student learning pages.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/syllabus/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete file');
      }

      router.refresh(); // Refresh the list
    } catch (error) {
      console.error(error);
      alert('An error occurred while trying to delete the file.');
      setIsDeleting(false); // Only reset if failed. If success, page refreshes anyway
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
      title="Delete file"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
