"use client";

import { useActionState } from "react";
import { signUpUser } from "@/app/actions/auth";
import { buttonVariants } from "@/components/ui/button";

export function SignUpForm({ locale }: { locale: string }) {
  const [state, formAction, isPending] = useActionState(signUpUser, undefined);

  return (
    <form className="space-y-4" action={formAction}>
      <input type="hidden" name="locale" value={locale} />
      
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="name">Full Name</label>
        <input 
          id="name"
          name="name"
          type="text" 
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="John Doe"
        />
        {state?.details?.fullName && <p className="text-sm text-red-500">{state.details.fullName}</p>}
      </div>
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
        {state?.details?.email && <p className="text-sm text-red-500">{state.details.email}</p>}
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
        {state?.details?.password && <p className="text-sm text-red-500">{state.details.password}</p>}
      </div>
      
      {state?.error && <div className="text-sm text-red-500">{state.error}</div>}

      <button 
        type="submit" 
        className={buttonVariants({ className: 'w-full mt-4' })}
        disabled={isPending}
      >
        {isPending ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
