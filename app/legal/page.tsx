import type { Metadata } from "next";
import { getLegalViewModel } from "../view-models/legalViewModel";
import LegalView from "../views/legal/LegalView";

export const metadata: Metadata = {
  title: "Legal & Shipping | KinCollage",
  description:
    "Review KinCollage shipping options, worldwide courier delivery timelines, and care policies. Every order is carefully studio packed and tracked.",
  keywords: ["KinCollage shipping policy", "turn-around time kids art frame", "studio terms"],
};

export default function LegalPage() {
  return <LegalView viewModel={getLegalViewModel()} />;
}
