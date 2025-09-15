"use client";

import { PieChartDonut } from "@/components/Dashboard/PieChartDonut";
import { LineChartLinear } from "@/components/Dashboard/LineChartLinear";
import { BarChartHorizontal } from "@/components/Dashboard/BarChartHorizontal";
import { SectionCard } from "@/components/Dashboard/SectionCard";
import { RadarChartDefault } from "@/components/Dashboard/RadarChart";


export default function DashboardPage() {
  
  return (
    <main className="bg-app-background my-8">
      <div className="flex justify-self-center flex-col w-3/4">
      <h1 className="text-4xl font-extrabold text-app-bronze">
          Your restaurant dashboard!
        </h1>
        <p className="mt-2 text-app-bronze/80 text-wrap">
          This dashboard provides an overview of your restaurant's key performance metrics, including revenue, orders, customer acquisition, and visitor trends. Use the interactive charts and summary cards below to monitor business growth, spot trends, and make informed decisions.
        </p>
      </div>
      <div className="m-[2rem] justify-self-center grid grid-cols-5 h-auto w-3/4 gap-4">
        <div className=" flex items-center justify-center col-span-2 row-span-2 h-full w-full">
          <PieChartDonut/>
        </div>
        <div className=" flex items-center justify-center col-span-3 h-full w-auto">
          <LineChartLinear/>
        </div>
        <div className="flex flex-col  items-center justify-between h-full gap-4">
          <BarChartHorizontal/>
          <RadarChartDefault/>
        </div>
        <div className="flex flex-col  items-center justify-between h-full gap-4">
          <SectionCard
            heading="Total Revenue"
            amount={1250}
            percent={12.5}
            details={[{text:"Trending up this month"},{text:"Visitors for the last 6 months"}]}
            />
          <SectionCard
            heading="Total Orders"
            amount={350}
            percent={8.2}
            details={[{text:"Trending up this month"},{text:"Orders for the last 6 months"}]}
            />
        </div>
        <div className="flex flex-col  items-center justify-between h-full gap-4">
          <SectionCard
            heading="New Customers"
            amount={120}
            percent={-2.4}
            details={[{text:"Down a little on this period"},{text:"Acquisition needs attention"}]}
            /> 
          <SectionCard
            heading="Visitors "
            amount={45678}
            percent={+30}
            details={[{text:"Strong user retention"},{text:"Engagement exceed targets"}]}
            /> 
        </div>
        <div className="flex flex-col  items-center justify-between h-full gap-4">
          
        </div>
      </div>
    </main>
  );
}
