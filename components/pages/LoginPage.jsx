import React from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { Role } from '../../types';

export default function LoginPage({ loginRole, setLoginRole, loginEmail, setLoginEmail, loginPassword, setLoginPassword, handleLogin, loginError }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        {/* Left Illustration Side */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-blue-600 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.1C93.5,9,82.2,22.3,71.2,33.5C60.2,44.7,49.5,53.8,37.8,61.7C26.1,69.6,13.4,76.3,-0.6,77.3C-14.6,78.4,-30.9,73.7,-43.3,64.8C-55.7,55.9,-64.2,42.8,-70.7,29.1C-77.2,15.4,-81.7,1.1,-78.7,-11.5C-75.7,-24.1,-65.2,-35,-54.2,-44.2C-43.2,-53.4,-31.7,-60.9,-19.7,-65.7C-7.7,-70.5,4.8,-72.6,17.4,-74.7" transform="translate(100 100)" />
              </svg>
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-4">HelpDesk</h1>
            <p className="text-blue-100 text-lg mb-8">Streamline your support request and manage tickets with efficiency.</p>
            
            {/* Sample Credentials */}
            <div className="bg-blue-700 bg-opacity-50 rounded-xl p-6 text-left text-sm border border-blue-400">
              <p className="font-bold mb-3 text-blue-100">Sample Credentials:</p>
              <div className="space-y-2 text-blue-50 text-xs">
                <p><span className="font-semibold">Users:</span></p>
                <p>📧 alice@company.com | 🔐 alice123</p>
                <p>📧 john@company.com | 🔐 john123</p>
                <p className="mt-3"><span className="font-semibold">Agents (by domain):</span></p>
                <p>📧 bob@company.com | 🔐 bob123 (Network)</p>
                <p>📧 sarah@company.com | 🔐 sarah123 (Hardware)</p>
                <p>📧 mike@company.com | 🔐 mike123 (Software)</p>
                <p>📧 charlie@company.com | 🔐 charlie123 (Electricity)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Welcome Back</h2>
          
          {/* Error Message */}
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Invalid Credentials</p>
                <p className="text-red-700 text-sm mt-1">{loginError}</p>
              </div>
            </div>
          )}
          
          {/* Role Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setLoginRole(Role.USER)}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
                loginRole === Role.USER 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              User Login
            </button>
            <button
              onClick={() => setLoginRole(Role.AGENT)}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
                loginRole === Role.AGENT 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Agent Portal
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 ${
                  loginError
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 ${
                  loginError
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform transition hover:-translate-y-0.5 ${
                loginRole === Role.USER ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-800 hover:bg-slate-900'
              }`}
            >
              Login as {loginRole}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
