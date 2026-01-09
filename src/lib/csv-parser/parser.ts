// CSV Parser Factory - Strategy Pattern
// Detects bank format and uses appropriate parser

import { BankCode } from '../types'
import {
    BankStrategy,
    parseCSVToArrays,
    generateTransactionHash,
    parseAustralianDate
} from './bank-strategy'
import { CommBankStrategy } from './strategies/commbank'
import { NabStrategy } from './strategies/nab'
import { guessCategory } from './category-guesser'

// Register all strategies (order matters - more specific first)
const STRATEGIES: BankStrategy[] = [
    new CommBankStrategy(), // CommBank first as it's simpler format
    new NabStrategy(),
    // Add more: new AnzStrategy(), new WestpacStrategy()
]

export interface ParseResult {
    success: boolean
    bank: BankCode | null
    transactions: ParsedTransaction[]
    error?: string
    debug?: string
}

export interface ParsedTransaction {
    id: string
    date: Date
    dateString: string
    amount: number
    description: string
    rawDescription: string
    bank: BankCode
    isIncome: boolean
    suggestedCategory: string
    balance?: number
}

/**
 * Detect which bank the CSV is from based on content
 */
export function detectBank(rows: string[][]): BankStrategy | null {
    for (const strategy of STRATEGIES) {
        if (strategy.canHandle(rows)) {
            return strategy
        }
    }
    return null
}

/**
 * Parse any supported bank CSV
 */
export function parseCSV(csvText: string, accountId?: string): ParseResult {
    // Parse into arrays
    const rows = parseCSVToArrays(csvText)

    if (rows.length === 0) {
        return {
            success: false,
            bank: null,
            transactions: [],
            error: 'Empty or invalid CSV file'
        }
    }

    // Detect bank
    const strategy = detectBank(rows)

    if (!strategy) {
        // For debugging - show what we found
        const firstRow = rows[0] || []
        return {
            success: false,
            bank: null,
            transactions: [],
            error: `Could not detect bank format. Supported: CommBank, NAB.`,
            debug: `First row has ${firstRow.length} columns: ${firstRow.slice(0, 4).join(' | ')}`
        }
    }

    // Determine if we should skip the first row (header)
    const hasHeader = strategy.hasHeaderRow(rows)
    const dataRows = hasHeader ? rows.slice(1) : rows

    const transactions: ParsedTransaction[] = []

    for (const row of dataRows) {
        const parsed = strategy.parseRow(row)
        if (!parsed) continue

        const date = parseAustralianDate(parsed.date)
        if (!date) continue

        const cleanDesc = strategy.cleanDescription(parsed.description)
        const hash = generateTransactionHash(
            parsed.date,
            parsed.amount,
            parsed.description,
            strategy.bankCode,
            accountId
        )

        transactions.push({
            id: hash,
            date,
            dateString: parsed.date,
            amount: parsed.amount,
            description: cleanDesc,
            rawDescription: parsed.description,
            bank: strategy.bankCode,
            isIncome: parsed.amount > 0,
            suggestedCategory: guessCategory(parsed.description),
            balance: parsed.balance
        })
    }

    // Sort by date, newest first
    transactions.sort((a, b) => b.date.getTime() - a.date.getTime())

    return {
        success: true,
        bank: strategy.bankCode,
        transactions
    }
}

/**
 * Get list of supported banks
 */
export function getSupportedBanks(): BankCode[] {
    return STRATEGIES.map(s => s.bankCode)
}
