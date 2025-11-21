import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserCard from "@/components/dashboard/UserCard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import FreelancerDashboard from "@/components/dashboard/FreelancerDashboard";
import SupplierDashboard from "@/components/dashboard/SupplierDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const role = session.user.role;
  const name = session.user.name;
  const email = session.user.email;

  const renderContent = () => {
    if (role === "freelancer") return <FreelancerDashboard />;
    if (role === "supplier") return <SupplierDashboard />;
    return <UserDashboard />;
  };

  return (
    <div className="space-y-8">
      <UserCard />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">🎉 خوش آمدی {name}!</h1>
        <p className="text-gray-600 mt-2">نقش شما: {role}</p>
        <p className="text-sm text-gray-500">ایمیل: {email}</p>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
}
