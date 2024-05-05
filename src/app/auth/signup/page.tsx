import { redirect } from "next/navigation";
import { validateRequest } from "~/lib/auth/validate-request";
import { Paths } from "~/lib/constants";
import { Signup } from "./signup";

export default async function SignupPage() {
    const { user } = await validateRequest();
  
    if (user) redirect(Paths.Dashboard);
  
    return <Signup />;
  }