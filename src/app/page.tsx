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
import { SceneNudakeContext } from "@/components/22-SceneNudakeContext";
import { SceneNudakeOpportunity } from "@/components/23-SceneNudakeOpportunity";
import { SceneNudakeHidden } from "@/components/24-SceneNudakeHidden";
import { SceneNudakeProblem } from "@/components/25-SceneNudakeProblem";
import { SceneNudakeGoal } from "@/components/26-SceneNudakeGoal";
import { SceneNudakeIA } from "@/components/27-SceneNudakeIA";
import { SceneNudakeGift } from "@/components/28-SceneNudakeGift";
import { SceneNudakeFinal } from "@/components/29-SceneNudakeFinal";
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
        { id: "switch", label: "Switch", node: <SceneSwitch /> },
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
        /* 뒷장과 제목이 같아 접어 둡니다. 되살릴 때 이 줄만 풀면 됩니다.
        { id: "perspective", label: "Perspective", node: <ScenePerspective /> }, */
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
          label: "Paper Globe",
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
          label: "Problem",
          node: <SceneProblem />,
        },
        {
          id: "gentle-monster-why",
          index: "02 — Gentle Monster",
          label: "Why",
          node: <SceneWhy />,
        },
        {
          id: "gentle-monster-explore",
          index: "03 — Gentle Monster",
          label: "Globe",
          node: <SceneExplore />,
        },
        {
          id: "gentle-monster-after",
          index: "04 — Gentle Monster",
          label: "Proposal",
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
          label: "Tamburins",
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
          label: "Current Flow",
          node: <SceneFlow />,
        },
        {
          id: "tamburins-screens",
          index: "02 — Tamburins",
          label: "Current Experience",
          node: <SceneScreensTall />,
        },

        {
          id: "tamburins-shift",
          index: "03 — Tamburins",
          label: "Shift",
          node: <SceneShift />,
        },

        {
          id: "tamburins-one",
          label: "One Screen",
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
          label: "Nudake",
          node: <SceneNudakeCover />,
        },
        {
          id: "nudake-context",
          index: "01 — Nudake",
          label: "Context",
          node: <SceneNudakeContext />,
        },
        {
          id: "nudake-opportunity",
          index: "02 — Nudake",
          label: "Opportunity",
          node: <SceneNudakeOpportunity />,
        },
        {
          id: "nudake-hidden",
          index: "03 — Nudake",
          label: "Current",
          node: <SceneNudakeHidden />,
        },
        {
          id: "nudake-problem",
          index: "04 — Nudake",
          label: "UX Problem",
          node: <SceneNudakeProblem />,
        },
        {
          id: "nudake-goal",
          index: "05 — Nudake",
          label: "Design Goal",
          node: <SceneNudakeGoal />,
        },
        {
          id: "nudake-ia",
          index: "06 — Nudake",
          label: "Proposed IA",
          node: <SceneNudakeIA />,
        },
        {
          id: "nudake-gift",
          index: "07 — Nudake",
          label: "Gift UX",
          node: <SceneNudakeGift />,
        },
        {
          id: "nudake-final",
          index: "08 — Nudake",
          label: "Result",
          node: <SceneNudakeFinal />,
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
