import { GlobeDots } from "@/components/GlobeDots";
import { LightStage } from "@/components/LightStage";
import { SceneCase } from "@/components/07-SceneCase";
import { SceneAfter } from "@/components/11-SceneAfter";
import { SceneExplore } from "@/components/10-SceneExplore";
import { SceneIntro } from "@/components/01-SceneIntro";
import { SceneProblem } from "@/components/08-SceneProblem";
import { ScenePerspective } from "@/components/03-ScenePerspective";
import { ScenePrinciples } from "@/components/04-ScenePrinciples";
import { SceneStatement } from "@/components/02-SceneStatement";
import { SceneWhy } from "@/components/09-SceneWhy";
import { SceneWork } from "@/components/06-SceneWork";

export default function Home() {
  return (
    <LightStage
      sections={[
        { id: "intro", label: "Intro", node: <SceneIntro /> },
        {
          id: "statement",
          label: "Memory",
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
        { id: "perspective", label: "Perspective", node: <ScenePerspective /> },
        { id: "principles", label: "Principles", node: <ScenePrinciples /> },
        {
          id: "closing",
          label: "Experience",
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
        { id: "work", label: "Work", node: <SceneWork /> },
        {
          id: "gentle-monster",
          label: "GM Explore",
          node: (
            <SceneCase
              title="Gentle Monster Explore"
              logo={{
                src: "/images/gentle-monster-logo.png",
                alt: "Gentle Monster",
              }}
              body={
                <>
                  우리는 지구본을 돌리고, 대륙의 위치를 가늠하고, 원하는 국가에
                  가까이 다가가는 방식에 익숙합니다.
                  <br />
                  <br />이 프로젝트는 그 행동 기억을 바탕으로 Gentle Monster의
                  글로벌 스토어를 탐색하는 디지털 경험을 설계합니다.
                </>
              }
              visual={
                <div className="globe-scene">
                  <GlobeDots interactive={false} labels />
                  {/* 지구본이 안경을 쓴 것처럼 앞에 겹칩니다. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="globe-glasses"
                    src="/images/glasses.png"
                    alt=""
                  />
                </div>
              }
            />
          ),
        },
        {
          id: "gentle-monster-problem",
          label: "Problem",
          node: <SceneProblem />,
        },
        { id: "gentle-monster-why", label: "Why", node: <SceneWhy /> },
        {
          id: "gentle-monster-explore",
          label: "Globe",
          node: <SceneExplore />,
        },
        { id: "gentle-monster-after", label: "Proposal", node: <SceneAfter /> },

        /* 두 번째 프로젝트 표지. 앞 케이스와 같은 틀을 씁니다.
           제목·로고·본문과 우측에 들어갈 것은 받는 대로 채웁니다.
           visual 을 비워 두면 그 자리는 회색 영역으로 섭니다. */
        {
          id: "tamburins",
          label: "Tamburins",
          node: <SceneCase title="Tamburins" body={<>{"내용 준비 중"}</>} />,
        },
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
