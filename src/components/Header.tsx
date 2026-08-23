import Link from "next/link";
import { site } from "@/data/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-medium tracking-tight hover:text-accent">
          {site.name}
          <span className="text-muted"> — {site.role}</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/#work" className="text-muted transition-colors hover:text-ink">
            Work
          </Link>
          <a href={`mailto:${site.email}`} className="text-muted transition-colors hover:text-ink">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
