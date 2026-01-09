// NAB CSV Strategy
// Based on actual NAB export format:
// Date (DD-Mmm-YY), Amount, Account Number, _, Transaction Type, Transaction Details, Balance, Category, Merchant Name
// Has header row

import {
    BankStrategy,
    ParsedRow,
    parseAustralianDate,
    looksLikeDate,
    looksLikeAmount,
    parseAmount
} from '../bank-strategy'
import { BankCode } from '../../types'

export class NabStrategy implements BankStrategy {
    bankCode: BankCode = 'NAB'

    canHandle(firstRows: string[][]): boolean {
        if (firstRows.length === 0) return false

        const firstRow = firstRows[0]
        const firstRowLower = firstRow.map(v => (v || '').toLowerCase().trim())

        // Check for NAB-specific header - "Date" and "Transaction Type" or "Transaction Details"
        const hasDate = firstRowLower.includes('date')
        const hasTransactionType = firstRowLower.some(h => h.includes('transaction type'))
        const hasTransactionDetails = firstRowLower.some(h => h.includes('transaction details'))

        if (hasDate && (hasTransactionType || hasTransactionDetails)) {
            return true
        }

        return false
    }

    hasHeaderRow(firstRows: string[][]): boolean {
        // NAB always has headers in the format we've seen
        if (firstRows.length === 0) return false
        const firstRow = firstRows[0]
        const firstRowLower = firstRow.map(v => (v || '').toLowerCase().trim())
        return firstRowLower.includes('date')
    }

    parseRow(values: string[]): ParsedRow | null {
        // NAB format columns (0-indexed):
        // 0: Date (DD-Mmm-YY)
        // 1: Amount
        // 2: Account Number
        // 3: (empty)
        // 4: Transaction Type
        // 5: Transaction Details (description)
        // 6: Balance
        // 7: Category
        // 8: Merchant Name

        if (values.length < 6) return null

        const dateStr = values[0]?.trim()
        const amountStr = values[1]?.trim()
        const description = values[5]?.trim() || values[4]?.trim() || ''
        const balanceStr = values[6]?.trim()

        // Validate date
        if (!dateStr || !looksLikeDate(dateStr)) return null
        const date = parseAustralianDate(dateStr)
        if (!date) return null

        // Validate amount
        const amount = parseAmount(amountStr)
        if (isNaN(amount)) return null

        // Parse balance if present
        const balance = balanceStr ? parseAmount(balanceStr) : undefined

        return {
            date: dateStr,
            amount,
            description,
            balance: isNaN(balance || NaN) ? undefined : balance
        }
    }

    cleanDescription(description: string): string {
        return description
            .replace(/\s{2,}/g, ' ')
            .replace(/TRANSFER CREDIT\s*/gi, '')
            .replace(/TRANSFER DEBIT\s*/gi, '')
            .replace(/LOAN REPAYMENT\s*/gi, 'Loan Repayment ')
            .replace(/ONLINE\s+[A-Z0-9]+\s*/gi, '')
            .replace(/Linked Acc Trns\s*/gi, 'Transfer ')
            .replace(/\d{8,}/g, '') // Long reference numbers
            .replace(/A\/C\s*/gi, '')
            .replace(/\s+/g, ' ')
            .trim() || description.trim()
    }
}
