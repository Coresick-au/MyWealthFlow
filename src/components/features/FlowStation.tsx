'use client'

import { useState, useMemo } from 'react'
import {
    Check,
    ChevronDown,
    Sparkles,
    FileSpreadsheet,
    Home,
    Trash2,
    User,
    Briefcase,
    Users
} from 'lucide-react'
import { ParsedTransaction, CATEGORIES } from '@/lib/csv-parser'
import { BankCode, EntityType } from '@/lib/types'

// Entity type for allocation
interface Entity {
    id: string
    type: EntityType
    name: string
    icon?: string
}

interface FlowStationProps {
    transactions: ParsedTransaction[]
    properties?: Array<{ id: string; address: string }>
    entities?: Entity[]
    detectedBank?: BankCode | null
    onApprove: (transactions: ParsedTransaction[]) => void
    onCancel: () => void
}

// Extended transaction with allocation info
interface FlowStationTransaction extends ParsedTransaction {
    approved: boolean
    entityId?: string
    propertyId?: string
}

export function TransactionFlowStation({
    transactions: initialTransactions,
    properties = [],
    entities = [],
    detectedBank,
    onApprove,
    onCancel
}: FlowStationProps) {
    const [transactions, setTransactions] = useState<FlowStationTransaction[]>(
        initialTransactions.map(t => ({ ...t, approved: true }))
    )
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

    const filteredTransactions = useMemo(() => {
        switch (filter) {
            case 'income':
                return transactions.filter(t => t.isIncome)
            case 'expense':
                return transactions.filter(t => !t.isIncome)
            default:
                return transactions
        }
    }, [transactions, filter])

    const stats = useMemo(() => {
        const approved = transactions.filter(t => t.approved)
        const income = approved.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0)
        const expenses = approved.filter(t => !t.isIncome).reduce((sum, t) => sum + Math.abs(t.amount), 0)
        return {
            total: transactions.length,
            approved: approved.length,
            income,
            expenses,
            net: income - expenses
        }
    }, [transactions])

    const updateTransaction = (id: string, updates: Partial<FlowStationTransaction>) => {
        setTransactions(prev =>
            prev.map(t => t.id === id ? { ...t, ...updates } : t)
        )
    }

    const toggleApproval = (id: string) => {
        updateTransaction(id, {
            approved: !transactions.find(t => t.id === id)?.approved
        })
    }

    const approveAll = () => {
        setTransactions(prev => prev.map(t => ({ ...t, approved: true })))
    }

    const removeTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id))
    }

    const handleSubmit = () => {
        const approvedTransactions = transactions.filter(t => t.approved)
        onApprove(approvedTransactions)
    }

    return (
        <div className="min-h-screen bg-dark-bg p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent-purple/20 rounded-xl flex items-center justify-center">
                            <FileSpreadsheet className="text-accent-purple" size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-white">Transaction Flow Station</h1>
                                {detectedBank && <BankBadge bankCode={detectedBank} />}
                            </div>
                            <p className="text-gray-400 text-sm">Review & categorize {stats.total} transactions</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 bg-dark-card rounded-xl p-1">
                        {(['all', 'income', 'expense'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === f
                                    ? 'bg-accent-lime text-dark-bg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">To Import</p>
                        <p className="text-2xl font-bold text-white mt-1">{stats.approved}</p>
                    </div>
                    <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Income</p>
                        <p className="text-2xl font-bold text-accent-lime mt-1">
                            +${stats.income.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Expenses</p>
                        <p className="text-2xl font-bold text-white mt-1">
                            -${stats.expenses.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Net</p>
                        <p className={`text-2xl font-bold mt-1 ${stats.net >= 0 ? 'text-accent-lime' : 'text-accent-coral'}`}>
                            ${stats.net.toLocaleString('en-AU', { minimumFractionDigits: 2, signDisplay: 'always' })}
                        </p>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="space-y-3 mb-24">
                    {filteredTransactions.map((transaction) => (
                        <TransactionCard
                            key={transaction.id}
                            transaction={transaction}
                            properties={properties}
                            entities={entities}
                            onUpdate={(updates) => updateTransaction(transaction.id, updates)}
                            onToggleApproval={() => toggleApproval(transaction.id)}
                            onRemove={() => removeTransaction(transaction.id)}
                        />
                    ))}
                </div>

                {/* Floating Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-dark-card/95 backdrop-blur-lg border-t border-dark-border p-4">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <button
                            onClick={onCancel}
                            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={approveAll}
                                className="flex items-center gap-2 px-5 py-3 bg-dark-card-hover border border-dark-border rounded-xl text-white hover:bg-dark-border transition-colors"
                            >
                                <Sparkles size={18} className="text-accent-purple" />
                                Approve All
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-8 py-3 bg-accent-lime text-dark-bg font-bold rounded-xl hover:shadow-lg hover:shadow-accent-lime/30 transition-all"
                            >
                                <Check size={20} />
                                Import {stats.approved} Transactions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Bank Badge Component
function BankBadge({ bankCode }: { bankCode: BankCode }) {
    const colors: Record<BankCode, string> = {
        CBA: 'bg-yellow-400 text-black',
        NAB: 'bg-red-600 text-white',
        ANZ: 'bg-blue-600 text-white',
        WBC: 'bg-red-700 text-white',
    }

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${colors[bankCode]}`}>
            {bankCode}
        </span>
    )
}

// Entity Type Icons
const entityIcons: Record<EntityType, typeof Home> = {
    property: Home,
    personal: User,
    work: Briefcase,
    family: Users,
}

// Individual Transaction Card
interface TransactionCardProps {
    transaction: FlowStationTransaction
    properties: Array<{ id: string; address: string }>
    entities: Entity[]
    onUpdate: (updates: Partial<FlowStationTransaction>) => void
    onToggleApproval: () => void
    onRemove: () => void
}

function TransactionCard({
    transaction,
    properties,
    entities,
    onUpdate,
    onToggleApproval,
    onRemove
}: TransactionCardProps) {
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
    const [showEntityDropdown, setShowEntityDropdown] = useState(false)

    const selectedEntity = entities.find(e => e.id === transaction.entityId)

    return (
        <div
            className={`
        bg-dark-card rounded-xl border transition-all
        ${transaction.approved
                    ? 'border-dark-border'
                    : 'border-accent-coral/30 opacity-60'
                }
      `}
        >
            <div className="flex items-center p-4 gap-4">
                {/* Approval Toggle */}
                <button
                    onClick={onToggleApproval}
                    className={`
            w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0
            ${transaction.approved
                            ? 'bg-accent-lime text-dark-bg'
                            : 'bg-dark-card-hover border border-dark-border text-gray-400'
                        }
          `}
                >
                    {transaction.approved ? <Check size={16} /> : null}
                </button>

                {/* Bank Badge */}
                <div className="w-10 flex-shrink-0">
                    <BankBadge bankCode={transaction.bank} />
                </div>

                {/* Date */}
                <div className="w-20 flex-shrink-0">
                    <p className="text-sm text-gray-400">{transaction.dateString}</p>
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{transaction.description}</p>
                    {transaction.description !== transaction.rawDescription && (
                        <p className="text-xs text-gray-500 truncate">{transaction.rawDescription}</p>
                    )}
                </div>

                {/* Entity Dropdown (Property/Personal/Work/Family) */}
                {entities.length > 0 && (
                    <div className="relative w-40 flex-shrink-0">
                        <button
                            onClick={() => setShowEntityDropdown(!showEntityDropdown)}
                            className="w-full flex items-center justify-between px-3 py-2 bg-dark-card-hover rounded-lg border border-dark-border text-sm text-gray-400 hover:border-accent-teal/50 transition-colors"
                        >
                            {selectedEntity ? (
                                <>
                                    <span className="mr-1">{selectedEntity.icon || '📁'}</span>
                                    <span className="truncate">{selectedEntity.name.split(' ')[0]}</span>
                                </>
                            ) : (
                                <>
                                    <Home size={14} className="flex-shrink-0" />
                                    <span className="truncate mx-2">Allocate</span>
                                </>
                            )}
                            <ChevronDown size={14} className="flex-shrink-0" />
                        </button>

                        {showEntityDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-dark-card border border-dark-border rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                                <button
                                    onClick={() => {
                                        onUpdate({ entityId: undefined })
                                        setShowEntityDropdown(false)
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-dark-card-hover"
                                >
                                    None
                                </button>
                                {entities.map((entity) => (
                                    <button
                                        key={entity.id}
                                        onClick={() => {
                                            onUpdate({ entityId: entity.id })
                                            setShowEntityDropdown(false)
                                        }}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-dark-card-hover transition-colors flex items-center gap-2 ${entity.id === transaction.entityId ? 'text-accent-teal' : 'text-white'
                                            }`}
                                    >
                                        <span>{entity.icon || '📁'}</span>
                                        {entity.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Category Dropdown */}
                <div className="relative w-40 flex-shrink-0">
                    <button
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-dark-card-hover rounded-lg border border-dark-border text-sm text-white hover:border-accent-purple/50 transition-colors"
                    >
                        <span className="truncate">{transaction.suggestedCategory}</span>
                        <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                    </button>

                    {showCategoryDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-dark-card border border-dark-border rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        onUpdate({ suggestedCategory: cat })
                                        setShowCategoryDropdown(false)
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-dark-card-hover transition-colors ${cat === transaction.suggestedCategory ? 'text-accent-lime' : 'text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Amount */}
                <div className="w-28 text-right flex-shrink-0">
                    <p className={`font-bold text-lg ${transaction.isIncome ? 'text-accent-lime' : 'text-white'
                        }`}>
                        {transaction.isIncome ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                </div>

                {/* Remove Button */}
                <button
                    onClick={onRemove}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-accent-coral hover:bg-accent-coral/10 transition-colors flex-shrink-0"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    )
}
