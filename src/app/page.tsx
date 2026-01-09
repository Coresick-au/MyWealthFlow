'use client'

import {
    StatCard,
    PropertyCard,
    TransactionRow,
    CsvDropzone,
    NestedCircles,
    BarChart
} from '@/components'
import {
    Upload,
    TrendingUp,
    Wallet,
    Home,
    ArrowRight,
    Bell
} from 'lucide-react'
import Link from 'next/link'
import { useData } from '@/lib/context/DataContext'

const weeklyData = [
    { label: '12 Oct', value: 0, highlighted: false },
    { label: '19 Oct', value: 0, highlighted: false },
    { label: '26 Oct', value: 0, highlighted: false },
    { label: '03 Nov', value: 0, highlighted: true },
    { label: '10 Nov', value: 0, highlighted: false },
    { label: '17 Nov', value: 0, highlighted: false },
    { label: '24 Nov', value: 0, highlighted: false },
]

export default function Dashboard() {
    const { getTransactions, getProperties, getAccounts } = useData()

    // Get Data
    const transactions = getTransactions()
    const properties = getProperties()
    const accounts = getAccounts()

    // --- CALCULATIONS ---

    // 1. Net Position (Total Property Value + Cash - Loans)
    // For now, simple sum of property values as requested in plan
    const totalPropertyValue = properties.reduce((sum, p) => sum + p.currentValue, 0)
    // const totalAccountBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0) // TODO: Add balance to Account type
    const netPosition = totalPropertyValue // + totalAccountBalance

    // 2. Cash Available (Net Cash Flow / All Time Transaction Sum)
    // Since we don't have opening balances, this is just "Cash Generated"
    const cashAvailable = transactions.reduce((sum, t) => sum + t.amount, 0)

    // 3. YTD Expenses (Since July 1st)
    const now = new Date()
    const currentYear = now.getFullYear()
    const fyStartYear = now.getMonth() >= 6 ? currentYear : currentYear - 1
    const fyStartDate = new Date(fyStartYear, 6, 1) // July 1st

    const ytdExpenses = transactions
        .filter(t => t.date >= fyStartDate && t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    // 4. Property Income (Monthly Estimate)
    const monthlyPropertyIncome = properties.reduce((sum, p) => {
        // If rented and has rent
        if (p.propertyStatus === 'rented' && p.weeklyRent) {
            return sum + (p.weeklyRent * 52 / 12)
        }
        return sum
    }, 0)

    // --- RECENT DATA ---
    const recentTransactions = [...transactions]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5)
        .map(t => ({
            merchant: t.cleanDescription || t.rawDescription,
            category: t.allocations[0]?.categoryId || 'Uncategorised', // Placeholder
            amount: t.amount, // TransactionRow handles formatting
            date: t.date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }),
            isIncome: t.amount > 0
        }))

    const investmentProperties = properties
        .filter(p => p.type === 'investment')
        .slice(0, 3)

    // --- CHART DATA (Simple Aggregation) ---
    // Monthly Spending (Top 3 Categories) - Placeholder logic until Categories are fully implemented
    const spendingCircles = [
        { value: `$${Math.round(ytdExpenses / 12).toLocaleString()}`, label: 'Avg/Mo', color: '#c8ff00', size: 180 },
        { value: '', label: '', color: '#ff6b6b', size: 220 },
        { value: '', label: '', color: '#b388ff', size: 250 },
    ]

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
                <div className="flex items-center justify-between px-8 py-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                        <p className="text-sm text-gray-500">Overview</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/import"
                            className="flex items-center gap-2 px-5 py-2.5 bg-accent-lime text-dark-bg font-semibold rounded-xl hover:bg-accent-lime/90 transition-all hover:shadow-lg hover:shadow-accent-lime/20"
                        >
                            <Upload size={18} />
                            Import Bank CSV
                        </Link>

                        <button className="relative p-2.5 bg-dark-card rounded-xl border border-dark-border hover:bg-dark-card-hover transition-colors">
                            <Bell size={20} className="text-gray-400" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-coral rounded-full"></span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Net Position"
                        value={`$${netPosition.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`}
                        change="Based on Property Value"
                        positive
                        variant="teal"
                        icon={<TrendingUp size={18} />}
                    />
                    <StatCard
                        title="Cash Flow (All Time)"
                        value={`$${cashAvailable.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`}
                        change={cashAvailable >= 0 ? "Positive Flow" : "Net Negative"}
                        positive={cashAvailable >= 0}
                        variant="blue"
                        icon={<Wallet size={18} />}
                    />
                    <StatCard
                        title="YTD Expenses"
                        value={`$${ytdExpenses.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`}
                        change={`Since July 1, ${fyStartYear}`}
                        positive={false}
                        variant="purple"
                    />
                    <StatCard
                        title="Property Income"
                        value={`$${Math.round(monthlyPropertyIncome).toLocaleString()}/mo`}
                        change="Estimated"
                        neutral
                        variant="green"
                        icon={<Home size={18} />}
                    />
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Spending Activity with Circle Chart */}
                    <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Monthly Spending</h3>
                                <p className="text-sm text-gray-500">Average based on YTD</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center py-4">
                            <NestedCircles
                                circles={spendingCircles}
                            />
                        </div>

                        {/* Legend Placeholder */}
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-dark-border">
                            <div className="text-center">
                                <div className="w-3 h-3 rounded-full bg-accent-lime mx-auto mb-1"></div>
                                <p className="text-xs text-gray-400">Total YTD</p>
                                <p className="text-sm font-semibold text-white">${(ytdExpenses / 1000).toFixed(1)}k</p>
                            </div>
                            {/* Empty Placeholders for now */}
                        </div>
                    </div>

                    {/* Weekly Transactions */}
                    <BarChart
                        data={weeklyData}
                        title="Weekly Activity"
                        subtitle="Last 7 weeks"
                    />
                </div>

                {/* Quick Import Section */}
                <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Quick Import</h3>
                        <Link href="/import" className="text-sm text-accent-lime hover:underline flex items-center gap-1">
                            View all imports <ArrowRight size={14} />
                        </Link>
                    </div>
                    <CsvDropzone />
                </div>

                {/* Two Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Investment Properties */}
                    <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Investment Properties</h3>
                            <Link href="/properties" className="text-sm text-accent-lime hover:underline flex items-center gap-1">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {investmentProperties.length === 0 ? (
                                <p className="text-gray-500 text-sm py-4 text-center">No investment properties added.</p>
                            ) : (
                                investmentProperties.map((property) => (
                                    <PropertyCard
                                        key={property.id}
                                        address={property.address}
                                        value={`$${(property.currentValue / 1000).toFixed(0)}k`}
                                        status={property.propertyStatus === 'rented' ? 'rented' : property.propertyStatus === 'vacant' ? 'vacant' : 'primary_residence'}
                                        weeklyRent={property.weeklyRent?.toString()}
                                        yield={property.weeklyRent ? `${((property.weeklyRent * 52 / property.currentValue) * 100).toFixed(1)}%` : undefined}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Recent Spending</h3>
                            <Link href="/transactions" className="text-sm text-accent-lime hover:underline flex items-center gap-1">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="divide-y divide-dark-border">
                            {recentTransactions.length === 0 ? (
                                <p className="text-gray-500 text-sm py-4 text-center">No transactions yet.</p>
                            ) : (
                                recentTransactions.map((tx, index) => (
                                    <TransactionRow
                                        key={index}
                                        merchant={tx.merchant}
                                        category={tx.category}
                                        amount={tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                                        date={tx.date}
                                        isIncome={tx.isIncome}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Properties', value: properties.length.toString(), color: 'bg-accent-teal/10 text-accent-teal' },
                        { label: 'Bank Accounts', value: accounts.length.toString(), color: 'bg-accent-purple/10 text-accent-purple' },
                        { label: 'Unreviewed Txns', value: transactions.filter(t => t.needsReview).length.toString(), color: 'bg-accent-lime/10 text-accent-lime' },
                        { label: 'Transations', value: transactions.length.toString(), color: 'bg-accent-coral/10 text-accent-coral' },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="bg-dark-card rounded-xl p-4 border border-dark-border text-center interactive-card"
                        >
                            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
