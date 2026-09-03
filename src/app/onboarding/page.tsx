import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: equipmentCatalog } = await supabase
    .from("equipment_catalog")
    .select("id, name, category, image_url");

  return (
    <div className="flex-1 px-4 py-10 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-1">Vamos montar sua ficha</h1>
      <p className="text-muted mb-8">
        Conta pra gente o que você tem disponível e sua meta — o resto a gente cuida.
      </p>
      <OnboardingForm equipmentCatalog={equipmentCatalog ?? []} />
    </div>
  );
}
