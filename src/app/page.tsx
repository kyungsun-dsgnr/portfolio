// 내려 둔 표지에서 씁니다: import { GlobeDots } from "@/components/GlobeDots";
import { asset } from "@/asset";
import { GlobePaper } from "@/components/GlobePaper";
import { LightStage } from "@/components/LightStage";
import { SceneCase } from "@/components/07-SceneCase";
import { SceneFlow } from "@/components/14-SceneFlow";
import { SceneShift } from "@/components/16-SceneShift";
import { SceneComposeFull } from "@/components/21-SceneComposeFull";
// 내려 둔 A 안에서 씁니다: import { SceneCompose } from "@/components/18-SceneCompose";
// 내려 둔 B 안에서 씁니다: import { SceneComposeB } from "@/components/19-SceneComposeB";
import { SceneScreensTall } from "@/components/17-SceneScreensTall";
// 내려 둔 장에서 씁니다: import { SceneGiftBox } from "@/components/13-SceneGiftBox";
import { SceneTamburinsCover } from "@/components/12-SceneTamburinsCover";
import { SceneAfter } from "@/components/11-SceneAfter";
import { SceneExplore } from "@/components/10-SceneExplore";
// 접어 둔 장에서 씁니다: import { SceneIntro } from "@/components/01-SceneIntro";
import { SceneSwitch } from "@/components/02-SceneSwitch";
import { SceneNudakeCover } from "@/components/18-SceneNudakeCover";
// 내려 둔 앞 판에서 씁니다: import { SceneNudakeContext } from "@/components/22-SceneNudakeContext";
import { SceneNudakeContext2 } from "@/components/23-SceneNudakeContext2";
import { SceneNudakeSigns } from "@/components/24-SceneNudakeSigns";
import {
  NUDAKE_COMPOSE,
  NUDAKE_TURN,
  SceneNudakePlan,
} from "@/components/30-SceneNudakePlan";
import { SceneNudakeGap } from "@/components/32-SceneNudakeGap";
// import { SceneNudakeGap2 } from "@/components/33-SceneNudakeGap2";
import { SceneNudakeGap3 } from "@/components/34-SceneNudakeGap3";
import { SceneNudakeGap4 } from "@/components/35-SceneNudakeGap4";
// import { SceneNudakeContext3 } from "@/components/31-SceneNudakeContext3";
// import { SceneNudakeCurrent } from "@/components/25-SceneNudakeCurrent";
// import { SceneNudakeProblem } from "@/components/26-SceneNudakeProblem";
// import { SceneNudakeDirection } from "@/components/27-SceneNudakeDirection";
// import { SceneNudakeExperience } from "@/components/28-SceneNudakeExperience";
// import { SceneNudakeImpact } from "@/components/29-SceneNudakeImpact";
// 밑그림 장이 다 채워져 내려 둡니다: import { SceneDraft } from "@/components/SceneDraft";
import { SceneProblem } from "@/components/08-SceneProblem";
import { ScenePrinciples } from "@/components/04-ScenePrinciples";
import { SceneStatement } from "@/components/02-SceneStatement";
import { SceneWhy } from "@/components/09-SceneWhy";
import { SceneWork } from "@/components/06-SceneWork";

export default function Home() {
  return (
    <LightStage
      sections={[
        /* 스위치 장과 제목이 같아 접어 둡니다. 되살릴 때 이 줄만 풀면 됩니다.
        { id: "intro", label: "Intro", node: <SceneIntro /> }, */
        { id: "switch", label: "intro-1", node: <SceneSwitch /> },
        {
          id: "statement",
          label: "intro-2",
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
        /* 뒷장과 제목이 같아 접어 둡니다. 되살릴 때 이 줄만 풀면 됩니다.
        { id: "perspective", label: "Perspective", node: <ScenePerspective /> }, */
        { id: "principles", label: "intro-3", node: <ScenePrinciples /> },
        {
          id: "closing",
          label: "intro-4",
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
        { id: "work", label: "intro-5", node: <SceneWork /> },
        // 점으로 찍은 지구본 표지. 지금은 내려 두었습니다. 주석을 풀면 다시 섭니다.
        // {
        // id: "gentle-monster",
        // label: "GM Explore",
        // node: (
        // <SceneCase
        // title="Gentle Monster Explore"
        // logo={{
        // src: "/images/gentle-monster-logo.png",
        // alt: "Gentle Monster",
        // }}
        // body={
        // <>
        // 우리는 지구본을 돌리고, 대륙의 위치를 가늠하고, 원하는 국가에
        // 가까이 다가가는 방식에 익숙합니다.
        // <br />
        // <br />이 프로젝트는 그 행동 기억을 바탕으로 Gentle Monster의
        // 글로벌 스토어를 탐색하는 디지털 경험을 설계합니다.
        // </>
        // }
        // visual={
        // <div className="globe-scene">
        // <GlobeDots interactive={false} labels />
        // {/* 지구본이 안경을 쓴 것처럼 앞에 겹칩니다. */}
        // {/* eslint-disable-next-line @next/next/no-img-element */}
        // <img
        // className="globe-glasses"
        // src="/images/glasses.png"
        // alt=""
        // />
        // </div>
        // }
        // />
        // ),
        // },

        /* 표지 한 벌 더. 점으로 찍던 지구본 대신 종이에 인쇄한 듯한 지구본을 둡니다. */
        {
          id: "gentle-monster-paper",
          label: "gentlemonster-1",
          node: (
            <SceneCase
              title="Gentle Monster Explore"
              subtitle="매장 찾기를, 세계를 둘러보는 경험으로 넓히다"
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
                  <GlobePaper />
                  {/* 지구본이 안경을 쓴 것처럼 앞에 겹칩니다. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="globe-glasses"
                    src={asset("/images/glasses.png")}
                    alt=""
                  />
                </div>
              }
            />
          ),
        },
        {
          id: "gentle-monster-problem",
          index: "01 — Gentle Monster",
          label: "gentlemonster-2",
          node: <SceneProblem />,
        },
        {
          id: "gentle-monster-why",
          index: "02 — Gentle Monster",
          label: "gentlemonster-3",
          node: <SceneWhy />,
        },
        {
          id: "gentle-monster-explore",
          index: "03 — Gentle Monster",
          label: "gentlemonster-4",
          node: <SceneExplore />,
        },
        {
          id: "gentle-monster-after",
          index: "04 — Gentle Monster",
          label: "gentlemonster-5",
          node: <SceneAfter />,
        },

        /* QR 을 앞장 안으로 옮겼습니다. 되살릴 때 이 묶음만 풀면 됩니다.
        {
          id: "gentle-monster-try",
          index: "05 — Gentle Monster",
          label: "Try It",
          node: <SceneAfterQr />,
        }, */

        {
          id: "tamburins",
          label: "tamburins-1",
          node: <SceneTamburinsCover scale={0.8} />,
        },
        /* 선(SVG)으로 그린 상자 표지. 지금은 내려 두었습니다.
           다시 쓰려면 아래 주석을 풀면 되고, 컴포넌트는 그대로 남아 있습니다.
        {
          id: "tamburins-box",
          label: "Gift Box",
          node: <SceneGiftBox />,
        },
        */

        {
          id: "tamburins-flow",
          index: "01 — Tamburins",
          label: "tamburins-2",
          node: <SceneFlow />,
        },
        {
          id: "tamburins-screens",
          index: "02 — Tamburins",
          label: "tamburins-3",
          node: <SceneScreensTall />,
        },

        {
          id: "tamburins-shift",
          index: "03 — Tamburins",
          label: "tamburins-4",
          node: <SceneShift />,
        },

        {
          id: "tamburins-one",
          label: "tamburins-5",
          node: <SceneComposeFull />,
        },
        /* A 안. 지우지 않고 내려 둡니다. 다시 보려면 주석만 풀면 됩니다.
        {
          id: "tamburins-compose-screen",
          index: "05 — Tamburins",
          label: "Compose Gift",
          node: <SceneCompose />,
        },
        */

        {
          id: "nudake",
          label: "nudake-1",
          node: <SceneNudakeCover />,
        },
        /* 앞 판. 지도 판으로 갈음해 내려 둡니다. 되살릴 때 이 묶음만 풀면 됩니다.
        {
          id: "nudake-context",
          index: "01 — Nudake",
          label: "nudake-2",
          node: <SceneNudakeContext />,
        },
        */
        {
          id: "nudake-context-2",
          index: "01 — Nudake",
          label: "nudake-2",
          node: <SceneNudakeContext2 />,
        },
        /* 좌우를 뒤집어 본 판. 다시 잡을 때 이 묶음만 풀면 됩니다.
           컴포넌트 파일(31)은 지우지 않고 그대로 두었습니다.
        {
          id: "nudake-context-3",
          index: "02 — Nudake",
          label: "nudake-3",
          node: <SceneNudakeContext3 />,
        },
        */
        {
          id: "nudake-signs",
          index: "02 — Nudake",
          label: "nudake-3",
          node: <SceneNudakeSigns />,
        },
        /* 아래 셋은 아직 무엇을 넣을지만 적어 둔 자리입니다. */
        {
          id: "nudake-gap",
          index: "03 — Nudake",
          label: "nudake-4",
          node: <SceneNudakeGap />,
        },
        /* 20 간격으로 아래에 붙였던 판. 다시 잡을 때 이 묶음만 풀면 됩니다.
           컴포넌트 파일(33)은 지우지 않고 그대로 두었습니다.
        {
          id: "nudake-gap-2",
          index: "04 — Nudake",
          label: "nudake-5",
          node: <SceneNudakeGap2 />,
        },
        */
        {
          id: "nudake-gap-3",
          index: "04 — Nudake",
          label: "nudake-5",
          node: <SceneNudakeGap3 />,
        },
        {
          id: "nudake-gap-4",
          index: "05 — Nudake",
          label: "nudake-6",
          node: <SceneNudakeGap4 />,
        },
        {
          id: "nudake-turn",
          index: "06 — Nudake",
          label: "nudake-7",
          node: <SceneNudakePlan plan={NUDAKE_TURN} />,
        },
        {
          id: "nudake-compose",
          index: "07 — Nudake",
          label: "nudake-8",
          node: <SceneNudakePlan plan={NUDAKE_COMPOSE} />,
        },
        /* Already There 뒤의 다섯 장을 내려 둡니다. 다시 잡을 때 이 묶음만 풀면 됩니다.
           컴포넌트 파일(25~29)은 지우지 않고 그대로 두었습니다.
        {
          id: "nudake-current",
          index: "03 — Nudake",
          label: "nudake-4",
          node: <SceneNudakeCurrent />,
        },
        {
          id: "nudake-problem",
          index: "04 — Nudake",
          label: "nudake-5",
          node: <SceneNudakeProblem />,
        },
        {
          id: "nudake-direction",
          index: "05 — Nudake",
          label: "nudake-6",
          node: <SceneNudakeDirection />,
        },
        {
          id: "nudake-experience",
          index: "06 — Nudake",
          label: "nudake-7",
          node: <SceneNudakeExperience />,
        },
        {
          id: "nudake-impact",
          index: "07 — Nudake",
          label: "nudake-8",
          node: <SceneNudakeImpact />,
        },
        */
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
