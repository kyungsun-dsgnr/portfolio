import { LightStage } from "@/components/LightStage";
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
      ]}
    />
  );
}
