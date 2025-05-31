import Link from 'next/link';
import { Laptop } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Laptop className="h-6 w-6" />
              <span className="font-bold">Prompt-Verse</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              The comprehensive platform for prompt engineering and management.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-base">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/docs">Documentation</Link></li>
              <li><Link href="/changelog">Changelog</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-base">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/guides">Guides</Link></li>
              <li><Link href="/support">Support</Link></li>
              <li><Link href="/community">Community</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-base">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/legal">Legal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Prompt-Verse.io. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}