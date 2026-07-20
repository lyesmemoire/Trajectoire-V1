"use client";

import { useRouter } from "next/navigation";

export default function ExposureTestButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        console.log("BUTTON CLICKED");
        router.push("/signup");
      }}
      className="rounded-xl bg-black px-6 py-3 text-white hover:opacity-90"
    >
      Lancer le Test d'Exposition
    </button>
  );
}
