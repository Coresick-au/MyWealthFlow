'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Archive, RotateCcw, MapPin } from 'lucide-react'
import { PropertyType, PropertyStatus } from '@/lib/types'
import { useData, PropertyRecord } from '@/lib/context/DataContext'

interface PropertyModalProps {
    isOpen: boolean
    onClose: () => void
    property?: PropertyRecord
    mode?: 'create' | 'edit' | 'view'
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
    { value: 'investment', label: 'Investment Property' },
    { value: 'owner_occupied', label: 'Owner Occupied' },
    { value: 'sold', label: 'Sold' }
]

const PROPERTY_STATUSES: { value: PropertyStatus; label: string }[] = [
    { value: 'rented', label: 'Currently Rented' },
    { value: 'vacant', label: 'Vacant' },
    { value: 'owner_occupied', label: 'Owner Occupied' },
    { value: 'sold', label: 'Sold' }
]

const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT']

export function PropertyModal({ isOpen, onClose, property, mode = 'create' }: PropertyModalProps) {
    const { addProperty, updateProperty, archiveProperty, deleteProperty, restoreProperty } = useData()

    const [formData, setFormData] = useState({
        address: '',
        suburb: '',
        state: 'WA',
        postcode: '',
        type: 'investment' as PropertyType,
        purchaseDate: '',
        purchasePrice: '',
        currentValue: '',
        weeklyRent: '',
        propertyStatus: 'rented' as PropertyStatus
    })

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        if (property && mode !== 'create') {
            setFormData({
                address: property.address,
                suburb: property.suburb,
                state: property.state,
                postcode: property.postcode,
                type: property.type,
                purchaseDate: property.purchaseDate.toISOString().split('T')[0],
                purchasePrice: property.purchasePrice.toString(),
                currentValue: property.currentValue.toString(),
                weeklyRent: property.weeklyRent?.toString() || '',
                propertyStatus: property.status as PropertyStatus
            })
        } else {
            setFormData({
                address: '',
                suburb: '',
                state: 'WA',
                postcode: '',
                type: 'investment',
                purchaseDate: '',
                purchasePrice: '',
                currentValue: '',
                weeklyRent: '',
                propertyStatus: 'rented'
            })
        }
    }, [property, mode, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const propertyData = {
            address: formData.address,
            suburb: formData.suburb,
            state: formData.state,
            postcode: formData.postcode,
            type: formData.type,
            purchaseDate: new Date(formData.purchaseDate),
            purchasePrice: parseFloat(formData.purchasePrice) || 0,
            currentValue: parseFloat(formData.currentValue) || 0,
            weeklyRent: formData.weeklyRent ? parseFloat(formData.weeklyRent) : undefined,
            propertyStatus: formData.propertyStatus
        }

        if (mode === 'create') {
            addProperty(propertyData as any)
        } else if (property) {
            updateProperty(property.id, propertyData as any)
        }

        onClose()
    }

    const handleArchive = () => {
        if (property) {
            archiveProperty(property.id)
            onClose()
        }
    }

    const handleRestore = () => {
        if (property) {
            restoreProperty(property.id)
            onClose()
        }
    }

    const handleDelete = () => {
        if (property) {
            deleteProperty(property.id)
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-border shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent-teal/20 rounded-xl flex items-center justify-center">
                            <MapPin size={20} className="text-accent-teal" />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            {mode === 'create' ? 'Add New Property' : mode === 'edit' ? 'Edit Property' : 'Property Details'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                    {/* Address */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Street Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="e.g., 69 Blackwood Road"
                            className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal/50"
                            required
                        />
                    </div>

                    {/* Suburb, State, Postcode */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Suburb</label>
                            <input
                                type="text"
                                value={formData.suburb}
                                onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                                placeholder="Leeming"
                                className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal/50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">State</label>
                            <select
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-teal/50"
                            >
                                {AU_STATES.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Postcode</label>
                            <input
                                type="text"
                                value={formData.postcode}
                                onChange={(e) => setFormData({ ...formData, postcode: e.target.value.slice(0, 4) })}
                                placeholder="6149"
                                maxLength={4}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal/50 font-mono"
                                required
                            />
                        </div>
                    </div>

                    {/* Property Type & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Property Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-teal/50"
                            >
                                {PROPERTY_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Current Status</label>
                            <select
                                value={formData.propertyStatus}
                                onChange={(e) => setFormData({ ...formData, propertyStatus: e.target.value as PropertyStatus })}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-teal/50"
                            >
                                {PROPERTY_STATUSES.map(status => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Financials */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Purchase Date</label>
                            <input
                                type="date"
                                value={formData.purchaseDate}
                                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-teal/50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Purchase Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={formData.purchasePrice}
                                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                                    placeholder="485000"
                                    className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 pl-8 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal/50"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Current Value</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={formData.currentValue}
                                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                                    placeholder="720000"
                                    className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 pl-8 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal/50"
                                    required
                                />
                            </div>
                        </div>
                        {formData.type === 'investment' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Weekly Rent</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={formData.weeklyRent}
                                        onChange={(e) => setFormData({ ...formData, weeklyRent: e.target.value })}
                                        placeholder="550"
                                        className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 pl-8 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal/50"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Archived Status */}
                    {property?.status === 'archived' && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between">
                            <span className="text-yellow-400 font-medium">This property is archived</span>
                            <button
                                type="button"
                                onClick={handleRestore}
                                className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 text-sm font-bold"
                            >
                                <RotateCcw size={16} />
                                Restore
                            </button>
                        </div>
                    )}

                    {/* Delete Confirmation */}
                    {showDeleteConfirm && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <p className="text-red-400 mb-3">Are you sure you want to delete this property? All linked accounts and transactions will be unlinked.</p>
                            <div className="flex gap-2">
                                <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600">
                                    Yes, Delete
                                </button>
                                <button type="button" onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-dark-border text-white rounded-lg font-bold text-sm hover:bg-dark-bg">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-dark-border bg-dark-bg/50 shrink-0">
                    <div className="flex gap-2">
                        {mode === 'edit' && property && (
                            <>
                                <button type="button" onClick={handleArchive} className="h-11 px-4 bg-dark-bg border border-dark-border rounded-xl text-gray-400 hover:text-white hover:border-white/30 transition-all flex items-center gap-2 text-sm font-medium">
                                    <Archive size={16} />
                                    Archive
                                </button>
                                <button type="button" onClick={() => setShowDeleteConfirm(true)} className="h-11 px-4 bg-dark-bg border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2 text-sm font-medium">
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="h-11 px-6 bg-dark-bg border border-dark-border rounded-xl text-white font-medium hover:bg-dark-card-hover transition-colors">
                            Cancel
                        </button>
                        <button type="submit" onClick={handleSubmit} className="h-11 px-6 bg-accent-teal text-dark-bg rounded-xl font-bold hover:shadow-lg hover:shadow-accent-teal/20 transition-all">
                            {mode === 'create' ? 'Add Property' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
