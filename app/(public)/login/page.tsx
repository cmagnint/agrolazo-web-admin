import { login } from "@/features/auth/actions";
import { LoginForm } from "@/features/auth/components/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    expired?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const expired = Array.isArray(params.expired)
    ? params.expired.includes("1")
    : params.expired === "1";

  return <LoginForm action={login} expired={expired} />;
}
