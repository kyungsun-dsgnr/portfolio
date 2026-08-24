import { GlobeDots } from "@/components/GlobeDots";
import { LightStage } from "@/components/LightStage";
import { SceneCase } from "@/components/SceneCase";
import { SceneCompare } from "@/components/SceneCompare";
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
                <div className="globe-scene">
                  <GlobeDots interactive={false} />
                  {/* 지구본이 안경을 쓴 것처럼 앞에 겹칩니다. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="globe-glasses" src="/images/glasses.png" alt="" />
                </div>
              }
            />
          ),
        },
        {
          id: "gentle-monster-compare",
          node: (
            <SceneCompare
              title={
                <>
                  From Store List
                  <br />
                  To Spatial Discovery
                </>
              }
              body={
                <>
                  기존의 글로벌 스토어 탐색은 국가와 도시를 목록에서 선택하는 방식에
                  머물렀습니다.
                  <br />
                  <br />이 프로젝트는 지구본을 돌려 위치를 가늠하고 가까이 다가가는 행동
                  기억을 바탕으로, 스토어 탐색을 과거 행동 기반 유도 경험으로 전환합니다.
                </>
              }
              after={{
                label: "After",
                name: "Globe-based Store Exploration",
                parts: "지구본 / 도시 핀 / 선택 스토어 카드 / 줌인 흐름",
                note: "평면적인 선택 흐름을 익숙한 공간 탐색 행동으로 바꿉니다.",
                visual: null,
              }}
              before={{
                label: "Before",
                name: "List-based Store Finder",
                parts: "국가 선택 / 지역 선택 / 매장 목록",
                note: "목록을 좁혀 가며 읽어야 위치를 알 수 있습니다.",
                visual: null,
              }}
            />
          ),
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
