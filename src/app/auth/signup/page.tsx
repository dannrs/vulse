import { redirect } from "next/navigation";
import { validateRequest } from "~/lib/auth/validate-request";
import { Signup } from "./signup";

export default async function SignupPage() {
    const { user } = await validateRequest();
  
    if (user) redirect(`/${user.slug}`);
  
    return <Signup />;
  }