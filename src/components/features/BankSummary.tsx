'use client'

import { BankCode, BANKS } from '@/lib/types'

interface BankSummaryProps {
    banks: Array<{
        code: BankCode
        accountCount: number
    }>
    onAddBank?: () => void
}

export function BankSummary({ banks, onAddBank }: BankSummaryProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex gap-4">
                {banks.map((bankItem) => {
                    const bank = BANKS[bankItem.code]
                    return (
                        <div
                            key={bankItem.code}
                            className="bg-dark-card border border-dark-border rounded-xl px-5 py-3 flex items-center gap-4 hover:border-white/20 transition-colors cursor-pointer"
                        >
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs"
                                style={{ backgroundColor: bank.color, color: '#000' }}
                            >
                                {bank.shortCode}
                            </div>
                            <div>
                                <p className="text-white font-bold">{bankItem.accountCount} account(s)</p>
                                <p className="text-xs text-gray-500 font-medium">{bankItem.code}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <button
                onClick={onAddBank}
                className="bg-accent-teal text-dark-bg px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-accent-teal/20 transition-all flex items-center gap-2"
            >
                <span className="text-xl">+</span> Add Bank
            </button>
        </div>
    )
}
