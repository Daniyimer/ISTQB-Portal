import { setRequestLocale } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default async function ContactPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-20 sm:px-8 max-w-5xl">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground pb-2">
          Contact Us
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Have questions about registrations, training providers, or exams? Reach out to our board members.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 mt-12">
        <div className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Send us a message
          </h3>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Name</label>
              <input id="name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <input id="email" type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Your email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="message">Message</label>
              <textarea id="message" className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="How can we help?" />
            </div>
            <button type="button" className={buttonVariants({ className: 'w-full font-semibold' })}>
              Send Message
            </button>
          </form>
        </div>
        
        <div className="space-y-8 flex flex-col justify-center">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Our Office</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Addis Ababa, Ethiopia<br />
                Bole Subcity, Professional Plaza, 4th Floor
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Email Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                info@estqb-ethiopia.org
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Phone Number</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                +251 900 000000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
