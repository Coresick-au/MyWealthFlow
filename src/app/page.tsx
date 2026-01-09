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

// Sample data for demo
const sampleTransactions = [
    { merchant: 'Bunnings Warehouse', category: 'Property Maintenance', amount: '-$142.50', date: 'Today', isIncome: false },
    { merchant: 'Woolworths', category: 'Groceries', amount: '-$88.20', date: 'Yesterday', isIncome: false },
    { merchant: 'Rental Income - 24 Smith St', category: 'Income', amount: '+$650.00', date: 'Jan 6', isIncome: true },
    { merchant: 'Water Corp', category: 'Water Charges', amount: '-$120.00', date: 'Jan 3', isIncome: false },
]

const sampleProperties = [
    { address: '24 Smith St, Newman', value: '$520k', status: 'rented' as const, yield: '6.2%', weeklyRent: '650' },
    { address: '88 West Rd, Perth', value: '$710k', status: 'vacant' as const, yield: '0.0%' },
]

const weeklyData = [
    { label: '12 Oct', value: 2400, highlighted: false },
    { label: '19 Oct', value: 3200, highlighted: false },
    { label: '26 Oct', value: 2800, highlighted: false },
    { label: '03 Nov', value: 3500, highlighted: true },
    { label: '10 Nov', value: 2100, highlighted: false },
    { label: '17 Nov', value: 2900, highlighted: false },
    { label: '24 Nov', value: 3400, highlighted: false },
]

export default function Dashboard() {
    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
                <div className="flex items-center justify-between px-8 py-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                        <p className="text-sm text-gray-500">Monthly Updates</p>
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
                        value="$1,240,000"
                        change="+2.4% this month"
                        positive
                        variant="teal"
                        icon={<TrendingUp size={18} />}
                    />
                    <StatCard
                        title="Cash Available"
                        value="$45,200"
                        change="+$3,200 from last month"
                        positive
                        variant="blue"
                        icon={<Wallet size={18} />}
                    />
                    <StatCard
                        title="YTD Expenses"
                        value="$42,300"
                        change="-12% vs last year"
                        positive={false}
                        variant="purple"
                    />
                    <StatCard
                        title="Property Income"
                        value="$3,200/mo"
                        change="Stable"
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
                                <p className="text-sm text-gray-500">July 2025 - FY 2025-26</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center py-4">
                            <NestedCircles
                                circles={[
                                    { value: '$8,450', label: 'Total', color: '#c8ff00', size: 180 },
                                    { value: '', label: '', color: '#ff6b6b', size: 220 },
                                    { value: '', label: '', color: '#b388ff', size: 250 },
                                ]}
                            />
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-dark-border">
                            <div className="text-center">
                                <div className="w-3 h-3 rounded-full bg-accent-lime mx-auto mb-1"></div>
                                <p className="text-xs text-gray-400">Property</p>
                                <p className="text-sm font-semibold text-white">$3,200</p>
                            </div>
                            <div className="text-center">
                                <div className="w-3 h-3 rounded-full bg-accent-coral mx-auto mb-1"></div>
                                <p className="text-xs text-gray-400">Living</p>
                                <p className="text-sm font-semibold text-white">$4,100</p>
                            </div>
                            <div className="text-center">
                                <div className="w-3 h-3 rounded-full bg-accent-purple mx-auto mb-1"></div>
                                <p className="text-xs text-gray-400">Other</p>
                                <p className="text-sm font-semibold text-white">$1,150</p>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Transactions */}
                    <BarChart
                        data={weeklyData}
                        title="Weekly Transactions"
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
                            {sampleProperties.map((property, index) => (
                                <PropertyCard key={index} {...property} />
                            ))}
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
                            {sampleTransactions.map((tx, index) => (
                                <TransactionRow key={index} {...tx} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Properties', value: '2', color: 'bg-accent-teal/10 text-accent-teal' },
                        { label: 'Bank Accounts', value: '4', color: 'bg-accent-purple/10 text-accent-purple' },
                        { label: 'Tax Deductions', value: '$12.4k', color: 'bg-accent-lime/10 text-accent-lime' },
                        { label: 'Imports This Month', value: '8', color: 'bg-accent-coral/10 text-accent-coral' },
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
