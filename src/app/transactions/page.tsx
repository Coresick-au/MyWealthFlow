'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Calendar, ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown, Pencil } from 'lucide-react'
import { BankCode, BANKS } from '@/lib/types'
import { useData, TransactionRecord } from '@/lib/context/DataContext'
import { EditTransactionModal } from '@/components/modals/EditTransactionModal'

const CATEGORIES = ['All', 'Groceries', 'Fuel', 'Utilities', 'Interest on Loans', 'Rental Income', 'Council Rates', 'Repairs & Maintenance', 'Transfer - Family']

export default function TransactionsPage() {
    const { getTransactions } = useData()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [dateRange, setDateRange] = useState('This Month') // Default to This Month
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' })
    const [editingTransaction, setEditingTransaction] = useState<TransactionRecord | null>(null)

    // Persistence: Load settings on mount
    useEffect(() => {
        const savedDateRange = localStorage.getItem('mwf_txn_dateRange')
        if (savedDateRange) setDateRange(savedDateRange)

        const savedCategory = localStorage.getItem('mwf_txn_category')
        if (savedCategory) setSelectedCategory(savedCategory)

        const savedSort = localStorage.getItem('mwf_txn_sort')
        if (savedSort) {
            try {
                setSortConfig(JSON.parse(savedSort))
            } catch (e) {
                console.error('Failed to parse saved sort config', e)
            }
        }
    }, [])

    // Persistence: Save settings on change
    useEffect(() => {
        localStorage.setItem('mwf_txn_dateRange', dateRange)
    }, [dateRange])

    useEffect(() => {
        localStorage.setItem('mwf_txn_category', selectedCategory)
    }, [selectedCategory])

    useEffect(() => {
        localStorage.setItem('mwf_txn_sort', JSON.stringify(sortConfig))
    }, [sortConfig])

    // Get transactions from context
    const transactions = getTransactions(false) // Don't include archived/deleted

    // Get unique categories dynamically from actual data + defaults
    const availableCategories = ['All', ...Array.from(new Set([
        ...CATEGORIES,
        ...transactions.map(t => (t as any).category || 'Uncategorised') // Simplified since real category logic is pending
    ]))].filter((v, i, a) => a.indexOf(v) === i).sort()

    // Note: The mock data had 'category' but the actual Transaction type might store it in 'allocations' or 'categoryId'
    // For this import flow, we are treating `suggestedCategory` or unallocated.
    // We need to map the Context transactions to the display format.

    // Helper to extract a display category
    const getDisplayCategory = (txn: any) => {
        if (txn.allocations && txn.allocations.length > 0) {
            return txn.allocations[0].categoryId // Simplified for now
        }
        return txn.cleanDescription || 'Uncategorised'
    }

    const getStartDate = (range: string) => {
        const now = new Date()
        const currentYear = now.getFullYear()

        switch (range) {
            case 'This Month':
                return new Date(now.getFullYear(), now.getMonth(), 1)
            case 'Last Month':
                return new Date(now.getFullYear(), now.getMonth() - 1, 1)
            case 'This FY':
                // Financial Year starts July 1st
                const fyStartYear = now.getMonth() < 6 ? currentYear - 1 : currentYear
                return new Date(fyStartYear, 6, 1) // Month is 0-indexed, 6 is July
            case 'All Time':
            default:
                return null
        }
    }

    const getEndDate = (range: string) => {
        const now = new Date()
        const currentYear = now.getFullYear()

        switch (range) {
            case 'Last Month':
                // Last day of last month
                return new Date(now.getFullYear(), now.getMonth(), 0)
            case 'This Month':
                // Return null to go up to now
                return null
            case 'This FY':
            case 'All Time':
            default:
                return null // No end date limit (up to now/future)
        }
    }

    const filteredTransactions = transactions.filter(txn => {
        const displayCategory = txn.allocations?.[0]?.categoryId || 'Uncategorised' // Temporary mapping
        // We might need to adjust how category is stored/retrieved. 
        // For the import, we didn't strictly set allocations yet, we set `needsReview`.

        // Let's use a simpler check for now since imported txns might not have categories set up fully.
        // We should check 'needsReview' too potentially?

        const description = txn.cleanDescription || txn.rawDescription
        const matchesSearch = description.toLowerCase().includes(searchQuery.toLowerCase())

        // const matchesCategory = selectedCategory === 'All' || displayCategory === selectedCategory
        // Disable category filter for a moment if data structure mismatch, but keeping it logic wise:
        const matchesCategory = selectedCategory === 'All' // Temporary allow all while we fix category mapping

        // Date Filtering
        let matchesDate = true
        const startDate = getStartDate(dateRange)
        const endDate = getEndDate(dateRange)
        const txnDate = new Date(txn.date)

        if (startDate) {
            matchesDate = txnDate >= startDate
        }
        if (endDate && matchesDate) {
            // Set endDate to end of day
            const eod = new Date(endDate)
            eod.setHours(23, 59, 59, 999)
            matchesDate = txnDate <= eod
        }

        return matchesSearch && matchesCategory && matchesDate
    }).sort((a, b) => {
        const { key, direction } = sortConfig
        let comparison = 0

        switch (key) {
            case 'date':
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
                break
            case 'amount':
                comparison = Math.abs(a.amount) - Math.abs(b.amount)
                break
            case 'description':
                const descA = (a.cleanDescription || a.rawDescription).toLowerCase()
                const descB = (b.cleanDescription || b.rawDescription).toLowerCase()
                comparison = descA.localeCompare(descB)
                break
            case 'bank':
                comparison = a.bank.localeCompare(b.bank)
                break
            default:
                break
        }

        return direction === 'asc' ? comparison : -comparison
    })

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
        }))
    }

    const SortIcon = ({ column }: { column: string }) => {
        if (sortConfig.key !== column) return <div className="w-4 h-4" /> // Spacer
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={16} className="text-accent-teal" />
            : <ArrowDown size={16} className="text-accent-teal" />
    }

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
                <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-dark-card border border-dark-border rounded-xl py-3 pl-11 pr-4 text-white hover:bg-dark-card-hover transition-colors appearance-none cursor-pointer focus:outline-none focus:border-accent-teal/50"
                    >
                        <option value="This Month">This Month</option>
                        <option value="Last Month">Last Month</option>
                        <option value="This FY">This FY</option>
                        <option value="All Time">All Time</option>
                    </select>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-dark-bg/50 border-b border-dark-border">
                        <tr>
                            <th className="text-left py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">
                                <button
                                    className="flex items-center gap-2 hover:text-white transition-colors"
                                    onClick={() => handleSort('date')}
                                >
                                    Date
                                    <SortIcon column="date" />
                                </button>
                            </th>
                            <th className="text-left py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">
                                <button
                                    className="flex items-center gap-2 hover:text-white transition-colors"
                                    onClick={() => handleSort('description')}
                                >
                                    Description
                                    <SortIcon column="description" />
                                </button>
                            </th>
                            <th className="text-left py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">Category</th>
                            <th className="text-left py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">Entity</th>
                            <th className="text-left py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">
                                <button
                                    className="flex items-center gap-2 hover:text-white transition-colors"
                                    onClick={() => handleSort('bank')}
                                >
                                    Bank
                                    <SortIcon column="bank" />
                                </button>
                            </th>
                            <th className="text-right py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">
                                <button
                                    className="flex items-center gap-2 ml-auto hover:text-white transition-colors"
                                    onClick={() => handleSort('amount')}
                                >
                                    Amount
                                    <SortIcon column="amount" />
                                </button>
                            </th>
                            <th className="text-right py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((txn, idx) => (
                            <tr
                                key={txn.id}
                                className={`border-b border-dark-border hover:bg-dark-card-hover transition-colors ${idx % 2 === 0 ? '' : 'bg-dark-bg/30'} ${txn.needsReview ? 'bg-orange-900/10' : ''}`}
                            >
                                <td className="py-4 px-6 text-gray-400 font-mono text-sm">
                                    {new Date(txn.date).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: '2-digit' })}
                                </td>
                                <td className="py-4 px-6 text-white font-medium">
                                    {txn.cleanDescription || txn.rawDescription}
                                    {txn.needsReview && (
                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">Review</span>
                                    )}
                                </td>
                                <td className="py-4 px-6">
                                    <button
                                        onClick={() => setEditingTransaction(txn)}
                                        className="bg-dark-bg px-3 py-1 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-dark-border transition-colors text-left"
                                    >
                                        {(txn as any).allocations?.[0]?.categoryId || 'Uncategorised'}
                                    </button>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-accent-lime text-sm font-medium">
                                        -
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <span
                                        className="text-xs font-bold px-2 py-1 rounded"
                                        style={{ backgroundColor: BANKS[txn.bank]?.color || '#fff', color: '#000' }}
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
                                <td className="py-4 px-6 text-right">
                                    <button
                                        onClick={() => setEditingTransaction(txn)}
                                        className="p-2 text-gray-500 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-gray-500">
                                    No transactions found for this period.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <EditTransactionModal
                isOpen={!!editingTransaction}
                onClose={() => setEditingTransaction(null)}
                transaction={editingTransaction}
            />
        </div>
    )
}
