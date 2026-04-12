import { useWallet } from "@txnlab/use-wallet-react";
import { useState } from "react";

export default function CustomWalletButton({ label, className }) {
  const { wallets, activeAccount } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  if (activeAccount) {
    return (
      <button
        onClick={() => {
          const activeW = wallets.find(w => w.isConnected);
          if (activeW) activeW.disconnect();
        }}
        className={`flex items-center gap-3 px-5 py-2.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="font-mono text-xs">
          {activeAccount.address.slice(0, 5)}…{activeAccount.address.slice(-4)}
        </span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); setIsOpen(true); }}
        className={`px-6 py-2.5 rounded-full text-sm font-semibold bg-[#5282E1] text-white hover:bg-[#4272cc] transition-colors ${className}`}
      >
        {label || "Connect Wallet"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-lg font-semibold text-white mb-5">Select Wallet</h2>
            <div className="space-y-2">
              {wallets?.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => { wallet.connect(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all rounded-xl px-4 py-3 text-left group"
                >
                  <img src={wallet.metadata.icon} alt={wallet.metadata.name} className="w-8 h-8 rounded-lg bg-white/10 object-contain p-1" />
                  <span className="text-sm font-medium text-white/80 group-hover:text-white">{wallet.metadata.name}</span>
                  <svg className="w-4 h-4 ml-auto text-white/20 group-hover:text-white/50 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/20 text-center mt-5 uppercase tracking-widest">Powered by Algorand</p>
          </div>
        </div>
      )}
    </>
  );
}
