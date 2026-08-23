import { LightStage } from "@/components/LightStage";
import { SceneIntro } from "@/components/SceneIntro";
import { SceneStatement } from "@/components/SceneStatement";

export default function Home() {
  return <LightStage intro={<SceneIntro />} statement={<SceneStatement />} />;
}
