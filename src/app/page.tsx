import { LightStage } from "@/components/LightStage";
import { SceneIntro } from "@/components/SceneIntro";
import { ScenePerspective } from "@/components/ScenePerspective";
import { SceneStatement } from "@/components/SceneStatement";

export default function Home() {
  return (
    <LightStage
      sections={[
        <SceneIntro key="intro" />,
        <SceneStatement key="statement" />,
        <ScenePerspective key="perspective" />,
      ]}
    />
  );
}
