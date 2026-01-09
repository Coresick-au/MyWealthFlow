'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Calendar, DollarSign, Tag } from 'lucide-react'
import { useData, TransactionRecord } from '@/lib/context/DataContext'
import { parseAustralianDate } from '@/lib/csv-parser/bank-strategy'

interface EditTransactionModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: TransactionRecord | null
}

const CATEGORIES = ['Groceries', 'Fuel', 'Utilities', 'Interest on Loans', 'Rental Income', 'Council Rates', 'Repairs & Maintenance', 'Transfer - Family', 'Eating Out', 'Entertainment', 'Transport', 'Insurance', 'Personal Care', 'Medical', 'Gifts', 'Investments']

export function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
    const { updateTransaction, deleteTransaction } = useData()

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        date: '',
        category: 'Uncategorised'
    })

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        if (transaction && isOpen) {
            setFormData({
                description: transaction.cleanDescription || transaction.rawDescription,
                amount: Math.abs(transaction.amount).toFixed(2),
                date: new Date(transaction.date).toISOString().split('T')[0],
                category: transaction.allocations?.[0]?.categoryId || 'Uncategorised'
            })
            setShowDeleteConfirm(false)
        }
    }, [transaction, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!transaction) return

        const amountNum = parseFloat(formData.amount) * (transaction.amount < 0 ? -1 : 1) // Preserve sign roughly (assuming user just edits magnitude, but if they change sign logic is tricky. Let's assume magnitude edit for now or let them override)
        // Actually, if it's an expense, it should stay negative unless logic changes. 
        // Let's rely on the original sign logic: if original was negative, keep negative. 
        // If user wants to flip a refund to expense, we need a toggle. For now, strict magnitude edit.

        // Better: Check if user typed negative.
        // But input type="number" step="0.01".
        // Let's just take the magnitude and apply original sign.
        const finalAmount = transaction.amount < 0 ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount))

        updateTransaction(transaction.id, {
            cleanDescription: formData.description,
            amount: finalAmount,
            date: new Date(formData.date),
            allocations: formData.category !== 'Uncategorised' ? [{
                id: `alloc_${Date.now()}`,
                transactionId: transaction.id,
                entityId: 'ent-personal', // Default to personal for simple categorization
                categoryId: formData.category,
                amount: Math.abs(finalAmount),
                claimPercent: 100
            }] : []
        })
        onClose()
    }

    const handleDelete = () => {
        if (transaction) {
            deleteTransaction(transaction.id)
            onClose()
        }
    }

    if (!isOpen || !transaction) return null

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-border">
                    <h2 className="text-xl font-bold text-white">
                        Edit Transaction
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Date Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</label>
                        <div className="relative">
                            <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent-teal/50"
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-teal/50"
                            required
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Amount</label>
                        <div className="relative">
                            <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 pl-12 pr-4 text-white font-mono focus:outline-none focus:border-accent-teal/50"
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                        <div className="relative">
                            <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent-teal/50 appearance-none"
                            >
                                <option value="Uncategorised">Uncategorised</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Delete Confirmation */}
                    {showDeleteConfirm && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-fade-in">
                            <p className="text-red-400 mb-3 text-sm font-medium">Are you sure you want to delete this transaction?</p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-colors"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 bg-dark-border text-white rounded-lg font-bold text-sm hover:bg-dark-bg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between p-6 border-t border-dark-border bg-dark-bg/50">
                    <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="h-11 px-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-2 text-sm font-bold"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 px-6 bg-dark-bg border border-dark-border rounded-xl text-white font-medium hover:bg-dark-card-hover transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="h-11 px-6 bg-accent-teal text-dark-bg rounded-xl font-bold hover:shadow-lg hover:shadow-accent-teal/20 transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
