"use client";

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-xl border-b border-[#1F2937] pb-2">/USERS/COHORT</h2>
      
      <div className="bg-[#111827] p-6 border border-[#1F2937]">
        <h3 className="mb-4 text-[#9CA3AF]">User Base Metrics</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#374151] text-[#9CA3AF]">
              <th className="py-2">Metric</th>
              <th className="py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#1F2937]">
              <td className="py-2">Total Registered Users</td>
              <td className="py-2">142</td>
            </tr>
            <tr className="border-b border-[#1F2937]">
              <td className="py-2">Free Tier</td>
              <td className="py-2">110</td>
            </tr>
            <tr className="border-b border-[#1F2937]">
              <td className="py-2">Pro Tier (Standard 29€)</td>
              <td className="py-2">5</td>
            </tr>
            <tr className="border-b border-[#1F2937]">
              <td className="py-2">Early Access Consumed (19€)</td>
              <td className="py-2">27 / 30</td>
            </tr>
            <tr>
              <td className="py-2">Free to Pro Conversion Rate</td>
              <td className="py-2">22.5%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
