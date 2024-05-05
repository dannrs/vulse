import { redirect } from "next/navigation";
import { Login } from "./login";
import { Paths } from "~/lib/constants";
import { validateRequest } from "~/lib/auth/validate-request";

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) redirect(Paths.Dashboard);

  return (
    <Login />
  );
}
