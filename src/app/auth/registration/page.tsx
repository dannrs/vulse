import { redirect } from "next/navigation";
import { validateRequest } from "~/lib/auth/validate-request";
import { Registration } from "./registration";

export default async function RegistrationPage() {
    const { user } = await validateRequest();
  
    if (user) redirect(`/${user.slug}`);
  
    return <Registration />;
  }