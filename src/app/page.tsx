import Image from "next/image";

import { LightStage } from "@/components/LightStage";
import { SceneCase } from "@/components/SceneCase";
import { SceneIntro } from "@/components/SceneIntro";
import { ScenePerspective } from "@/components/ScenePerspective";
import { ScenePrinciples } from "@/components/ScenePrinciples";
import { SceneStatement } from "@/components/SceneStatement";
import { SceneWork } from "@/components/SceneWork";

export default function Home() {
  return (
    <LightStage
      sections={[
        { id: "intro", node: <SceneIntro /> },
        {
          id: "statement",
          node: (
            <SceneStatement
              lines={[
                ["From", "Memory"],
                ["To", "Interaction"],
              ]}
              cue
            />
          ),
        },
        { id: "perspective", node: <ScenePerspective /> },
        { id: "principles", node: <ScenePrinciples /> },
        {
          id: "closing",
          node: (
            <SceneStatement
              lines={[
                ["Familiar", "Memory"],
                ["Becomes", "Experience"],
              ]}
              cue
              dark
            />
          ),
        },
        { id: "work", node: <SceneWork /> },
        {
          id: "gentle-monster",
          node: (
            <SceneCase
              title="Gentle Monster Explore"
              logo={{ src: "/images/gentle-monster-logo.png", alt: "Gentle Monster" }}
              body={
                <>
                  우리는 지구본을 돌리고, 대륙의 위치를 가늠하고, 원하는 국가에 가까이
                  다가가는 방식에 익숙합니다.
                  <br />
                  <br />이 프로젝트는 그 행동 기억을 바탕으로 Gentle Monster의 글로벌
                  스토어를 탐색하는 디지털 경험을 설계합니다.
                </>
              }
              visual={
                <Image
                  src="/images/gentle-monster-intro.png"
                  alt="점으로 그린 지구본 위에 놓인 젠틀몬스터 안경"
                  fill
                  sizes="(min-width: 1024px) 48vw, 90vw"
                  className="object-contain"
                  priority
                />
              }
            />
          ),
        },
        /* 다음 화면을 만들 때 여기서 소스를 가져다 씁니다. 그때까지는 내려 둡니다.
           살릴 때 GlobeDots import 를 다시 넣어야 합니다.
        {
          id: "gentle-monster-2",
          node: (
            <SceneCase
              title="Gentle Monster Explore"
              logo={{ src: "/images/gentle-monster-logo.png", alt: "Gentle Monster" }}
              body={
                <>
                  우리는 지구본을 돌리고, 대륙의 위치를 가늠하고, 원하는 국가에 가까이
                  다가가는 방식에 익숙합니다.
                  <br />
                  <br />이 프로젝트는 그 행동 기억을 바탕으로 Gentle Monster의 글로벌
                  스토어를 탐색하는 디지털 경험을 설계합니다.
                </>
              }
              visual={<GlobeDots />}
            />
          ),
        }
        */
      ]}
    />
  );
}
