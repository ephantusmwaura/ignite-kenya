import { BentoHero } from "@/components/public/BentoHero";
import { FeaturedPrograms } from "@/components/public/FeaturedPrograms";
import { ImpactSnapshot } from "@/components/public/ImpactSnapshot";
import { ResourcesList } from "@/components/public/ResourcesList";

export default function Home() {
  return (
    <div className="min-h-screen">
      <BentoHero />
      <FeaturedPrograms />
      <ResourcesList />
      <ImpactSnapshot />
    </div>
  );
}
