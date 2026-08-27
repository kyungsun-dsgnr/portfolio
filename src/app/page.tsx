// 내려 둔 표지에서 씁니다: import { GlobeDots } from "@/components/GlobeDots";
import { GlobePaper } from "@/components/GlobePaper";
import { LightStage } from "@/components/LightStage";
import { SceneCase } from "@/components/07-SceneCase";
import { SceneFlow } from "@/components/14-SceneFlow";
import { SceneScreens } from "@/components/15-SceneScreens";
// 내려 둔 장에서 씁니다: import { SceneGiftBox } from "@/components/13-SceneGiftBox";
import { SceneTamburinsCover } from "@/components/12-SceneTamburinsCover";
import { SceneAfter } from "@/components/11-SceneAfter";
import { SceneExplore } from "@/components/10-SceneExplore";
import { SceneIntro } from "@/components/01-SceneIntro";
import { SceneNudakeCover } from "@/components/18-SceneNudakeCover";
import { SceneDraft } from "@/components/SceneDraft";
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
          node: <SceneScreens />,
        },

        {
          id: "tamburins-shift",
          index: "03 — Tamburins",
          label: "Shift",
          node: (
            <SceneDraft
              title={
                <>
                  From Selection
                  <br />
                  to Composition.
                </>
              }
              lines={[
                "왼쪽 CURRENT — Gift Set / Scent 01 / Scent 02 / Complete",
                "오른쪽 PROPOSED — COMPOSE 한 마디",
                "아래 한 문장 — 여러 화면에 나뉜 선택을 하나의 선물을 구성하는 연속적인 경험으로 재구성합니다.",
                "복잡한 UI 없이 아주 단순하게. 여백을 크게 둡니다.",
                "핵심은 단계를 줄였다가 아니라, 구매 절차(Selection)를 선물을 만드는 행동(Composition)으로 바꿨다는 선언",
              ]}
            />
          ),
        },
        {
          id: "tamburins-compose",
          index: "04 — Tamburins",
          label: "Compose",
          node: (
            <SceneDraft
              title={
                <>
                  Choose,
                  <br />
                  Place, Compose.
                </>
              }
              lines={[
                "가운데 — 열린 탬버린즈 상자를 크게",
                "제품을 고르면 상자로 들어가는 모션: 제품 선택 → 상자로 이동 → 구성 확인",
                "01 CHOOSE — 원하는 구성을 고릅니다.",
                "02 PLACE — 선택한 제품이 상자 안에 놓입니다.",
                "03 COMPOSE — 구성을 확인하며 하나의 선물을 완성합니다.",
                "Drag & Drop 은 넣지 않습니다. 누르면 스스로 담기는 것으로 충분합니다.",
                "젠틀몬스터 Turn the World, Find a City 에 대응하는 탬버린즈의 대표 장면",
              ]}
            />
          ),
        },

        {
          id: "nudake",
          label: "Nudake",
          node: <SceneNudakeCover />,
        },
        {
          id: "nudake-current",
          index: "01 — Nudake",
          label: "Current",
          node: (
            <SceneDraft
              title={
                <>
                  A Gift,
                  <br />
                  Treated Like an Option.
                </>
              }
              lines={[
                "제목은 임시입니다. 실제 nudake.com 의 구매·선물 흐름을 먼저 확인하고 씁니다.",
                "확인할 것 — 선물 옵션이 따로 있는지, 메시지 입력이 어느 단계에 붙는지, 카드나 포장을 고를 수 있는지",
                "문제는 '화면이 많다' 가 아니라, 선물의 감정적 행위가 주문 옵션으로 축소되어 있다는 것",
                "탬버린즈의 '분산' 과 겹치지 않게, 여기서는 '축소' 를 짚습니다.",
              ]}
            />
          ),
        },
        {
          id: "nudake-reframe",
          index: "02 — Nudake",
          label: "Reframe",
          node: (
            <SceneDraft
              title={
                <>
                  From Message
                  <br />
                  to Gesture.
                </>
              }
              lines={[
                "타이포 위주의 전환 장. 화면은 넣지 않습니다.",
                "아래 한 문장 — 메시지를 입력하는 기능이 아니라, 마음을 적어 선물에 넣는 행위로 다시 해석합니다.",
                "탬버린즈의 From Selection to Composition 에 대응하되 내용은 완전히 다릅니다.",
              ]}
            />
          ),
        },
        {
          id: "nudake-insert",
          index: "03 — Nudake",
          label: "Insert",
          node: (
            <SceneDraft
              title={
                <>
                  Choose,
                  <br />
                  Write, Insert.
                </>
              }
              lines={[
                "누데이크의 대표 장면. UI 설명이 아니라 행동 자체를 보여 줍니다.",
                "가운데 큰 엽서. 둘레에 누데이크 결의 카드 여러 장이 겹쳐 있다가 고르면 한 장이 앞으로 나옵니다.",
                "01 Choose — 선물의 무드에 맞는 카드를 고릅니다.",
                "02 Write — 전하고 싶은 메시지를 남깁니다.",
                "03 Insert — 작성한 카드를 선물 안에 넣어 구성을 완성합니다.",
                "INSERT 가 이 프로젝트의 시그니처. 젠틀몬스터의 Turn, 탬버린즈의 Place 에 대응합니다.",
              ]}
            />
          ),
        },
        {
          id: "nudake-proposed",
          index: "04 — Nudake",
          label: "Proposed",
          node: (
            <SceneDraft
              title={
                <>
                  Make the Message
                  <br />
                  Part of the Gift.
                </>
              }
              lines={[
                "실제 모바일 화면을 크게 두는 장. 젠틀몬스터 Local Search, Global Discovery 에 대응합니다.",
                "01 CARD — 비주얼 선택",
                "02 MESSAGE — 메시지 작성",
                "03 INSERT — 선물에 넣기",
                "메시지가 결제 끝에 붙는 부가 기능이 아니라 선물 구성의 일부로 보이는 화면이어야 합니다.",
              ]}
            />
          ),
        },
        {
          id: "nudake-receive",
          index: "05 — Nudake",
          label: "Receiving",
          node: (
            <SceneDraft
              title={
                <>
                  From Giving
                  <br />
                  to Receiving.
                </>
              }
              lines={[
                "건넨다는 행동은 상대가 있어야 완성되므로, 받는 사람 화면까지 보여 줍니다.",
                "패키지가 열림 → 카드가 먼저 나타남 → 카드를 열어 메시지를 봄 → 그 뒤 선물 콘텐츠",
                "이 장이 있어야 메시지 UI 개선이 아니라 브랜드 경험 설계가 됩니다.",
              ]}
            />
          ),
        },
        {
          id: "nudake-closing",
          index: "06 — Nudake",
          label: "Closing",
          node: (
            <SceneDraft
              title={
                <>
                  The Message
                  <br />
                  Becomes Part of the Gift.
                </>
              }
              lines={[
                "Input → Gesture — 메시지 입력을 익숙한 행동으로",
                "Option → Composition — 부가 옵션을 선물 구성의 일부로",
                "Checkout → Giving — 구매 완료를 건네는 순간으로",
                "짧게 끝냅니다. 변화 셋 외에는 넣지 않습니다.",
              ]}
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
