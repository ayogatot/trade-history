import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTrades } from '../hooks/useTrades';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { TradeType, TradeStatus } from '../types';

export function AddTrade() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addTrade, updateTrade, getTrade } = useTrades();
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'BSJP' as TradeType,
    status: 'OPEN' as TradeStatus,
    buyDate: new Date().toISOString().split('T')[0],
    buyPrice: '',
    qty: '',
    sellDate: new Date().toISOString().split('T')[0],
    sellPrice: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      const trade = getTrade(id);
      if (trade) {
        setFormData({
          code: trade.code,
          type: trade.type,
          status: trade.status,
          buyDate: trade.buyDate,
          buyPrice: trade.buyPrice.toString(),
          qty: trade.qty.toString(),
          sellDate: trade.sellDate || new Date().toISOString().split('T')[0],
          sellPrice: trade.sellPrice?.toString() || '',
          notes: trade.notes || ''
        });
      }
    }
  }, [id, getTrade]);

  const totalInvested = Number(formData.buyPrice) * Number(formData.qty) * 100;
  const currentValue = formData.sellPrice ? Number(formData.sellPrice) * Number(formData.qty) * 100 : 0;
  const estimatedPnL = currentValue && totalInvested ? currentValue - totalInvested : 0;

  const formatIDR = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tradeData = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      status: formData.status,
      buyDate: formData.buyDate,
      buyPrice: Number(formData.buyPrice),
      qty: Number(formData.qty),
      sellDate: formData.status === 'CLOSED' ? formData.sellDate : undefined,
      sellPrice: formData.status === 'CLOSED' ? Number(formData.sellPrice) : undefined,
      notes: formData.notes
    };

    if (id) {
      updateTrade(id, tradeData);
    } else {
      addTrade(tradeData);
    }

    navigate('/trades');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="pb-24 md:pb-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">{id ? 'Edit Trade' : 'Add New Trade'}</h1>
        <p className="text-gray-500">{id ? 'Update your position details.' : 'Record your latest position.'}</p>
      </header>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              id="code" 
              label="Stock Code" 
              placeholder="e.g. BBRI" 
              value={formData.code}
              onChange={handleChange}
              required
              className="uppercase"
              disabled={!!id} // Disable code editing if needed, or allow it. Usually code doesn't change.
            />
            
            <Select 
              id="type" 
              label="Strategy Type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { value: 'BSJP', label: 'BSJP' },
                { value: 'SWING', label: 'Swing' },
                { value: 'SCALPING', label: 'Scalping' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
              id="buyDate" 
              type="date" 
              label="Buy Date" 
              value={formData.buyDate}
              onChange={handleChange}
              required
            />
            <Input 
              id="buyPrice" 
              type="number" 
              label="Buy Price" 
              placeholder="0" 
              value={formData.buyPrice}
              onChange={handleChange}
              required
              min="0"
            />
            <Input 
              id="qty" 
              type="number" 
              label="Quantity (Lots)" 
              placeholder="0" 
              value={formData.qty}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          {/* Total Invested Display */}
          <div className="bg-background/50 p-4 rounded-xl border border-white/50 shadow-soft-inner">
            <p className="text-sm text-gray-500">Total Invested</p>
            <p className="text-xl font-bold text-primary">{formatIDR(totalInvested)}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <Select 
              id="status" 
              label="Status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'OPEN', label: 'Open Position' },
                { value: 'CLOSED', label: 'Closed Position' },
              ]}
            />
          </div>

          {/* Sell Details - Visible when Closed */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${formData.status === 'CLOSED' ? 'opacity-100 max-h-[200px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
            <Input 
              id="sellDate" 
              type="date" 
              label="Sell Date" 
              value={formData.sellDate}
              onChange={handleChange}
              required={formData.status === 'CLOSED'}
            />
            <Input 
              id="sellPrice" 
              type="number" 
              label="Sell Price (Latest Nominal)" 
              placeholder="0" 
              value={formData.sellPrice}
              onChange={handleChange}
              required={formData.status === 'CLOSED'}
              min="0"
            />
          </div>

          {formData.status === 'CLOSED' && formData.sellPrice && (
             <div className={`p-4 rounded-xl border border-white/50 shadow-soft-inner ${estimatedPnL >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
               <p className="text-sm text-gray-500">Estimated PnL</p>
               <p className={`text-xl font-bold ${estimatedPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                 {formatIDR(estimatedPnL)}
               </p>
             </div>
          )}

          <div>
            <label htmlFor="notes" className="text-sm font-medium text-gray-500 ml-1 mb-2 block">Notes</label>
            <textarea
              id="notes"
              className="w-full bg-background rounded-xl shadow-soft-inner px-4 py-3 outline-none focus:ring-2 focus:ring-accent/20 transition-all text-primary placeholder-gray-400 min-h-[100px] border border-transparent focus:border-accent/30"
              placeholder="Strategy notes, emotions, etc."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate('/trades')} className="flex-1 cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 cursor-pointer">
              {id ? 'Update Trade' : 'Save Trade'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
