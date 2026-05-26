import { TrendingUp, TrendingDown, Users, CheckSquare, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif-lux text-white">Overview</h1>
          <p className="text-white/50 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <select className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-white/20 appearance-none min-w-[120px]">
          <option value="today" className="bg-[#111]">Today</option>
          <option value="week" className="bg-[#111]">This Week</option>
          <option value="month" className="bg-[#111]">This Month</option>
          <option value="year" className="bg-[#111]">This Year</option>
        </select>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Booking" 
          value="7,265" 
          change="+11.01%" 
          isPositive={true} 
          icon={<CheckSquare className="text-white/40" size={20} />} 
          bg="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20"
        />
        <StatCard 
          title="Total New Customers" 
          value="3,671" 
          change="-0.03%" 
          isPositive={false} 
          icon={<Users className="text-white/40" size={20} />} 
          bg="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20"
        />
        <StatCard 
          title="Total Earning" 
          value="$22,318" 
          change="+6.08%" 
          isPositive={true} 
          icon={<DollarSign className="text-white/40" size={20} />} 
          bg="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Trips */}
        <div className="lg:col-span-2 glass-dark rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors">
          <h2 className="text-lg font-semibold text-white mb-6">Total Trips - 7,265</h2>
          <div className="space-y-6">
            <TripProgress label="Done Trips" value={46} color="bg-orange-400" />
            <TripProgress label="Booked" value={17} color="bg-emerald-400" />
            <TripProgress label="Cancelled" value={19} color="bg-blue-400" />
          </div>
        </div>

        {/* Top Destination Pie Chart Placeholder */}
        <div className="glass-dark rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-6">Top Destination</h2>
          <div className="flex-1 flex items-center justify-center">
             <div className="relative w-48 h-48 rounded-full border-16 border-white/5 flex items-center justify-center">
                {/* Simulated pie chart segments */}
                <div className="absolute inset-0 rounded-full border-16 border-transparent border-t-blue-400 border-r-blue-400 rotate-45"></div>
                <div className="absolute inset-0 rounded-full border-16 border-transparent border-t-emerald-400 -rotate-30"></div>
                <div className="absolute inset-0 rounded-full border-16 border-transparent border-l-white/20 -rotate-12"></div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">52%</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-widest">US</div>
                </div>
             </div>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400"></span>United States</span><span className="text-white/60">52.1%</span></div>
            <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>Canada</span><span className="text-white/60">22.8%</span></div>
            <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white/20"></span>Mexico</span><span className="text-white/60">13.9%</span></div>
          </div>
        </div>
      </div>

      {/* Booking Table (Recent) */}
      <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <button className="text-xs text-gold hover:text-white transition-colors uppercase tracking-widest">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-white/50 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Trip Name</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {[
                { name: "Ashwin", email: "a@email.com", trip: "Airport Transfer", date: "16 Jul 2026", status: "Pending", color: "text-orange-400 bg-orange-400/10" },
                { name: "Deeksha", email: "deeksha@email.com", trip: "Corporate Hourly", date: "15 Jul 2026", status: "Confirmed", color: "text-emerald-400 bg-emerald-400/10" },
                { name: "Prem", email: "prem@email.com", trip: "Wedding Package", date: "14 Jul 2026", status: "Cancelled", color: "text-red-400 bg-red-400/10" },
                { name: "Ashwin", email: "a@email.com", trip: "Point to Point", date: "16 Jul 2026", status: "Pending", color: "text-orange-400 bg-orange-400/10" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">{row.name[0]}</div>
                      <div>
                        <div className="text-white font-medium">{row.name}</div>
                        <div className="text-[11px] text-white/40">{row.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{row.trip}</td>
                  <td className="p-4 text-white/60">{row.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold ${row.color}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-white/40 hover:text-white transition-colors">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, isPositive, icon, bg }: any) {
  return (
    <div className={`rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] ${bg}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white/70 text-sm font-medium">{title}</h3>
        <div className="p-2 rounded-lg bg-white/5">{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-white font-sans">{value}</div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {change} {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        </div>
      </div>
    </div>
  );
}

function TripProgress({ label, value, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/80">{label}</span>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${color} bg-opacity-20 text-white`}>{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
