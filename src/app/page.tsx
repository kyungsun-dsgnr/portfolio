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
        <SceneIntro key="intro" />,
        <SceneStatement
          key="statement"
          lines={[
            ["From", "Memory"],
            ["To", "Interaction"],
          ]}
          cue
        />,
        <ScenePerspective key="perspective" />,
        <ScenePrinciples key="principles" />,
        <SceneStatement
          key="closing"
          lines={[
            ["Familiar", "Memory"],
            ["Becomes", "Experience"],
          ]}
          cue
          dark
        />,
        <SceneWork key="work" />,
        <SceneCase
          key="gentle-monster"
          title="Gentle Monster Explore"
          logo={{ src: "/images/gentle-monster-logo.png", alt: "Gentle Monster" }}
          body={
            <>
              우리는 지구본을 돌리고, 대륙의 위치를 가늠하고, 원하는 국가에 가까이 다가가는
              방식에 익숙합니다.
              <br />
              <br />이 프로젝트는 그 행동 기억을 바탕으로 Gentle Monster의 글로벌 스토어를
              탐색하는 디지털 경험을 설계합니다.
            </>
          }
        />,
      ]}
    />
  );
}
