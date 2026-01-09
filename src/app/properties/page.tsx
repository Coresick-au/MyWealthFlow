'use client'

import { useState } from 'react'
import { Plus, Home, TrendingUp, DollarSign, MoreVertical, MapPin } from 'lucide-react'
import { Property, PropertyType, PropertyStatus } from '@/lib/types'

// Mock Properties
const MOCK_PROPERTIES: (Property & { equity: number; incomeYTD: number; expensesYTD: number })[] = [
    {
        id: 'prop-1',
        address: '69 Blackwood Road',
        suburb: 'Leeming',
        state: 'WA',
        postcode: '6149',
        type: 'investment',
        purchaseDate: new Date('2018-06-15'),
        purchasePrice: 485000,
        currentValue: 720000,
        weeklyRent: 550,
        status: 'rented',
        createdAt: new Date(),
        equity: 447000,
        incomeYTD: 14300,
        expensesYTD: 8200
    },
    {
        id: 'prop-2',
        address: '11 Tobruk Crescent',
        suburb: 'Port Kennedy',
        state: 'WA',
        postcode: '6172',
        type: 'investment',
        purchaseDate: new Date('2020-02-20'),
        purchasePrice: 390000,
        currentValue: 520000,
        weeklyRent: 480,
        status: 'rented',
        createdAt: new Date(),
        equity: 378000,
        incomeYTD: 12480,
        expensesYTD: 5100
    },
    {
        id: 'prop-3',
        address: '29 Wickham Street',
        suburb: 'Brighton',
        state: 'VIC',
        postcode: '3186',
        type: 'investment',
        purchaseDate: new Date('2021-09-01'),
        purchasePrice: 890000,
        currentValue: 980000,
        weeklyRent: 750,
        status: 'rented',
        createdAt: new Date(),
        equity: 544000,
        incomeYTD: 19500,
        expensesYTD: 12300
    },
    {
        id: 'prop-4',
        address: '16 Beddoe Road',
        suburb: 'Fremantle',
        state: 'WA',
        postcode: '6160',
        type: 'owner_occupied',
        purchaseDate: new Date('2023-03-15'),
        purchasePrice: 750000,
        currentValue: 820000,
        status: 'owner_occupied',
        createdAt: new Date(),
        equity: 388000,
        incomeYTD: 0,
        expensesYTD: 15600
    }
]

const STATUS_COLORS: Record<PropertyStatus, string> = {
    rented: 'bg-accent-lime/20 text-accent-lime',
    vacant: 'bg-yellow-500/20 text-yellow-400',
    owner_occupied: 'bg-blue-500/20 text-blue-400',
    sold: 'bg-gray-500/20 text-gray-400'
}

const STATUS_LABELS: Record<PropertyStatus, string> = {
    rented: 'Rented',
    vacant: 'Vacant',
    owner_occupied: 'Owner Occupied',
    sold: 'Sold'
}

export default function PropertiesPage() {
    const [filter, setFilter] = useState<'all' | 'investment' | 'owner_occupied'>('all')

    const totalEquity = MOCK_PROPERTIES.reduce((sum, p) => sum + p.equity, 0)
    const totalValue = MOCK_PROPERTIES.reduce((sum, p) => sum + p.currentValue, 0)
    const totalIncomeYTD = MOCK_PROPERTIES.reduce((sum, p) => sum + p.incomeYTD, 0)

    const filteredProperties = MOCK_PROPERTIES.filter(p =>
        filter === 'all' || p.type === filter
    )

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Properties</h1>
                    <p className="text-gray-500 mt-1">Manage your property portfolio</p>
                </div>
                <button className="bg-accent-teal text-dark-bg px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-accent-teal/20 transition-all flex items-center gap-2">
                    <Plus size={20} />
                    Add Property
                </button>
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-accent-teal/20 to-transparent border border-accent-teal/30 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-accent-teal/20 rounded-xl flex items-center justify-center">
                            <Home size={20} className="text-accent-teal" />
                        </div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Properties</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{MOCK_PROPERTIES.length}</p>
                </div>
                <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-accent-lime/20 rounded-xl flex items-center justify-center">
                            <TrendingUp size={20} className="text-accent-lime" />
                        </div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Equity</p>
                    </div>
                    <p className="text-2xl font-bold text-accent-lime">
                        ${totalEquity.toLocaleString('en-AU')}
                    </p>
                </div>
                <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <DollarSign size={20} className="text-blue-400" />
                        </div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Portfolio Value</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        ${totalValue.toLocaleString('en-AU')}
                    </p>
                </div>
                <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <DollarSign size={20} className="text-purple-400" />
                        </div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Income YTD</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">
                        ${totalIncomeYTD.toLocaleString('en-AU')}
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {['all', 'investment', 'owner_occupied'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as typeof filter)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f
                                ? 'bg-accent-teal text-dark-bg'
                                : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'
                            }`}
                    >
                        {f === 'all' ? 'All Properties' : f === 'investment' ? 'Investment' : 'Owner Occupied'}
                    </button>
                ))}
            </div>

            {/* Property Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map(property => (
                    <div
                        key={property.id}
                        className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-accent-teal/50 transition-all group"
                    >
                        {/* Header */}
                        <div className="p-5 flex items-start justify-between border-b border-dark-border">
                            <div className="flex gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-accent-teal/20 to-accent-lime/20 rounded-xl flex items-center justify-center">
                                    <Home size={24} className="text-accent-teal" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg group-hover:text-accent-teal transition-colors">
                                        {property.address}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin size={14} />
                                        {property.suburb}, {property.state} {property.postcode}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${STATUS_COLORS[property.status]}`}>
                                    {STATUS_LABELS[property.status]}
                                </span>
                                <button className="text-gray-500 hover:text-white transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="p-5 grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Current Value</p>
                                <p className="text-lg font-bold text-white mt-1">
                                    ${property.currentValue.toLocaleString('en-AU')}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Equity</p>
                                <p className="text-lg font-bold text-accent-lime mt-1">
                                    ${property.equity.toLocaleString('en-AU')}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                                    {property.weeklyRent ? 'Weekly Rent' : 'Expenses YTD'}
                                </p>
                                <p className="text-lg font-bold text-accent-teal mt-1">
                                    ${(property.weeklyRent || property.expensesYTD).toLocaleString('en-AU')}
                                    {property.weeklyRent && <span className="text-xs text-gray-500">/wk</span>}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 bg-dark-bg/50 border-t border-dark-border flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                                Purchased {property.purchaseDate.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })} for ${property.purchasePrice.toLocaleString('en-AU')}
                            </p>
                            <button className="text-accent-teal text-sm font-bold hover:underline">
                                View Details →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
