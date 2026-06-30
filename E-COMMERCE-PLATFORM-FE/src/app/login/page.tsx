import { redirect } from "next/navigation";
import { PATHS } from "@/constants/routes";

export default function LoginRedirect() {
  redirect(PATHS.auth.signIn);
}
