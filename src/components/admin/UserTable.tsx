"use client";

import { useTransition } from "react";
import { createUser, deleteUser } from "@/app/actions/users";
import { buttonVariants } from "@/components/ui/button";

type User = {
  id: string;
  fullName: string | null;
  email: string | null;
  role: string;
};

export function UserTable({ users }: { users: User[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      startTransition(async () => {
        await deleteUser(id);
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Add User Form */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        <form action={createUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            name="fullName" 
            placeholder="Full Name" 
            required 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            required 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Temporary Password" 
            required 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <select 
            name="role" 
            required 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="CANDIDATE">Student (Candidate)</option>
            <option value="INSTRUCTOR">Teacher (Instructor)</option>
            <option value="BLOG_MANAGER">Blog Manager</option>
            <option value="ADMIN">Super Admin</option>
          </select>
          <button 
            type="submit" 
            className={buttonVariants({ className: 'md:col-span-2' })}
            disabled={isPending}
          >
            Create User
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-muted/50">
                <td className="px-6 py-4">{user.fullName || 'N/A'}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-destructive hover:underline text-xs"
                    disabled={isPending}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
