"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/actions/auth";
import { buttonVariants } from "@/components/ui/button";

export function SignInForm({ locale, callbackUrl }: { locale: string; callbackUrl?: string }) {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form className="space-y-4" action={formAction}>
      <input type="hidden" name="locale" value={locale} />
      {callbackUrl && <input type="hidden" name="redirectTo" value={callbackUrl} />}
      
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <input 
          id="email"
          name="email"
          type="email" 
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="name@example.com"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">Password</label>
        <input 
          id="password"
          name="password"
          type="password" 
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      
      {errorMessage && (
        <div className="text-sm text-red-500" aria-live="polite">
          {errorMessage}
        </div>
      )}

      <button 
        type="submit" 
        className={buttonVariants({ className: 'w-full mt-4' })}
        disabled={isPending}
      >
        {isPending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
