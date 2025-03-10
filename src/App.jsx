// App.jsx
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#4ade80', '#f87171', '#60a5fa', '#facc15', '#a78bfa'];

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('transactions');
    if (storedData) setTransactions(JSON.parse(storedData));
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = () => {
    if (!amount || !category || !date) return;
    const newTransaction = { type, amount: parseFloat(amount), category, note, date };
    setTransactions([...transactions, newTransaction]);
    setAmount(''); setCategory(''); setNote(''); setDate('');
  };

  const handleDelete = (index) => {
    const updated = [...transactions];
    updated.splice(index, 1);
    setTransactions(updated);
  };

  const income = transactions.filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const pieData = [];
  transactions.filter(t => t.type === 'expense').forEach(t => {
    const existing = pieData.find(p => p.name === t.category);
    if (existing) existing.value += t.amount;
    else pieData.push({ name: t.category, value: t.amount });
  });

  const monthlyData = [
    { name: 'Income', value: income },
    { name: 'Expense', value: expense },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-6">💸 Personal Finance Tracker</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded-2xl shadow-md">
          <p className="text-xl font-semibold text-green-800">Income</p>
          <p className="text-2xl">₹{income}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-2xl shadow-md">
          <p className="text-xl font-semibold text-red-800">Expenses</p>
          <p className="text-2xl">₹{expense}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-2xl shadow-md">
          <p className="text-xl font-semibold text-blue-800">Balance</p>
          <p className="text-2xl">₹{income - expense}</p>
        </div>
      </div>

      {/* Add Transaction */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-xl mb-10">
        <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded-xl">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="border p-2 rounded-xl" />
          <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded-xl" />
          <input type="text" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} className="border p-2 rounded-xl" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 rounded-xl" />
        </div>
        <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition" onClick={handleAddTransaction}>Add Transaction</button>
      </motion.div>

      {/* Pie Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-2xl shadow-xl mb-10">
        <h2 className="text-xl font-bold mb-4">Expense by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bar Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-2xl shadow-xl mb-10">
        <h2 className="text-xl font-bold mb-4">Monthly Income vs Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Transaction List */}
      <div className="bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">Transactions</h2>
        {transactions.length === 0 ? <p>No transactions yet.</p> : (
          <ul className="space-y-2">
            {transactions.map((t, i) => (
              <li key={i} className="flex justify-between items-center border-b py-2">
                <div>
                  <p className="font-medium">{t.category} - ₹{t.amount}</p>
                  <p className="text-sm text-gray-500">{t.note || '-'} | {t.date}</p>
                </div>
                <button className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600" onClick={() => handleDelete(i)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;