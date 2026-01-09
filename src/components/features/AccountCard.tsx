'use client'

import { MoreVertical, ExternalLink, AlertTriangle } from 'lucide-react'
import { Account, BANKS, BankCode } from '@/lib/types'

interface AccountCardProps {
    account: Account
    bankBalance: number
    appBalance: number
    reconcileCount: number
    needsReviewCount?: number
    onReconcile?: () => void
    onDetails?: () => void
    linkedPropertyName?: string
}

export function AccountCard({
    account,
    bankBalance,
    appBalance,
    reconcileCount,
    needsReviewCount = 0,
    onReconcile,
    onDetails,
    linkedPropertyName
}: AccountCardProps) {
    const bank = BANKS[account.bankId as BankCode] || BANKS.CBA

    return (
        <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden hover:border-accent-teal/50 transition-all duration-300 group">
            {/* Header */}
            <div className="p-5 flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-dark-bg rounded-xl flex items-center justify-center border border-dark-border group-hover:border-accent-teal/30 transition-colors">
                        {/* Placeholder for real bank logo - using colored circle for now */}
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                            style={{ backgroundColor: bank.color, color: '#000' }}
                        >
                            {bank.shortCode}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white group-hover:text-accent-teal transition-colors line-clamp-1">
                            {account.nickname}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                            {bank.name} ...{account.accountNumber.slice(-4)}
                        </p>
                    </div>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Balances */}
            <div className="px-5 py-4 bg-dark-bg/50 border-y border-dark-border grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Bank Balance</p>
                    <p className="text-lg font-bold text-white mt-1">
                        ${bankBalance.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">MyWealth Balance</p>
                    <p className="text-lg font-bold text-accent-teal mt-1">
                        ${appBalance.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-dark-card flex flex-col gap-3">
                {reconcileCount > 0 || needsReviewCount > 0 ? (
                    <button
                        onClick={onReconcile}
                        className={`w-full py-2.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${needsReviewCount > 0
                            ? 'bg-accent-orange text-dark-bg hover:shadow-lg hover:shadow-accent-orange/20'
                            : 'bg-accent-teal text-dark-bg hover:shadow-lg hover:shadow-accent-teal/20'
                            }`}
                    >
                        {needsReviewCount > 0 ? `Review ${needsReviewCount} Items` : `Reconcile ${reconcileCount} Items`}
                    </button>
                ) : (
                    <button
                        onClick={onDetails}
                        className="w-full py-2.5 bg-dark-card-hover border border-dark-border text-white font-medium rounded-xl hover:bg-dark-border transition-all flex items-center justify-center gap-2"
                    >
                        See Details
                        <ExternalLink size={16} />
                    </button>
                )}

                {linkedPropertyName && (
                    <div className="pt-2 border-t border-dark-border mt-1">
                        <p className="text-[10px] text-accent-lime uppercase font-bold text-center tracking-widest">
                            {linkedPropertyName}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
