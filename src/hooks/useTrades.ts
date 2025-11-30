import { useState, useEffect, useCallback } from 'react';
import { Trade, TradeStats } from '../types';

const STORAGE_KEY = 'trade-history-data';

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  }, [trades]);

  const addTrade = (trade: Omit<Trade, 'id'>) => {
    const newTrade = {
      ...trade,
      id: crypto.randomUUID(),
    };
    setTrades(prev => [newTrade, ...prev]);
  };

  const updateTrade = (id: string, updates: Partial<Trade>) => {
    setTrades(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTrade = (id: string) => {
    setTrades(prev => prev.filter(t => t.id !== id));
  };

  const getStats = (): TradeStats => {
    const today = new Date().toISOString().split('T')[0];
    let totalPnL = 0;
    let todayPnL = 0;
    let wins = 0;
    let closedTrades = 0;

    trades.forEach(t => {
      if (t.status === 'CLOSED' && t.sellPrice) {
        // Simple PnL calc: (Sell - Buy) * Qty * 100 (assuming ID stocks 1 lot = 100 shares)
        // Adjust multiplier based on type if needed. For now assume ID stocks default.
        const multiplier = 100; 
        const pnl = (t.sellPrice - t.buyPrice) * t.qty * multiplier;
        
        totalPnL += pnl;
        
        if (t.sellDate === today) {
          todayPnL += pnl;
        }

        if (pnl > 0) wins++;
        closedTrades++;
      }
    });

    return {
      totalPnL,
      todayPnL,
      winRate: closedTrades > 0 ? (wins / closedTrades) * 100 : 0,
      openTrades: trades.filter(t => t.status === 'OPEN').length,
      totalTrades: trades.length
    };
  };

  const getTrade = useCallback((id: string) => trades.find(t => t.id === id), [trades]);

  return {
    trades,
    getTrade,
    addTrade,
    updateTrade,
    deleteTrade,
    stats: getStats()
  };
}
