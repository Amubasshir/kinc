import { getLegalViewModel } from "../view-models/legalViewModel";
import LegalView from "../views/legal/LegalView";

export default function LegalPage() {
  return <LegalView viewModel={getLegalViewModel()} />;
}
