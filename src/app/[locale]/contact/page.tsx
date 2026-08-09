import { setRequestLocale } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';

export default async function ContactPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-24 sm:px-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12 mt-12">
        <div className="bg-card border rounded-xl p-8 shadow-sm">
          <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Name</label>
              <input id="name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <input id="email" type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Your email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="message">Message</label>
              <textarea id="message" className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="How can we help?" />
            </div>
            <button type="button" className={buttonVariants({ className: 'w-full' })}>
              Send Message
            </button>
          </form>
        </div>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Our Office</h3>
            <p className="text-muted-foreground">
              Addis Ababa, Ethiopia<br />
              (Full address to be provided)
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-muted-foreground">
              info@estqb-ethiopia.org
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p className="text-muted-foreground">
              +251 900 000000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
