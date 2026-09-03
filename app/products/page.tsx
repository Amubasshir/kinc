import { redirect } from "next/navigation";

// Temporarily disabled at the client's request. Remove this redirect to reopen the page.
export default function ProductsPage() {
  redirect("/");
}
