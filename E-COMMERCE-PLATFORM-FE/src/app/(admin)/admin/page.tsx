import { redirect } from "next/navigation";
import { PATHS } from "@/constants/routes";

export default function Page() {
  redirect(PATHS.admin.products);
}
