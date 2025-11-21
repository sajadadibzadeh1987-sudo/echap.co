"use client";

import StatsCard from "./StatsCard";
import { Eye, ListPlus, BookmarkCheck } from "lucide-react";

export default function UserDashboard() {
  return (
    <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <StatsCard title="بازدید آگهی‌ها" value="۱۲۳۴" icon={<Eye />} />
      <StatsCard title="آگهی‌های من" value="۷" icon={<ListPlus />} />
      <StatsCard title="نیازمندی‌ها" value="۵" icon={<BookmarkCheck />} />
    </section>
  );
}
