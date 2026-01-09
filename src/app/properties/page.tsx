'use client'

import { useState } from 'react'
import { Plus, Home, TrendingUp, DollarSign, MoreVertical, MapPin } from 'lucide-react'
import { PropertyModal } from '@/components/modals/PropertyModal'
import { useData, PropertyRecord } from '@/lib/context/DataContext'
import { PropertyStatus } from '@/lib/types'

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
    const { getProperties } = useData()

    const [filter, setFilter] = useState<'all' | 'investment' | 'owner_occupied'>('all')
    const [showArchived, setShowArchived] = useState(false)

    // Modal state
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState<PropertyRecord | undefined>()
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

    const properties = getProperties(showArchived)

    const totalEquity = properties.reduce((sum, p) => {
        const equity = p.currentValue - (p.purchasePrice * 0.5) // Simplified equity calc
        return sum + equity
    }, 0)
    const totalValue = properties.reduce((sum, p) => sum + p.currentValue, 0)
    const totalIncomeYTD = properties.filter(p => p.weeklyRent).reduce((sum, p) => sum + (p.weeklyRent || 0) * 52, 0)

    const filteredProperties = properties.filter(p =>
        filter === 'all' || p.type === filter
    )

    const handleAddProperty = () => {
        setSelectedProperty(undefined)
        setModalMode('create')
        setModalOpen(true)
    }

    const handleEditProperty = (property: PropertyRecord) => {
        setSelectedProperty(property)
        setModalMode('edit')
        setModalOpen(true)
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Properties</h1>
                    <p className="text-gray-500 mt-1">Manage your property portfolio</p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Show Archived</span>
                        <button
                            onClick={() => setShowArchived(!showArchived)}
                            className={`w-10 h-5 rounded-full transition-colors relative ${showArchived ? 'bg-yellow-500' : 'bg-dark-border'}`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${showArchived ? 'translate-x-5' : ''}`} />
                        </button>
                    </label>
                    <button
                        onClick={handleAddProperty}
                        className="bg-accent-teal text-dark-bg px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-accent-teal/20 transition-all flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Property
                    </button>
                </div>
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
                    <p className="text-3xl font-bold text-white">{properties.length}</p>
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
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Gross Rent/Year</p>
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
            {filteredProperties.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 mb-4">No properties found. Add your first property to get started.</p>
                    <button
                        onClick={handleAddProperty}
                        className="bg-accent-teal text-dark-bg px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-accent-teal/20 transition-all inline-flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Property
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProperties.map(property => {
                        const propertyStatus = (property as any).propertyStatus || property.status
                        const equity = property.currentValue - (property.purchasePrice * 0.5)

                        return (
                            <div
                                key={property.id}
                                onClick={() => handleEditProperty(property)}
                                className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-accent-teal/50 transition-all group cursor-pointer"
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
                                        {property.status === 'archived' && (
                                            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-yellow-500/20 text-yellow-400">
                                                Archived
                                            </span>
                                        )}
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${STATUS_COLORS[propertyStatus as PropertyStatus] || 'bg-gray-500/20 text-gray-400'}`}>
                                            {STATUS_LABELS[propertyStatus as PropertyStatus] || propertyStatus}
                                        </span>
                                        <button className="text-gray-500 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
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
                                            ${equity.toLocaleString('en-AU')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                                            {property.weeklyRent ? 'Weekly Rent' : 'Expenses YTD'}
                                        </p>
                                        <p className="text-lg font-bold text-accent-teal mt-1">
                                            ${(property.weeklyRent || 0).toLocaleString('en-AU')}
                                            {property.weeklyRent && <span className="text-xs text-gray-500">/wk</span>}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-5 py-4 bg-dark-bg/50 border-t border-dark-border flex items-center justify-between">
                                    <p className="text-xs text-gray-500">
                                        Purchased {property.purchaseDate.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })} for ${property.purchasePrice.toLocaleString('en-AU')}
                                    </p>
                                    <span className="text-accent-teal text-sm font-bold">
                                        View Details →
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Property Modal */}
            <PropertyModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                property={selectedProperty}
                mode={modalMode}
            />
        </div>
    )
}
