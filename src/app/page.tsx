import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-36 sm:pb-28">
        <p className="eyebrow">
          {site.nameEn} · {site.role}
        </p>
        <h1 className="mt-6 max-w-4xl text-4xl leading-[1.1] tracking-tight text-balance sm:text-6xl lg:text-7xl">
          {site.tagline}
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {site.intro}
        </p>
        <a
          href="#work"
          className="mt-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
        >
          작업 보기
          <span aria-hidden>↓</span>
        </a>
      </section>

      <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-6">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="eyebrow">Selected Work</h2>
          <span className="eyebrow">{projects.length} projects</span>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              large={Boolean(project.featured)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
