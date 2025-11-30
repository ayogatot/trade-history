import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { AddTrade } from './pages/AddTrade';
import { TradeList } from './pages/TradeList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-primary font-sans selection:bg-accent/20">
        <div className="max-w-4xl mx-auto px-6 py-8 pb-32 md:pt-32">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddTrade />} />
            <Route path="/edit/:id" element={<AddTrade />} />
            <Route path="/trades" element={<TradeList />} />
          </Routes>
        </div>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
