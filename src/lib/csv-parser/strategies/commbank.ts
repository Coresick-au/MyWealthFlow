// CommBank CSV Strategy
// CommBank CSVs typically have NO header row
// Format: Date, Amount, Description, Balance (4 columns)
// Example: 30/06/2025,-4.24,Direct Debit PAYPAL AUSTRALIA,1234.56

import {
    BankStrategy,
    ParsedRow,
    parseAustralianDate,
    looksLikeDate,
    looksLikeAmount,
    parseAmount
} from '../bank-strategy'
import { BankCode } from '../../types'

export class CommBankStrategy implements BankStrategy {
    bankCode: BankCode = 'CBA'

    canHandle(firstRows: string[][]): boolean {
        if (firstRows.length === 0) return false

        const firstRow = firstRows[0]

        // CommBank typically has 4 columns: Date, Amount, Description, Balance
        // First column should look like a date, second like an amount
        if (firstRow.length >= 3) {
            const firstCol = firstRow[0]
            const secondCol = firstRow[1]

            // Check if first column is a date and second is an amount
            // This indicates headerless CommBank format
            if (looksLikeDate(firstCol) && looksLikeAmount(secondCol)) {
                return true
            }
        }

        return false
    }

    hasHeaderRow(firstRows: string[][]): boolean {
        // CommBank CSVs typically don't have headers
        // If first row has a date in first column, it's data not headers
        if (firstRows.length === 0) return false
        const firstRow = firstRows[0]
        return !looksLikeDate(firstRow[0])
    }

    parseRow(values: string[]): ParsedRow | null {
        // CommBank format: Date, Amount, Description, Balance
        // Minimum 3 columns needed (balance is optional)
        if (values.length < 3) return null

        const dateStr = values[0]?.trim()
        const amountStr = values[1]?.trim()
        const description = values[2]?.trim() || ''
        const balanceStr = values[3]?.trim()

        // Validate date
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
            .replace(/\d{10,}/g, '') // Long reference numbers
            .replace(/[A-Z]{2}\d{4,}/g, '') // Location codes like AU1234
            .replace(/EFTPOS\s*/gi, '')
            .replace(/DEBIT\s*/gi, '')
            .replace(/CREDIT\s*/gi, '')
            .replace(/VISA\s*/gi, '')
            .replace(/CARD\s+\d+/gi, '')
            .replace(/Direct Debit\s*/gi, '')
            .replace(/Direct Credit\s*/gi, '')
            .replace(/Transfer\s*/gi, 'Transfer ')
            .replace(/AU$/i, '')
            .replace(/AUS$/i, '')
            .replace(/PTY LTD/gi, '')
            .replace(/\s+/g, ' ')
            .trim() || description.trim()
    }
}
