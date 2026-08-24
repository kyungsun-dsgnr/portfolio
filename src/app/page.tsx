import { GlobeDots } from "@/components/GlobeDots";
import { LightStage } from "@/components/LightStage";
import { SceneCase } from "@/components/SceneCase";
import { SceneAfter } from "@/components/SceneAfter";
import { SceneIntro } from "@/components/SceneIntro";
import { SceneProblem } from "@/components/SceneProblem";
import { ScenePerspective } from "@/components/ScenePerspective";
import { ScenePrinciples } from "@/components/ScenePrinciples";
import { SceneStatement } from "@/components/SceneStatement";
import { SceneWhy } from "@/components/SceneWhy";
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
                <div className="globe-scene">
                  <GlobeDots interactive={false} labels />
                  {/* 지구본이 안경을 쓴 것처럼 앞에 겹칩니다. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="globe-glasses" src="/images/glasses.png" alt="" />
                </div>
              }
            />
          ),
        },
        { id: "gentle-monster-problem", node: <SceneProblem /> },
        { id: "gentle-monster-why", node: <SceneWhy /> },
        { id: "gentle-monster-after", node: <SceneAfter /> },
        /* 다음 화면을 만들 때 여기서 소스를 가져다 씁니다. 그때까지는 내려 둡니다.
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
