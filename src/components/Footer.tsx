import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Contact</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-3 block text-2xl tracking-tight underline decoration-line decoration-2 underline-offset-8 transition-colors hover:text-accent hover:decoration-accent sm:text-3xl"
          >
            {site.email}
          </a>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <ul className="flex gap-5 text-sm">
            {site.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {site.nameEn}
          </p>
        </div>
      </div>
    </footer>
  );
}
