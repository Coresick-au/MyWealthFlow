'use client'

import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { BankSummary } from '@/components/features/BankSummary'
import { AccountCard } from '@/components/features/AccountCard'
import { AccountModal } from '@/components/modals/AccountModal'
import { useData, AccountRecord } from '@/lib/context/DataContext'
import { BankCode, BANKS } from '@/lib/types'

const TANKS = ['All Tanks', 'Work', 'Property', 'Sole', 'Holding', 'Personal']

export default function AccountsPage() {
    const { getAccounts, getProperties } = useData()

    const [activeTank, setActiveTank] = useState('All Tanks')
    const [searchQuery, setSearchQuery] = useState('')
    const [displayActiveOnly, setDisplayActiveOnly] = useState(true)
    const [showArchived, setShowArchived] = useState(false)

    // Modal state
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<AccountRecord | undefined>()
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

    // Get accounts from context
    const accounts = getAccounts(!displayActiveOnly || showArchived)
    const properties = getProperties()

    // Calculate bank counts
    const bankCounts = accounts.reduce((acc, account) => {
        const bankCode = account.bankId as BankCode
        acc[bankCode] = (acc[bankCode] || 0) + 1
        return acc
    }, {} as Record<BankCode, number>)

    const banks = Object.entries(bankCounts).map(([code, count]) => ({
        code: code as BankCode,
        accountCount: count
    }))

    // Filter accounts
    const filteredAccounts = accounts.filter(acc => {
        const matchesSearch = acc.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.accountNumber.includes(searchQuery)
        return matchesSearch
    })

    const handleAddAccount = () => {
        setSelectedAccount(undefined)
        setModalMode('create')
        setModalOpen(true)
    }

    const handleEditAccount = (account: AccountRecord) => {
        setSelectedAccount(account)
        setModalMode('edit')
        setModalOpen(true)
    }

    const getPropertyName = (propertyId?: string) => {
        if (!propertyId) return undefined
        const property = properties.find(p => p.id === propertyId)
        return property?.address
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex bg-dark-card p-1 rounded-xl border border-dark-border gap-1">
                    {TANKS.map(tank => (
                        <button
                            key={tank}
                            onClick={() => setActiveTank(tank)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTank === tank
                                    ? 'bg-accent-teal text-dark-bg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tank}
                        </button>
                    ))}
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
                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Only</span>
                        <button
                            onClick={() => setDisplayActiveOnly(!displayActiveOnly)}
                            className={`w-10 h-5 rounded-full transition-colors relative ${displayActiveOnly ? 'bg-accent-teal' : 'bg-dark-border'}`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${displayActiveOnly ? 'translate-x-5' : ''}`} />
                        </button>
                    </label>
                </div>
            </div>

            {/* Bank Summary Cards */}
            <BankSummary
                banks={banks.length > 0 ? banks : [{ code: 'CBA', accountCount: 0 }]}
                onAddBank={handleAddAccount}
            />

            {/* Search Bar */}
            <div className="relative mb-8">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={20} className="text-gray-500" />
                </div>
                <input
                    type="text"
                    placeholder="Search accounts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-dark-card border border-dark-border rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal/50 transition-colors"
                />
            </div>

            {/* Accounts Grid */}
            {filteredAccounts.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 mb-4">No accounts found. Add your first account to get started.</p>
                    <button
                        onClick={handleAddAccount}
                        className="bg-accent-teal text-dark-bg px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-accent-teal/20 transition-all inline-flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Account
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAccounts.map(account => (
                        <div key={account.id} onClick={() => handleEditAccount(account)} className="cursor-pointer">
                            <AccountCard
                                account={account}
                                bankBalance={0}
                                appBalance={0}
                                reconcileCount={0}
                                linkedPropertyName={getPropertyName(account.linkedPropertyId)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Account Modal */}
            <AccountModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                account={selectedAccount}
                mode={modalMode}
            />
        </div>
    )
}
