import { Flame } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function Footer() {
  const socialLinks = [
    { name: "Facebook", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Twitter", href: "#" },
  ];

  const pageLinks = [
    { name: "Menu", href: "/menu" },
    { name: "About Us", href: "/about" },
    { name: "Track Order", href: "/track-order" },
    { name: "Privacy Policy", href: "#" },
  ];

  return (
    <footer className="bg-secondary/50">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Flame className="h-7 w-7 text-primary" />
              <span className="font-headline text-xl font-bold tracking-wide">Francisco Edibles</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Bringing authentic flavors to your doorstep.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {pageLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">Follow Us</h3>
            <ul className="mt-4 space-y-2">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">Newsletter</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Sign up for our newsletter to get the latest news and offers.
            </p>
            {/* Newsletter form can be added here */}
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Francisco Edibles. All rights reserved.</p>
        </div>
      </div>
      <Script id="adsterra-config-footer" strategy="lazyOnload">
        {`
          atOptions = {
            'key' : '3896d1f899c8b3a6de8dd59794ad2a90',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        `}
      </Script>
      <Script
        id="adsterra-script-footer"
        strategy="lazyOnload"
        src="//www.highperformanceformat.com/3896d1f899c8b3a6de8dd59794ad2a90/invoke.js"
      />
    </footer>
  );
}
