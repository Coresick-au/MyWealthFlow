'use client'

import { useState } from 'react'
import { Search, Filter, Download, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { BankCode, BANKS } from '@/lib/types'

// Mock transaction data
const MOCK_TRANSACTIONS = [
    { id: '1', date: new Date('2025-12-12'), description: 'WOOLWORTHS NEWMAN', amount: -142.50, category: 'Groceries', bank: 'CBA' as BankCode, entity: 'Personal' },
    { id: '2', date: new Date('2025-12-11'), description: 'LOAN REPAYMENT TO A/C 432178590', amount: -1638.45, category: 'Interest on Loans', bank: 'NAB' as BankCode, entity: '69 Blackwood Rd' },
    { id: '3', date: new Date('2025-12-10'), description: 'RENTAL DEPOSIT - JOHN SMITH', amount: 650.00, category: 'Rental Income', bank: 'CBA' as BankCode, entity: '11 Tobruk Cres' },
    { id: '4', date: new Date('2025-12-09'), description: 'BUNNINGS WAREHOUSE', amount: -287.90, category: 'Repairs & Maintenance', bank: 'CBA' as BankCode, entity: '29 Wickham St' },
    { id: '5', date: new Date('2025-12-08'), description: 'SYNERGY ELECTRICITY', amount: -310.00, category: 'Utilities', bank: 'NAB' as BankCode, entity: 'Personal' },
    { id: '6', date: new Date('2025-12-07'), description: 'TRANSFER TO BRAD LEEMING', amount: -5000.00, category: 'Transfer - Family', bank: 'CBA' as BankCode, entity: 'Family' },
    { id: '7', date: new Date('2025-12-06'), description: 'CITY OF STIRLING RATES', amount: -1850.00, category: 'Council Rates', bank: 'CBA' as BankCode, entity: '69 Blackwood Rd' },
    { id: '8', date: new Date('2025-12-05'), description: 'COLES EXPRESS FUEL', amount: -95.40, category: 'Fuel', bank: 'NAB' as BankCode, entity: 'Work' },
]

const CATEGORIES = ['All', 'Groceries', 'Fuel', 'Utilities', 'Interest on Loans', 'Rental Income', 'Council Rates', 'Repairs & Maintenance', 'Transfer - Family']

export default function TransactionsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [dateRange, setDateRange] = useState('This Month')

    const filteredTransactions = MOCK_TRANSACTIONS.filter(txn => {
        const matchesSearch = txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || txn.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const totalIncome = filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = Math.abs(filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Transactions</h1>
                    <p className="text-gray-500 mt-1">View and manage all your transactions across banks</p>
                </div>
                <button className="bg-dark-card border border-dark-border px-4 py-2 rounded-xl text-white hover:bg-dark-card-hover transition-colors flex items-center gap-2">
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Income</p>
                    <p className="text-2xl font-bold text-accent-lime mt-2">
                        +${totalIncome.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-400 mt-2">
                        -${totalExpenses.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Net Cash Flow</p>
                    <p className={`text-2xl font-bold mt-2 ${totalIncome - totalExpenses >= 0 ? 'text-accent-teal' : 'text-red-400'}`}>
                        ${(totalIncome - totalExpenses).toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-dark-card border border-dark-border rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal/50"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-dark-card border border-dark-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-teal/50"
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <button className="bg-dark-card border border-dark-border px-4 py-3 rounded-xl text-white hover:bg-dark-card-hover transition-colors flex items-center gap-2">
                    <Calendar size={18} />
                    {dateRange}
                </button>
            </div>

            {/* Transactions Table */}
            <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-dark-bg/50 border-b border-dark-border">
                        <tr>
                            <th className="text-left py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">Date</th>
                            <th className="text-left py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">Description</th>
                            <th className="text-left py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">Category</th>
                            <th className="text-left py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">Entity</th>
                            <th className="text-left py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">Bank</th>
                            <th className="text-right py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((txn, idx) => (
                            <tr
                                key={txn.id}
                                className={`border-b border-dark-border hover:bg-dark-card-hover transition-colors cursor-pointer ${idx % 2 === 0 ? '' : 'bg-dark-bg/30'}`}
                            >
                                <td className="py-4 px-6 text-gray-400 font-mono text-sm">
                                    {txn.date.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: '2-digit' })}
                                </td>
                                <td className="py-4 px-6 text-white font-medium">{txn.description}</td>
                                <td className="py-4 px-6">
                                    <span className="bg-dark-bg px-3 py-1 rounded-lg text-sm text-gray-300">{txn.category}</span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-accent-lime text-sm font-medium">{txn.entity}</span>
                                </td>
                                <td className="py-4 px-6">
                                    <span
                                        className="text-xs font-bold px-2 py-1 rounded"
                                        style={{ backgroundColor: BANKS[txn.bank].color, color: '#000' }}
                                    >
                                        {txn.bank}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {txn.amount > 0 ? (
                                            <ArrowUpRight size={16} className="text-accent-lime" />
                                        ) : (
                                            <ArrowDownRight size={16} className="text-red-400" />
                                        )}
                                        <span className={`font-bold ${txn.amount > 0 ? 'text-accent-lime' : 'text-red-400'}`}>
                                            {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
