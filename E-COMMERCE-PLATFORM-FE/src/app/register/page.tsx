import { redirect } from "next/navigation";
import { PATHS } from "@/constants/routes";

export default function RegisterRedirect() {
  redirect(PATHS.auth.signUp);
}
