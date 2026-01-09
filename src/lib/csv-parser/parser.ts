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

    console.log('[CSV Parser] Total rows:', rows.length)
    console.log('[CSV Parser] First row:', rows[0])

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

    console.log('[CSV Parser] Detected bank:', strategy?.bankCode || 'NONE')

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

    console.log('[CSV Parser] Has header:', hasHeader, '| Data rows:', dataRows.length)
    if (dataRows.length > 0) {
        console.log('[CSV Parser] First data row:', dataRows[0])
    }

    const transactions: ParsedTransaction[] = []
    let parseFailures = 0

    for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i]
        const parsed = strategy.parseRow(row)

        if (!parsed) {
            parseFailures++
            if (i < 3) {
                console.log('[CSV Parser] Failed to parse row', i, ':', row.slice(0, 6))
            }
            continue
        }

        const date = parseAustralianDate(parsed.date)
        if (!date) {
            console.log('[CSV Parser] Failed to parse date:', parsed.date)
            continue
        }

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

    console.log('[CSV Parser] Successfully parsed:', transactions.length, '| Failed:', parseFailures)

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
