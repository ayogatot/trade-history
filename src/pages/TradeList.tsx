import React, { useState } from 'react';
import { useTrades } from '../hooks/useTrades';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Trash2, Edit2, Filter } from 'lucide-react';
import { TradeType } from '../types';

import { useNavigate } from 'react-router-dom';

export function TradeList() {
  const navigate = useNavigate();
  const { trades, deleteTrade } = useTrades();
  const [filterType, setFilterType] = useState<TradeType | 'ALL'>('ALL');

  const filteredTrades = filterType === 'ALL' 
    ? trades 
    : trades.filter(t => t.type === filterType);

  const formatIDR = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(val);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this trade?')) {
      deleteTrade(id);
    }
  };

  return (
    <div className="pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Trade History</h1>
          <p className="text-gray-500">All your past and present positions.</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['ALL', 'BSJP', 'SWING', 'SCALPING'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                filterType === type 
                  ? 'bg-accent text-white shadow-soft' 
                  : 'bg-background text-gray-500 hover:text-primary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-4">
        {filteredTrades.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-400">No trades found matching your filter.</p>
          </Card>
        ) : (
          filteredTrades.map((trade) => (
            <Card key={trade.id} className="group hover:scale-[1.005] transition-transform">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-2 h-16 rounded-full mt-1 ${
                    trade.status === 'OPEN' ? 'bg-accent' : 
                    (trade.sellPrice && trade.sellPrice > trade.buyPrice) ? 'bg-success' : 'bg-danger'
                  }`} />
                  
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-primary">{trade.code}</h3>
                      <Badge variant={trade.status === 'OPEN' ? 'info' : 'default'}>
                        {trade.status}
                      </Badge>
                      <Badge variant="warning" className="opacity-70">{trade.type}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2 text-sm text-gray-500">
                      <p>Buy: {formatIDR(trade.buyPrice)} <span className="text-xs">({trade.buyDate})</span></p>
                      {trade.sellPrice && (
                        <p>Sell: {formatIDR(trade.sellPrice)} <span className="text-xs">({trade.sellDate})</span></p>
                      )}
                      <p>Qty: {trade.qty} Lots</p>
                      {trade.status === 'CLOSED' && trade.sellPrice && (
                        <p className={`font-bold ${trade.sellPrice > trade.buyPrice ? 'text-success' : 'text-danger'}`}>
                          PnL: {formatIDR((trade.sellPrice - trade.buyPrice) * trade.qty * 100)}
                          <span className="text-xs ml-1 font-medium">
                            ({((trade.sellPrice - trade.buyPrice) / trade.buyPrice * 100).toFixed(2)}%)
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 justify-end opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/edit/${trade.id}`)} className="p-2">
                    <Edit2 size={16} />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(trade.id)} className="p-2">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
