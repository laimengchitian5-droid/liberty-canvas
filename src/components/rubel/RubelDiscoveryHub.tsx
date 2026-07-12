import { RubelDiscoveryHubClient } from "@/components/rubel/RubelDiscoveryHubClient";
import { listDiagnoses, listHubCards } from "@/lib/rubel/repository";

export const dynamic = "force-dynamic";

const RubelDiscoveryHub = async () => {
  const [initialCards, catalog] = await Promise.all([
    listHubCards(),
    listDiagnoses(),
  ]);

  return (
    <RubelDiscoveryHubClient initialCards={initialCards} catalog={catalog} />
  );
};

export { RubelDiscoveryHub };
