'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Archive, RotateCcw } from 'lucide-react'
import { BankCode, BANKS, AccountType } from '@/lib/types'
import { useData, AccountRecord } from '@/lib/context/DataContext'

interface AccountModalProps {
    isOpen: boolean
    onClose: () => void
    account?: AccountRecord // If provided, we're editing
    mode?: 'create' | 'edit' | 'view'
}

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
    { value: 'transaction', label: 'Transaction Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'offset', label: 'Offset Account' },
    { value: 'loan', label: 'Loan Account' },
    { value: 'credit_card', label: 'Credit Card' }
]

export function AccountModal({ isOpen, onClose, account, mode = 'create' }: AccountModalProps) {
    const { addAccount, updateAccount, archiveAccount, deleteAccount, restoreAccount, getProperties } = useData()

    const [formData, setFormData] = useState({
        nickname: '',
        bankId: 'CBA' as BankCode,
        accountNumber: '',
        bsb: '',
        type: 'transaction' as AccountType,
        linkedPropertyId: '',
        isActive: true
    })

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    // Load account data when editing
    useEffect(() => {
        if (account && mode !== 'create') {
            setFormData({
                nickname: account.nickname,
                bankId: account.bankId as BankCode,
                accountNumber: account.accountNumber,
                bsb: account.bsb || '',
                type: account.type,
                linkedPropertyId: account.linkedPropertyId || '',
                isActive: account.isActive
            })
        } else {
            // Reset form for create mode
            setFormData({
                nickname: '',
                bankId: 'CBA',
                accountNumber: '',
                bsb: '',
                type: 'transaction',
                linkedPropertyId: '',
                isActive: true
            })
        }
    }, [account, mode, isOpen])

    const properties = getProperties()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (mode === 'create') {
            addAccount(formData)
        } else if (account) {
            updateAccount(account.id, formData)
        }

        onClose()
    }

    const handleArchive = () => {
        if (account) {
            archiveAccount(account.id)
            onClose()
        }
    }

    const handleRestore = () => {
        if (account) {
            restoreAccount(account.id)
            onClose()
        }
    }

    const handleDelete = () => {
        if (account) {
            deleteAccount(account.id)
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-border">
                    <h2 className="text-xl font-bold text-white">
                        {mode === 'create' ? 'Add New Account' : mode === 'edit' ? 'Edit Account' : 'Account Details'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Nickname */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Account Nickname</label>
                        <input
                            type="text"
                            value={formData.nickname}
                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                            placeholder="e.g., Personal Transaction"
                            className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal/50"
                            required
                        />
                    </div>

                    {/* Bank & Account Number Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Bank</label>
                            <select
                                value={formData.bankId}
                                onChange={(e) => setFormData({ ...formData, bankId: e.target.value as BankCode })}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-teal/50"
                            >
                                {Object.values(BANKS).map(bank => (
                                    <option key={bank.shortCode} value={bank.shortCode}>{bank.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Last 4 Digits</label>
                            <input
                                type="text"
                                value={formData.accountNumber}
                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.slice(0, 4) })}
                                placeholder="1234"
                                maxLength={4}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal/50 font-mono"
                                required
                            />
                        </div>
                    </div>

                    {/* Account Type */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Account Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as AccountType })}
                            className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-teal/50"
                        >
                            {ACCOUNT_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Linked Property (for offset/loan) */}
                    {(formData.type === 'offset' || formData.type === 'loan') && (
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Linked Property</label>
                            <select
                                value={formData.linkedPropertyId}
                                onChange={(e) => setFormData({ ...formData, linkedPropertyId: e.target.value })}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-teal/50"
                            >
                                <option value="">No linked property</option>
                                {properties.map(prop => (
                                    <option key={prop.id} value={prop.id}>{prop.address}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Status Badge (for archived accounts) */}
                    {account?.status === 'archived' && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between">
                            <span className="text-yellow-400 font-medium">This account is archived</span>
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
                            <p className="text-red-400 mb-3">Are you sure you want to delete this account?</p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 bg-dark-border text-white rounded-lg font-bold text-sm hover:bg-dark-bg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer Actions */}
                <div className="flex items-center justify-between p-6 border-t border-dark-border bg-dark-bg/50">
                    <div className="flex gap-2">
                        {mode === 'edit' && account && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleArchive}
                                    className="px-4 py-2 bg-dark-bg border border-dark-border rounded-xl text-gray-400 hover:text-white hover:border-white/30 transition-all flex items-center gap-2 text-sm font-medium"
                                >
                                    <Archive size={16} />
                                    Archive
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-4 py-2 bg-dark-bg border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2 text-sm font-medium"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 bg-dark-bg border border-dark-border rounded-xl text-white font-medium hover:bg-dark-card-hover transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="px-6 py-2.5 bg-accent-teal text-dark-bg rounded-xl font-bold hover:shadow-lg hover:shadow-accent-teal/20 transition-all"
                        >
                            {mode === 'create' ? 'Add Account' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
