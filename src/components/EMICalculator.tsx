import React, { useState } from 'react';
import { X, Calculator, IndianRupee, Percent, Calendar, CheckCircle2 } from 'lucide-react';

interface EMICalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPrice?: number;
}

export const EMICalculator: React.FC<EMICalculatorProps> = ({
  isOpen,
  onClose,
  defaultPrice = 15000000
}) => {
  const [loanAmount, setLoanAmount] = useState<number>(Math.round(defaultPrice * 0.8)); // 80% LTV
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5% p.a.
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years

  if (!isOpen) return null;

  // EMI Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyInterestRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  
  let monthlyEMI = 0;
  if (monthlyInterestRate > 0) {
    monthlyEMI = Math.round(
      (loanAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
    );
  }

  const totalAmountPayable = monthlyEMI * totalMonths;
  const totalInterestPayable = Math.max(0, totalAmountPayable - loanAmount);
  const principalPercentage = Math.round((loanAmount / totalAmountPayable) * 100) || 50;
  const interestPercentage = 100 - principalPercentage;

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹ ${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Home Loan EMI Calculator</h2>
              <p className="text-xs text-slate-400">Calculate exact monthly payments and bank eligibility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Output Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-1">
                Your Monthly EMI
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                ₹ {monthlyEMI.toLocaleString('en-IN')} <span className="text-xs font-medium text-slate-300">/ month</span>
              </p>
            </div>

            <div className="text-right space-y-1 text-xs border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6 w-full md:w-auto">
              <p className="text-slate-300">Principal Amount: <span className="text-white font-bold">{formatCurrency(loanAmount)}</span></p>
              <p className="text-slate-300">Total Interest: <span className="text-blue-300 font-bold">{formatCurrency(totalInterestPayable)}</span></p>
              <p className="text-slate-300">Total Amount: <span className="text-white font-bold">{formatCurrency(totalAmountPayable)}</span></p>
            </div>
          </div>

          {/* Visual Percentage Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="text-slate-900">Principal ({principalPercentage}%)</span>
              <span className="text-blue-600">Interest ({interestPercentage}%)</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div style={{ width: `${principalPercentage}%` }} className="bg-slate-900 h-full" />
              <div style={{ width: `${interestPercentage}%` }} className="bg-blue-600 h-full" />
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-5">
            {/* 1. Loan Amount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <IndianRupee className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  Loan Amount
                </label>
                <span className="text-sm font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                  {formatCurrency(loanAmount)}
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={100000000}
                step={500000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* 2. Interest Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <Percent className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  Interest Rate (% p.a.)
                </label>
                <span className="text-sm font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min={6.5}
                max={15.0}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* 3. Tenure Years */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  Loan Tenure (Years)
                </label>
                <span className="text-sm font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                  {tenureYears} Years
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              onClick={() => {
                alert('Bank Home Loan Pre-Approval Request sent to partner banks (SBI, HDFC, ICICI)!');
                onClose();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Get Instant Bank Pre-Approval Sanction Letter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
