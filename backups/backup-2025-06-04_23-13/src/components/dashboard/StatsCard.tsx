import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card className="flex items-center justify-between p-4 rounded-xl shadow-sm border text-right">
      <div>
        <h4 className="text-sm text-gray-500 mb-1">{title}</h4>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
      {icon && <div className="text-2xl text-blue-500">{icon}</div>}
    </Card>
  );
}
