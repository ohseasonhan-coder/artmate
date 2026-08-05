import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin-auth";
import AdminNav from "@/components/AdminNav";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const username = verifySession(store.get(ADMIN_COOKIE)?.value);
  if (!username) redirect("/admin/login");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row">
      <AdminNav username={username} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
