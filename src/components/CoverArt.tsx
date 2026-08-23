import Image from "next/image";
import type { Project } from "@/data/projects";

type Props = {
  project: Project;
  sizes: string;
  priority?: boolean;
};

/**
 * 대표 이미지가 있으면 이미지를, 없으면 프로젝트 accent 색으로 만든
 * 그라디언트 플레이스홀더를 채웁니다. 부모에 aspect 비율과 relative를 주세요.
 */
export function CoverArt({ project, sizes, priority = false }: Props) {
  if (!project.cover) {
    return (
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(135deg, ${project.accent[0]}, ${project.accent[1]})`,
        }}
      />
    );
  }

  return (
    <Image
      src={project.cover}
      alt={`${project.title} 대표 이미지`}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  );
}
