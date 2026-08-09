"use client";

import { buttonVariants } from '@/components/ui/button';

export default function AdminBlogPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog CMS</h1>
        <button type="button" className={buttonVariants()}>
          Create New Post
        </button>
      </div>
      
      <div className="bg-card border rounded-xl p-8 shadow-sm">
        <div className="text-center text-muted-foreground py-12">
          <p className="mb-4">Rich Text Editor and Translation Workflow Placeholder</p>
          <p className="text-sm">In a full implementation, this will use Tiptap for editing and store translations in the `BlogPostTranslation` table, with Meilisearch indexing for search.</p>
        </div>
      </div>
    </div>
  );
}
