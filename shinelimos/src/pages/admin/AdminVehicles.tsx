import { useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";

export default function AdminVehicles() {
  const [modalOpen, setModalOpen] = useState(false);

  const [vehicles, setVehicles] = useState([
    { id: 1, name: "Executive Luxury Sedan", type: "Hourly", price: 75, image: "/images/S class.jpg" },
    { id: 2, name: "Luxury SUV Limo", type: "Hourly", price: 95, image: "/images/Cadillac Escalade.jpg" },
    { id: 3, name: "Premium Party Bus", type: "Hourly", price: 250, image: "/images/30 PAX bus.jpg" },
    { id: 4, name: "Executive Sprinter", type: "Hourly", price: 150, image: "/images/sprinter (mercedes van).jpg" },
    { id: 5, name: "Chevrolet Suburban SUV", type: "Hourly", price: 85, image: "/images/Chevrolet Suburban.jpg" },
    { id: 6, name: "Lincoln Navigator SUV", type: "Hourly", price: 90, image: "/images/Lincoln navigator-SUV.jpg" },
    { id: 7, name: "50 PAX Motorcoach", type: "Hourly", price: 300, image: "/images/50 PAX bus.jpg" },
    { id: 8, name: "Corporate Sedan", type: "Hourly", price: 65, image: "/images/sedan.jpg" },
  ]);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      setVehicles(vehicles.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif-lux text-white">Our Vehicles</h1>
          <p className="text-white/50 text-sm mt-1">Manage fleet and pricing.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map((v) => (
          <div key={v.id} className="glass-dark rounded-2xl border border-white/5 p-4 hover:border-white/10 transition-all hover:scale-[1.02] group flex flex-col relative">
            <div className="bg-white rounded-xl aspect-4/3 flex items-center justify-center p-4 mb-4 overflow-hidden relative group/img">
               <img src={v.image} alt={v.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   handleDelete(v.id);
                 }}
                 className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-sm"
               >
                 <Trash2 size={16} />
               </button>
            </div>
            <div className="text-center flex-1 flex flex-col">
              <h3 className="text-white font-medium text-sm mb-2 leading-tight">{v.name}</h3>
              <div className="inline-block mx-auto px-4 py-1 rounded-full bg-white/10 text-xs text-white/70 mb-4">
                {v.type} ${v.price}
              </div>
              <div className="mt-auto pt-2">
                <button 
                  onClick={() => setModalOpen(true)}
                  className="w-full bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/30 hover:border-blue-500 transition-colors py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                >
                   Update Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#111]/90 backdrop-blur-md z-10">
              <h2 className="text-xl font-serif-lux text-white">Add New Vehicle</h2>
              <button onClick={() => setModalOpen(false)} className="text-white/50 hover:text-white bg-white/5 rounded-full p-2">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="rounded-2xl bg-[#d1d5db] p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group">
                <div className="text-black font-medium mb-4">Drop files or click to upload</div>
                <button className="bg-[#5c73e6] hover:bg-blue-600 text-white px-10 py-2.5 rounded-md text-sm font-medium italic transition-colors">Browse</button>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-white mb-2">Vehicle Name</label>
                  <input 
                    type="text" 
                    placeholder="Placeholders" 
                    className="w-full bg-black border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors placeholder:text-white/40 placeholder:italic" 
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-xs font-bold text-white mb-2">Base Price</label>
                  <select className="w-full bg-black border border-white/5 rounded-xl px-4 py-3.5 text-white/40 italic text-sm focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer">
                    <option>Placeholders</option>
                  </select>
                  <div className="absolute right-4 bottom-3.5 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-xs font-bold text-white mb-2">Price Per Min.</label>
                  <select className="w-full bg-black border border-white/5 rounded-xl px-4 py-3.5 text-white/40 italic text-sm focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer">
                    <option>Placeholder</option>
                  </select>
                  <div className="absolute right-4 bottom-3.5 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-xs font-bold text-white mb-2">Price Per Mile.</label>
                  <select className="w-full bg-black border border-white/5 rounded-xl px-4 py-3.5 text-white/40 italic text-sm focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer">
                    <option>Value</option>
                  </select>
                  <div className="absolute right-4 bottom-3.5 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-xs font-bold text-white mb-2">Price Per Hour</label>
                  <select className="w-full bg-black border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer">
                    <option></option>
                  </select>
                  <div className="absolute right-4 bottom-3.5 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-white mb-2">Unites</label>
                  <select className="w-full bg-black border border-white/5 rounded-xl px-4 py-3.5 text-blue-500 italic text-sm focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer">
                    <option>Select</option>
                  </select>
                  <div className="absolute right-4 bottom-3.5 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-xs font-bold text-white mb-2">Passenger Capacity</label>
                  <select className="w-full bg-black border border-white/5 rounded-xl px-4 py-3.5 text-blue-500 italic text-sm focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer">
                    <option>Select</option>
                  </select>
                  <div className="absolute right-4 bottom-3.5 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>

                <div className="md:col-span-2 relative">
                  <label className="block text-xs font-bold text-white mb-2">Luggage Capacity</label>
                  <select className="w-full bg-black border border-white/5 rounded-xl px-4 py-3.5 text-blue-500 italic text-sm focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer">
                    <option>Select</option>
                  </select>
                  <div className="absolute right-4 bottom-3.5 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-white/5 flex justify-end gap-3 sticky bottom-0 bg-[#111]/90 backdrop-blur-md">
               <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors">Cancel</button>
               <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">Save Vehicle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
