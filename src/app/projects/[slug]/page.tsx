import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { CoverArt } from "@/components/CoverArt";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.cover ? [project.cover] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <header className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-24">
        <Link href="/#work" className="eyebrow transition-colors hover:text-ink">
          ← Work
        </Link>
        <h1 className="mt-8 max-w-3xl text-4xl leading-[1.1] tracking-tight text-balance sm:text-6xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{project.summary}</p>
      </header>

      <div className="mx-auto max-w-6xl px-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-line">
          <CoverArt project={project} sizes="(min-width: 640px) 72rem, 100vw" priority />
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-12 px-6 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <dl className="space-y-6">
            {project.meta.map((item) => (
              <div key={item.label}>
                <dt className="eyebrow">{item.label}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed">{item.value}</dd>
              </div>
            ))}
          </dl>

          {project.link && (
            <a
              href={project.link.href}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 text-sm text-accent underline decoration-1 underline-offset-4"
            >
              {project.link.label}
              <span aria-hidden>↗</span>
            </a>
          )}
        </aside>

        <div className="space-y-12">
          {project.blocks.map((block, blockIndex) => {
            if (block.type === "text") {
              return (
                <p
                  key={blockIndex}
                  className="max-w-prose text-base leading-[1.85] sm:text-lg"
                >
                  {block.body}
                </p>
              );
            }

            if (block.type === "quote") {
              return (
                <blockquote
                  key={blockIndex}
                  className="max-w-prose border-l-2 border-accent pl-6"
                >
                  <p className="text-xl leading-relaxed tracking-tight sm:text-2xl">
                    {block.body}
                  </p>
                  {block.source && (
                    <cite className="mt-3 block text-sm not-italic text-muted">
                      {block.source}
                    </cite>
                  )}
                </blockquote>
              );
            }

            return (
              <figure key={blockIndex}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-line">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(min-width: 1024px) 48rem, 100vw"
                    className="object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-3 text-sm text-muted">{block.caption}</figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>

      <nav className="mx-auto mt-28 max-w-6xl px-6">
        <Link
          href={`/projects/${next.slug}`}
          className="group flex items-baseline justify-between gap-6 border-t border-line py-8"
        >
          <span>
            <span className="eyebrow">Next project</span>
            <span className="mt-2 block text-2xl tracking-tight group-hover:text-accent sm:text-3xl">
              {next.title}
            </span>
          </span>
          <span aria-hidden className="text-muted transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </nav>
    </article>
  );
}
