import Link from "next/link";
import type { Project } from "@/data/projects";
import { CoverArt } from "@/components/CoverArt";

export function ProjectCard({
  project,
  index,
  large = false,
}: {
  project: Project;
  index: number;
  large?: boolean;
}) {
  return (
    <article className={large ? "sm:col-span-2" : ""}>
      <Link href={`/projects/${project.slug}`} className="group block">
        <div
          className={`relative overflow-hidden rounded-lg bg-line ${
            large ? "aspect-[16/9]" : "aspect-[4/3]"
          }`}
        >
          <CoverArt
            project={project}
            sizes={large ? "(min-width: 640px) 72rem, 100vw" : "(min-width: 640px) 36rem, 100vw"}
            priority={index === 0}
          />
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h3 className="text-xl tracking-tight group-hover:text-accent sm:text-2xl">
            {project.title}
          </h3>
          <span className="eyebrow shrink-0">{project.year}</span>
        </div>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-3 py-1 text-xs text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </article>
  );
}
