import { useWallet } from "@txnlab/use-wallet-react";
import { useState } from "react";

export default function CustomWalletButton({ label, className }) {
  const { wallets, activeAccount } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  // If connected, show connected state and disconnect button
  if (activeAccount) {
    return (
      <button
        onClick={() => {
          // Find active and disconnect
          const activeW = wallets.find(w => w.isConnected);
          if (activeW) activeW.disconnect();
        }}
        className={`bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-white/10 transition-all duration-300 text-white px-6 py-3 rounded-2xl font-medium flex items-center justify-center gap-3 ${className}`}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
        <span className="font-mono tracking-wider">
          {activeAccount.address.slice(0, 4)}...{activeAccount.address.slice(-4)}
        </span>
        <span className="text-white/40 text-sm ml-2">(Disconnect)</span>
      </button>
    );
  }

  // If not connected, show connect button that opens modal
  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className={`bg-[#5282E1] hover:bg-[#3d68bc] transition-all duration-300 text-white px-6 py-3 rounded-2xl font-medium shadow-[0_0_20px_rgba(82,130,225,0.4)] ${className}`}
      >
        {label || "Connect Wallet"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
            
            <h2 className="text-2xl font-semibold mb-6 text-white text-center font-['ClashDisplay'] tracking-wide">
              Select Wallet
            </h2>

            <div className="space-y-3">
              {wallets?.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => {
                    wallet.connect();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 rounded-2xl p-4 text-left group"
                >
                  <div className="flex items-center">
                    <img 
                      src={wallet.metadata.icon} 
                      alt={wallet.metadata.name} 
                      className="w-8 h-8 rounded-full bg-white object-contain mr-4"
                    />
                    <span className="font-medium text-white/90 group-hover:text-white">{wallet.metadata.name}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[#5282E1]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-white/30 text-center mt-8 tracking-widest uppercase">
              Powered by Algorand
            </p>
          </div>
        </div>
      )}
    </>
  );
}
