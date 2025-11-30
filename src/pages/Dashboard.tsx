import React from 'react';
import { useTrades } from '../hooks/useTrades';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { TrendingUp, TrendingDown, Activity, Wallet, List, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const { stats, trades } = useTrades();
  const recentTrades = trades.slice(0, 5);

  const formatIDR = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's your trading summary.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Today's PnL</p>
              <h3 className={`text-2xl font-bold mt-1 ${stats.todayPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatIDR(stats.todayPnL)}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${stats.todayPnL >= 0 ? 'bg-green-100 text-success' : 'bg-red-100 text-danger'}`}>
              {stats.todayPnL >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total PnL</p>
              <h3 className={`text-2xl font-bold mt-1 ${stats.totalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatIDR(stats.totalPnL)}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-accent">
              <Wallet size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Win Rate</p>
              <h3 className="text-2xl font-bold mt-1 text-primary">
                {stats.winRate.toFixed(1)}%
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 text-warning">
              <Activity size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Open Trades</p>
              <h3 className="text-2xl font-bold mt-1 text-primary">
                {stats.openTrades}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-gray-200 text-gray-600">
              <List size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-bold text-primary mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentTrades.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-400">No trades yet. Start by adding one!</p>
            </Card>
          ) : (
            recentTrades.map((trade) => (
              <Card key={trade.id} className="flex items-center justify-between p-4 hover:scale-[1.01] transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-12 rounded-full ${trade.status === 'OPEN' ? 'bg-accent' : trade.sellPrice && trade.sellPrice > trade.buyPrice ? 'bg-success' : 'bg-danger'}`} />
                  <div>
                    <h4 className="font-bold text-primary">{trade.code}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="default">{trade.type}</Badge>
                      <span className="text-xs text-gray-400 self-center">{trade.buyDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center items-end"> {/* Adjusted to items-end for right alignment */}
                  <span className={`text-sm font-bold ${
                    trade.status === 'OPEN' ? 'text-gray-400' : 
                    (trade.sellPrice && trade.sellPrice > trade.buyPrice) ? 'text-success' : 'text-danger'
                  }`}>
                    {trade.status === 'OPEN' ? 'OPEN' : 
                      (trade.sellPrice && trade.qty) ? formatIDR((trade.sellPrice - trade.buyPrice) * trade.qty * 100) : '-'}
                  </span>
                  <p className="text-xs text-gray-400">{trade.qty} Lots</p> {/* Moved "Lots" here */}
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/edit/${trade.id}`)} className="h-8 w-8 p-0 flex items-center justify-center self-end">
                    <Edit2 size={14} />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
