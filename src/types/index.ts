export type TradeType = 'BSJP' | 'SWING' | 'SCALPING';
export type TradeStatus = 'OPEN' | 'CLOSED';

export interface Trade {
  id: string;
  code: string;
  type: TradeType;
  status: TradeStatus;
  buyDate: string;
  buyPrice: number;
  sellDate?: string;
  sellPrice?: number;
  qty: number; // Lots for ID stocks, Units for others if needed
  fees?: number; // Optional fees
  notes?: string;
}

export interface TradeStats {
  totalPnL: number;
  todayPnL: number;
  winRate: number;
  openTrades: number;
  totalTrades: number;
}
