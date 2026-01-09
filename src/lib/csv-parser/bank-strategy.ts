// Bank Strategy Interface for parsing different bank CSV formats

import { BankCode } from '../types'

export interface ParsedRow {
    date: string
    amount: number
    description: string
    balance?: number
}

export interface BankStrategy {
    bankCode: BankCode

    // Detect if this strategy can handle the CSV based on first few rows
    canHandle(firstRows: string[][]): boolean

    // Check if this CSV has a header row
    hasHeaderRow(firstRows: string[][]): boolean

    // Parse a single row into normalized format (row is array of values)
    parseRow(values: string[]): ParsedRow | null

    // Clean up messy descriptions
    cleanDescription(description: string): string
}

// Helper to generate unique hash for duplicate detection
export function generateTransactionHash(
    date: string,
    amount: number,
    description: string,
    bank: BankCode,
    accountId?: string
): string {
    const str = `${date}|${amount}|${description}|${bank}|${accountId || ''}`
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return `txn_${Math.abs(hash).toString(36)}`
}

// Parse various Australian date formats to Date
export function parseAustralianDate(dateStr: string): Date | null {
    if (!dateStr) return null

    const trimmed = dateStr.trim()

    // Try DD/MM/YYYY format (CommBank)
    const slashParts = trimmed.split('/')
    if (slashParts.length === 3) {
        const day = parseInt(slashParts[0])
        const month = parseInt(slashParts[1]) - 1 // 0-indexed
        let year = parseInt(slashParts[2])

        // Handle 2-digit year
        if (year < 100) {
            year = year > 50 ? 1900 + year : 2000 + year
        }

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day)
        }
    }

    // Try DD-Mmm-YY or DD Mmm YY format (NAB) e.g., "12-Dec-25" or "12 Dec 25"
    const monthNames: Record<string, number> = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    }

    // Match with space OR hyphen separator
    const nabMatch = trimmed.match(/^(\d{1,2})[\s-]([A-Za-z]{3})[\s-](\d{2,4})$/)
    if (nabMatch) {
        const day = parseInt(nabMatch[1])
        const monthStr = nabMatch[2].toLowerCase()
        let year = parseInt(nabMatch[3])

        // Handle 2-digit year
        if (year < 100) {
            year = year > 50 ? 1900 + year : 2000 + year
        }

        const month = monthNames[monthStr]
        if (month !== undefined && !isNaN(day) && !isNaN(year)) {
            return new Date(year, month, day)
        }
    }

    // Try other formats as fallback
    const parsed = new Date(dateStr)
    if (!isNaN(parsed.getTime())) {
        return parsed
    }

    return null
}

// Parse CSV line handling quoted fields  
export function parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
            inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim().replace(/^"|"$/g, ''))
            current = ''
        } else {
            current += char
        }
    }

    result.push(current.trim().replace(/^"|"$/g, ''))
    return result
}

// Parse full CSV text into rows (as arrays of values)
export function parseCSVToArrays(csvText: string): string[][] {
    const lines = csvText
        .trim()
        .split(/\r?\n/)
        .filter(l => l.trim().length > 0)

    return lines.map(line => parseCSVLine(line))
}

// Check if a string looks like a date (DD/MM/YYYY or DD-Mmm-YY or DD Mmm YY)
export function looksLikeDate(value: string): boolean {
    if (!value) return false
    const trimmed = value.trim()
    // DD/MM/YYYY pattern (CommBank)
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(trimmed)) return true
    // DD-Mmm-YY or DD Mmm YY pattern (NAB) e.g., "12-Dec-25" or "12 Dec 25"
    if (/^\d{1,2}[\s-][A-Za-z]{3}[\s-]\d{2,4}$/.test(trimmed)) return true
    return false
}

// Check if a string looks like a currency amount
export function looksLikeAmount(value: string): boolean {
    if (!value) return false
    const trimmed = value.trim()
    // Matches: 123.45, -123.45, +123.45, $123.45, -$123.45
    return /^[-+]?\$?[\d,]+\.?\d*$/.test(trimmed) || /^[-+]?[\d,]+\.?\d*$/.test(trimmed)
}

// Parse amount string to number
export function parseAmount(value: string): number {
    if (!value) return NaN
    const cleaned = value.trim().replace(/[$,]/g, '')
    return parseFloat(cleaned)
}
