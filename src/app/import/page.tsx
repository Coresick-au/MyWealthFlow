'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CsvDropzone, TransactionFlowStation } from '@/components'
import { parseCSV, ParsedTransaction, getSupportedBanks } from '@/lib/csv-parser'
import { useData } from '@/lib/context/DataContext'
import { BankCode, BANKS } from '@/lib/types'
import {
    ArrowLeft,
    FileSpreadsheet,
    CheckCircle2,
    AlertCircle,
    Database
} from 'lucide-react'
import Link from 'next/link'

type ImportState = 'upload' | 'review' | 'success'

export default function ImportPage() {
    const { getTransactions, addTransaction, getProperties } = useData()
    const router = useRouter()

    // State
    const [state, setState] = useState<ImportState>('upload')
    const [transactions, setTransactions] = useState<ParsedTransaction[]>([])
    const [detectedBank, setDetectedBank] = useState<BankCode | null>(null)
    const [importedCount, setImportedCount] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [duplicateCount, setDuplicateCount] = useState(0)

    // Get real properties
    const properties = getProperties(false)

    // Construct entities list dynamically
    const entities = [
        // Standard Entites
        { id: 'ent-personal', type: 'personal' as const, name: 'Personal', icon: '👤' },
        { id: 'ent-work', type: 'work' as const, name: 'Business / Work', icon: '💼' },
        { id: 'ent-family', type: 'family' as const, name: 'Family', icon: '👨‍👩‍👧' },
        // Dynamic Properties
        ...properties.map(p => ({
            id: p.id,
            type: 'property' as const,
            name: p.address,
            icon: '🏠'
        }))
    ]

    const handleFileUpload = async (files: File[]) => {
        try {
            setError(null)
            let allTransactions: ParsedTransaction[] = []
            let detectedBanks = new Set<BankCode>()
            let totalDuplicates = 0

            for (const file of files) {
                const text = await file.text()
                const result = parseCSV(text)

                if (!result.success) {
                    console.warn(`Failed to parse ${file.name}: ${result.error}`)
                    continue
                }

                if (result.transactions.length > 0) {
                    if (result.bank) detectedBanks.add(result.bank)

                    // Filter duplicates against *global* state first
                    const existingTransactions = getTransactions(true)
                    const existingHashes = new Set(existingTransactions.map(t => t.externalHash))

                    const newTxns = result.transactions.filter(t => !existingHashes.has(t.id))
                    totalDuplicates += (result.transactions.length - newTxns.length)

                    allTransactions = [...allTransactions, ...newTxns]
                }
            }

            if (allTransactions.length === 0 && totalDuplicates > 0) {
                setError(`All transactions from ${files.length} file(s) were duplicates.`)
                return
            }

            if (allTransactions.length === 0) {
                setError('No valid transactions found in the uploaded files.')
                return
            }

            // Deduplicate within the batch itself (if multiple files contain same txns)
            const uniqueBatchTxns: ParsedTransaction[] = []
            const batchHashes = new Set<string>()

            for (const txn of allTransactions) {
                if (!batchHashes.has(txn.id)) {
                    batchHashes.add(txn.id)
                    uniqueBatchTxns.push(txn)
                } else {
                    totalDuplicates++
                }
            }

            setDuplicateCount(totalDuplicates)
            // If multiple banks detected, we can either set detectedBank to one of them 
            // or null (Logic in FlowStation might handle null fine?)
            // For now, if 1 bank, use it. If multiple, use null (mixed).
            const bank = detectedBanks.size === 1 ? Array.from(detectedBanks)[0] : null
            setDetectedBank(bank)

            setTransactions(uniqueBatchTxns)
            setState('review')
        } catch (err) {
            setError('Failed to process files.')
            console.error(err)
        }
    }

    const saveTransactions = (txs: ParsedTransaction[]) => {
        // Map and save
        txs.forEach(t => {
            addTransaction({
                externalHash: t.id,
                accountId: 'temp_account_id', // TODO: Map to real account
                date: t.date,
                amount: t.amount,
                rawDescription: t.rawDescription,
                cleanDescription: t.description,
                bank: t.bank,
                importedAt: new Date(),
                isAllocated: false,
                needsReview: true,
                allocations: []
            })
        })
    }

    const handleApprove = (approvedTransactions: ParsedTransaction[]) => {
        saveTransactions(approvedTransactions)
        setImportedCount(approvedTransactions.length)
        setState('success')
    }



    const handleCancel = () => {
        setTransactions([])
        setDetectedBank(null)
        setDuplicateCount(0)
        setState('upload')
    }

    const resetImport = () => {
        setTransactions([])
        setDetectedBank(null)
        setImportedCount(0)
        setDuplicateCount(0)
        setState('upload')
        setError(null)
    }

    // Show Transaction Flow Station in review mode
    if (state === 'review') {
        return (
            <div className="relative">
                {duplicateCount > 0 && (
                    <div className="bg-accent-teal/10 border-b border-accent-teal/20 p-2 text-center text-accent-teal text-sm">
                        filtered out {duplicateCount} duplicate transactions
                    </div>
                )}
                <TransactionFlowStation
                    transactions={transactions}
                    properties={properties}
                    entities={entities}
                    detectedBank={detectedBank}
                    onApprove={handleApprove}
                    onCancel={handleCancel}
                />
            </div>
        )
    }

    // Bank info with support status
    const bankInfo = [
        { code: 'CBA' as BankCode, name: 'Commonwealth Bank', supported: true },
        { code: 'NAB' as BankCode, name: 'NAB', supported: true },
        { code: 'ANZ' as BankCode, name: 'ANZ', supported: false },
        { code: 'WBC' as BankCode, name: 'Westpac', supported: false },
    ]

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
                <div className="flex items-center gap-4 px-8 py-4">
                    <Link
                        href="/"
                        className="p-2 text-gray-400 hover:text-white hover:bg-dark-card-hover rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Import Transactions</h1>
                        <p className="text-sm text-gray-500">Upload bank CSV files - auto-detects bank format</p>
                    </div>
                </div>
            </header>

            <div className="p-8 max-w-4xl mx-auto">
                {state === 'upload' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Upload Section */}
                        <div className="bg-dark-card rounded-2xl p-8 border border-dark-border">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-accent-teal/20 rounded-xl flex items-center justify-center">
                                    <FileSpreadsheet className="text-accent-teal" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Upload Bank CSV</h2>
                                    <p className="text-gray-400 text-sm">Auto-detects CommBank, NAB, and more</p>
                                </div>
                            </div>

                            <CsvDropzone onUpload={handleFileUpload} />

                            {error && (
                                <div className="mt-4 flex items-center gap-3 p-4 bg-accent-coral/10 border border-accent-coral/30 rounded-xl">
                                    <AlertCircle className="text-accent-coral flex-shrink-0" size={20} />
                                    <p className="text-accent-coral text-sm">{error}</p>
                                </div>
                            )}
                        </div>

                        {/* Supported Banks with Brand Colors */}
                        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
                            <h3 className="text-lg font-semibold text-white mb-4">Supported Banks</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {bankInfo.map((bank) => (
                                    <div
                                        key={bank.code}
                                        className={`p-4 rounded-xl border ${bank.supported
                                            ? 'border-accent-lime/30 bg-accent-lime/5'
                                            : 'border-dark-border bg-dark-card-hover'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <BankBadge bankCode={bank.code} />
                                        </div>
                                        <p className={`font-medium text-sm ${bank.supported ? 'text-white' : 'text-gray-400'}`}>
                                            {bank.name}
                                        </p>
                                        <p className={`text-xs mt-1 ${bank.supported ? 'text-accent-lime' : 'text-gray-500'}`}>
                                            {bank.supported ? '✓ Auto-detect' : 'Coming soon'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
                            <h3 className="text-lg font-semibold text-white mb-4">How to Export from Your Bank</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <BankBadge bankCode="CBA" />
                                        <span className="text-white font-medium">CommBank</span>
                                    </div>
                                    <ol className="space-y-2 text-gray-400 text-sm">
                                        <li>1. NetBank → Account → Export</li>
                                        <li>2. Choose CSV format</li>
                                        <li>3. Select date range</li>
                                    </ol>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <BankBadge bankCode="NAB" />
                                        <span className="text-white font-medium">NAB</span>
                                    </div>
                                    <ol className="space-y-2 text-gray-400 text-sm">
                                        <li>1. Internet Banking → Account</li>
                                        <li>2. Download transactions</li>
                                        <li>3. Choose CSV format</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {state === 'success' && (
                    <div className="animate-fade-in">
                        <div className="bg-dark-card rounded-2xl p-12 border border-accent-lime/30 text-center">
                            <div className="w-20 h-20 bg-accent-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="text-accent-lime" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Import Complete!</h2>

                            {detectedBank && (
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <span className="text-gray-400">Bank detected:</span>
                                    <BankBadge bankCode={detectedBank} />
                                </div>
                            )}

                            <p className="text-gray-400 mb-8">
                                Successfully imported {importedCount} transactions
                            </p>

                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={resetImport}
                                    className="px-6 py-3 bg-dark-card-hover border border-dark-border rounded-xl text-white hover:bg-dark-border transition-colors"
                                >
                                    Import More
                                </button>
                                <Link
                                    href="/transactions"
                                    className="flex items-center gap-2 px-6 py-3 bg-accent-lime text-dark-bg font-bold rounded-xl hover:shadow-lg hover:shadow-accent-lime/30 transition-all"
                                >
                                    <Database size={18} />
                                    View Transactions
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
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
