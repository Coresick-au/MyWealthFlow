'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { BankSummary } from '@/components/features/BankSummary'
import { AccountCard } from '@/components/features/AccountCard'
import { Account, BankCode } from '@/lib/types'

// Mock Data matching the user's provided design reference
const MOCK_ACCOUNTS: (Account & { bankBalance: number, appBalance: number, reconcileCount: number, propertyName?: string })[] = [
    {
        id: 'acc-1',
        bankId: 'CBA',
        accountNumber: 'xxxx4189',
        type: 'loan',
        nickname: '11 Tobruk Cres Mortgage',
        isActive: true,
        createdAt: new Date(),
        bankBalance: -141022.29,
        appBalance: -140299.32,
        reconcileCount: 0,
        propertyName: '11 TOBRUK CRESCENT'
    },
    {
        id: 'acc-2',
        bankId: 'CBA',
        accountNumber: 'xxxx0049',
        type: 'loan',
        nickname: '29 Wickham St Brighton',
        isActive: true,
        createdAt: new Date(),
        bankBalance: -435455.51,
        appBalance: -438711.34,
        reconcileCount: 3,
        propertyName: '29 WICKHAM STREET'
    },
    {
        id: 'acc-3',
        bankId: 'CBA',
        accountNumber: 'xxxx0752',
        type: 'offset',
        nickname: '29 Wickham Offset',
        isActive: true,
        createdAt: new Date(),
        bankBalance: 0.00,
        appBalance: 0.00,
        reconcileCount: 0,
        propertyName: '29 WICKHAM STREET'
    },
    {
        id: 'acc-4',
        bankId: 'CBA',
        accountNumber: 'xxxx7886',
        type: 'transaction',
        nickname: 'Brad Leeming Personal Commbank',
        isActive: true,
        createdAt: new Date(),
        bankBalance: 1918.54,
        appBalance: 19848.28,
        reconcileCount: 71,
        propertyName: '69 BLACKWOOD ROAD'
    },
    {
        id: 'acc-5',
        bankId: 'CBA',
        accountNumber: 'xxxx4427',
        type: 'transaction',
        nickname: 'Blackwood Joint',
        isActive: true,
        createdAt: new Date(),
        bankBalance: 52558.88,
        appBalance: 21226.47,
        reconcileCount: 22,
        propertyName: '69 BLACKWOOD ROAD'
    },
    {
        id: 'acc-6',
        bankId: 'CBA',
        accountNumber: 'xxxx6285',
        type: 'transaction',
        nickname: 'Commonwealth Direct Investment Account',
        isActive: true,
        createdAt: new Date(),
        bankBalance: 125.15,
        appBalance: 125.16,
        reconcileCount: 0,
        propertyName: 'Work Tank'
    },
    {
        id: 'acc-7',
        bankId: 'NAB',
        accountNumber: 'xxxx8590',
        type: 'loan',
        nickname: 'Blackwood Rd Mortgage - NAB',
        isActive: true,
        createdAt: new Date(),
        bankBalance: -273817.65,
        appBalance: -277070.55,
        reconcileCount: 5
    },
    {
        id: 'acc-8',
        bankId: 'NAB',
        accountNumber: 'xxxx3675',
        type: 'offset',
        nickname: 'Blackwood Rd Offset - NAB',
        isActive: true,
        createdAt: new Date(),
        bankBalance: 273946.20,
        appBalance: 277223.10,
        reconcileCount: 6
    },
    {
        id: 'acc-9',
        bankId: 'NAB',
        accountNumber: 'xxxx8014',
        type: 'loan',
        nickname: '16 Beddoe Rd Mortgage',
        isActive: true,
        createdAt: new Date(),
        bankBalance: -432000.00,
        appBalance: 0.00,
        reconcileCount: 4
    }
]

const TANKS = ['All Tanks', 'Work', 'Property', 'Sole', 'Holding', 'Personal']

export default function AccountsPage() {
    const [activeTank, setActiveTank] = useState('All Tanks')
    const [searchQuery, setSearchQuery] = useState('')
    const [displayActiveOnly, setDisplayActiveOnly] = useState(true)

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
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Display Active Bank Accounts only</span>
                        <button
                            onClick={() => setDisplayActiveOnly(!displayActiveOnly)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${displayActiveOnly ? 'bg-accent-teal' : 'bg-dark-border'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${displayActiveOnly ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bank Summary Cards */}
            <BankSummary
                banks={[
                    { code: 'CBA', accountCount: 7 },
                    { code: 'NAB', accountCount: 6 }
                ]}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_ACCOUNTS.filter(acc =>
                    acc.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    acc.accountNumber.includes(searchQuery)
                ).map(account => (
                    <AccountCard
                        key={account.id}
                        account={account}
                        bankBalance={account.bankBalance}
                        appBalance={account.appBalance}
                        reconcileCount={account.reconcileCount}
                        linkedPropertyName={account.propertyName}
                        onReconcile={() => window.location.href = '/import'}
                    />
                ))}
            </div>
        </div>
    )
}
