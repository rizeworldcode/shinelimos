import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { sendOtpToAdmin } from "../../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Email is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtpToAdmin(email);
      if (!res || !res.success) {
        setError(res?.message || "Failed to send OTP");
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate("/verify-otp", { state: { email } }), 1500);
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="route-fade bg-black/40 min-h-screen pt-32 pb-20 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Link to="/admin-login" className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white mb-8 transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3" /> Back to Login
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="font-serif-lux text-3xl md:text-4xl text-white">Forgot Password</h1>
          <p className="text-white/50 mt-3 text-sm">Enter your email to receive an OTP.</p>
        </div>

        <div className="glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-white/40 focus:bg-white/5 transition-all placeholder-white/30"
                placeholder="admin@shinelimos.com"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading || success}
              className={`w-full mt-2 ${success ? 'bg-green-500 hover:bg-green-600' : loading ? 'opacity-60 cursor-wait' : 'bg-white hover:bg-gray-200'} ${success ? 'text-white' : 'text-black'} px-6 py-4 rounded-xl text-sm font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:-translate-y-0.5`}
            >
              {success ? '✓ OTP Sent!' : loading ? 'Sending…' : 'Send OTP'}
            </button>
            {error && <div className="mt-3 text-sm text-red-400 text-center">{error}</div>}
            {success && <div className="mt-3 text-sm text-green-400 text-center">Check your email for the OTP.</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
