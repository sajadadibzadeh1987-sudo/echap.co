import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserDashboard from "@/components/dashboard/UserDashboard";
import FreelancerDashboard from "@/components/dashboard/FreelancerDashboard";
import SupplierDashboard from "@/components/dashboard/SupplierDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return <div>دسترسی غیرمجاز! لطفاً وارد شوید.</div>;
  }

  const role = session.user.role;

  return (
    <div className="p-4">
      {role === "freelancer" && <FreelancerDashboard />}
      {role === "supplier" && <SupplierDashboard />}
      {role === "user" && <UserDashboard />}
    </div>
  );
}
