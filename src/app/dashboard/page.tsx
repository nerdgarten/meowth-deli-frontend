import { BarChart3, Menu, TrendingUp, User, Users } from "lucide-react";

import { SidebarTrigger } from "@ui/sidebar";

export default function DashboardPage() {
  return (
    <>
      <div className="max-w-6xl flex-1 px-6 py-8">
        <section className="rounded-3xl bg-gradient-to-br from-[#fdf0d4] via-[#fde7bd] to-[#f8dca2] p-8 shadow-2xl ring-1 ring-[#f1d39a]">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#c7731b]">
              Your restaurant dashboard!
            </h2>
            <p className="max-w-3xl text-sm text-[#7a5a35]">
              This dashboard provides an overview of your restaurant&apos;s key
              performance metrics, including revenue, orders, customer
              acquisition, and visitor trends. Use the interactive charts and
              summary cards below to monitor business growth, spot trends, and
              make informed decisions.
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.4fr)]">
            <div className="space-y-6 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-[#f2dcba]">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#d7891b]">
                  Pie Chart - Donut with Text
                </h3>
                <p className="text-xs text-[#b89463] uppercase">
                  January - June 2024
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-[#f9e1b9] p-8 text-center shadow-inner">
                <div className="relative h-56 w-56 rounded-full bg-gradient-to-br from-[#f7a23a] via-[#fdd15d] to-[#f36f36] shadow-lg">
                  <div className="absolute inset-8 rounded-full bg-white shadow-inner" />
                  <div className="absolute inset-16 flex items-center justify-center rounded-full bg-[#fef5dd] text-2xl font-semibold text-[#8f5a20]">
                    1,125
                  </div>
                </div>
                <p className="text-sm text-[#7a572f]">
                  Trending up by 5.2% this month · Showing total visitors for
                  the last 6 months
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-[#f2dcba]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#d7891b]">
                      Line Chart - Linear
                    </h3>
                    <p className="text-xs text-[#b89463] uppercase">
                      January - June 2024
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#7a572f]">
                    <TrendingUp className="size-4 text-[#d7891b]" />
                    Trending up by 6.2% this month
                  </div>
                </div>
                <div className="mt-6 h-48 rounded-xl bg-gradient-to-r from-[#ffe6bd] via-[#fddca7] to-[#f9c47d] p-4 text-[#7a572f] shadow-inner">
                  <div className="h-full rounded-lg border border-dashed border-[#e9c48f] opacity-70" />
                </div>
                <p className="mt-4 text-xs text-[#7a572f]">
                  Showing total visitors for the last 6 months
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <DashboardStat
                  label="Order Frequency"
                  value="1,250"
                  detail="Total Revenue"
                  trend="+12.5%"
                  accent="from-[#f8a348] to-[#f57b38]"
                />
                <DashboardStat
                  label="New Customers"
                  value="120"
                  detail="Down a little this period"
                  trend="-2.4%"
                  accent="from-[#fddfa4] to-[#f9c572]"
                />
                <DashboardStat
                  label="Total Orders"
                  value="350"
                  detail="Trending up this month"
                  trend="+8.2%"
                  accent="from-[#fddfa4] to-[#f9c572]"
                />
                <DashboardStat
                  label="Reviews"
                  value="4.8★"
                  detail="Showing the reviews score on every topics."
                  trend="Jan - Jun 2024"
                  accent="from-[#f7e6c1] to-[#f2cd88]"
                />
                <DashboardStat
                  label="Visitors"
                  value="45,678"
                  detail="Strong user retention"
                  trend="+3.0%"
                  accent="from-[#f6e0b7] to-[#f3c67a]"
                />
                <DashboardStat
                  label="Team Performance"
                  value="92%"
                  detail="Response time within target"
                  trend="+1.5%"
                  accent="from-[#f8a348] to-[#f57b38]"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

type DashboardStatProps = {
  label: string;
  value: string;
  detail: string;
  trend: string;
  accent: string;
};

function DashboardStat({
  label,
  value,
  detail,
  trend,
  accent,
}: DashboardStatProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-[#f2dcba]">
      <div className="flex items-center justify-between gap-2 text-sm text-[#7a572f]">
        <span className="font-medium">{label}</span>
        <BarChart3 className="size-4 text-[#d7891b]" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold text-[#8f5a20]">{value}</p>
          <p className="text-xs text-[#b89463]">{detail}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-[#f7e7c8] px-3 py-1 text-xs text-[#8f5a20]">
          <TrendingUp className="size-3" />
          {trend}
        </div>
      </div>
      <div
        className={`mt-4 h-2 rounded-full bg-gradient-to-r ${accent} shadow-inner`}
      />
      <div className="mt-3 flex items-center gap-2 text-xs text-[#7a572f]">
        <Users className="size-3" />
        Progress snapshot
      </div>
    </div>
  );
}
