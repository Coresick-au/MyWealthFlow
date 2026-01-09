// Core type definitions for the Personal Finance App
// Based on the approved data model

// ============================================
// BANKS
// ============================================

export type BankCode = 'CBA' | 'NAB' | 'ANZ' | 'WBC'

export interface Bank {
    id: string
    name: string
    shortCode: BankCode
    color: string // Brand color for badges
}

export const BANKS: Record<BankCode, Bank> = {
    CBA: { id: 'bank-cba', name: 'Commonwealth Bank', shortCode: 'CBA', color: '#FFCC00' },
    NAB: { id: 'bank-nab', name: 'NAB', shortCode: 'NAB', color: '#C8102E' },
    ANZ: { id: 'bank-anz', name: 'ANZ', shortCode: 'ANZ', color: '#007DBA' },
    WBC: { id: 'bank-wbc', name: 'Westpac', shortCode: 'WBC', color: '#D5002B' },
}

// ============================================
// ACCOUNTS
// ============================================

export type AccountType =
    | 'transaction'
    | 'savings'
    | 'offset'
    | 'loan'
    | 'mortgage'
    | 'credit_card'

export interface Account {
    id: string
    bankId: string
    accountNumber: string // Last 4 digits for matching
    bsb?: string
    type: AccountType
    nickname: string // "Personal Spending", "69 Blackwood Offset"
    linkedPropertyId?: string // For offset/loan accounts
    isActive: boolean
    createdAt: Date
}

// ============================================
// PROPERTIES
// ============================================

export type PropertyType = 'investment' | 'owner_occupied' | 'sold'
export type PropertyStatus = 'rented' | 'vacant' | 'owner_occupied' | 'sold'

export interface Property {
    id: string
    address: string
    suburb: string
    state: string
    postcode: string
    type: PropertyType
    purchaseDate: Date
    purchasePrice: number
    currentValue: number // Manual update
    weeklyRent?: number // If investment
    propertyStatus: PropertyStatus
    createdAt: Date
}

export interface PropertyValuation {
    id: string
    propertyId: string
    date: Date
    value: number
    source: 'manual' | 'agent_appraisal' | 'bank_valuation'
    notes?: string
}

export interface PropertyLoan {
    id: string
    propertyId: string
    accountId: string // The loan account
    lender: string
    originalAmount: number
    currentBalance: number
    interestRate: number
    type: 'P&I' | 'interest_only'
}

// ============================================
// ENTITIES (Who uses the money)
// ============================================

export type EntityType = 'property' | 'personal' | 'work' | 'family'

export interface Entity {
    id: string
    type: EntityType
    name: string
    linkedPropertyId?: string // If type = property
    linkedContactId?: string // If type = family
    color?: string // For UI badge
    icon?: string // Icon name
}

// ============================================
// CONTACTS (For transfer matching)
// ============================================

export type ContactRelationship = 'family' | 'friend' | 'tenant' | 'business' | 'other'

export interface Contact {
    id: string
    name: string
    relationship: ContactRelationship
    accountPatterns: string[] // BSB/Acc patterns to auto-match
    notes?: string
}

// ============================================
// CATEGORIES
// ============================================

export type CategoryType = 'expense' | 'income' | 'transfer'

export interface Category {
    id: string
    name: string
    type: CategoryType
    isTaxDeductible: boolean
    atoCode?: string // For tax time
    parentId?: string // For sub-categories
    icon?: string
    color?: string
}

// Default categories
export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
    // Expenses - Not Deductible
    { name: 'Groceries', type: 'expense', isTaxDeductible: false },
    { name: 'Fuel', type: 'expense', isTaxDeductible: false },
    { name: 'Dining Out', type: 'expense', isTaxDeductible: false },
    { name: 'Subscriptions', type: 'expense', isTaxDeductible: false },
    { name: 'Entertainment', type: 'expense', isTaxDeductible: false },
    { name: 'Health', type: 'expense', isTaxDeductible: false },

    // Expenses - Tax Deductible (Property)
    { name: 'Repairs & Maintenance', type: 'expense', isTaxDeductible: true, atoCode: 'R&M' },
    { name: 'Council Rates', type: 'expense', isTaxDeductible: true },
    { name: 'Water Charges', type: 'expense', isTaxDeductible: true },
    { name: 'Land Tax', type: 'expense', isTaxDeductible: true },
    { name: 'Insurance - Property', type: 'expense', isTaxDeductible: true },
    { name: 'Agent Fees', type: 'expense', isTaxDeductible: true },
    { name: 'Body Corporate', type: 'expense', isTaxDeductible: true },
    { name: 'Interest on Loans', type: 'expense', isTaxDeductible: true },
    { name: 'Cleaning', type: 'expense', isTaxDeductible: true },
    { name: 'Gardening', type: 'expense', isTaxDeductible: true },
    { name: 'Pest Control', type: 'expense', isTaxDeductible: true },

    // Income
    { name: 'Rental Income', type: 'income', isTaxDeductible: false },
    { name: 'Salary', type: 'income', isTaxDeductible: false },
    { name: 'Interest Earned', type: 'income', isTaxDeductible: false },
    { name: 'Other Income', type: 'income', isTaxDeductible: false },

    // Transfers
    { name: 'Transfer - Family', type: 'transfer', isTaxDeductible: false },
    { name: 'Transfer - Between Accounts', type: 'transfer', isTaxDeductible: false },
    { name: 'Transfer - Other', type: 'transfer', isTaxDeductible: false },
]

// ============================================
// TRANSACTIONS
// ============================================

export interface Transaction {
    id: string
    externalHash: string // For duplicate detection
    accountId: string
    date: Date
    amount: number // Negative = expense
    rawDescription: string
    cleanDescription: string
    bank: BankCode
    importedAt: Date
    // Allocation status
    isAllocated: boolean
    needsReview?: boolean
    allocations: TransactionAllocation[]
}

export interface TransactionAllocation {
    id: string
    transactionId: string
    entityId: string // Property / personal / family
    categoryId: string
    amount: number // Portion of total (for splits)
    claimPercent: number // For partial deductions, default 100
    notes?: string
}

// ============================================
// AUTO RULES
// ============================================

export type MatchType = 'contains' | 'starts_with' | 'regex'

export interface AutoRule {
    id: string
    pattern: string
    matchType: MatchType
    caseSensitive: boolean
    action: {
        categoryId?: string
        entityId?: string
        claimPercent?: number
    }
    priority: number // Higher = runs first
    isActive: boolean
    createdAt: Date
}

// ============================================
// FINANCIAL YEAR (Australian)
// ============================================

export interface FinancialYear {
    label: string // "FY 2025-26"
    startDate: Date // July 1
    endDate: Date // June 30
}

export function getCurrentFinancialYear(): FinancialYear {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() // 0-indexed

    // If July onwards, FY is current year - next year
    // If before July, FY is last year - current year
    const fyYear = month >= 6 ? year : year - 1

    return {
        label: `FY ${fyYear}-${(fyYear + 1).toString().slice(-2)}`,
        startDate: new Date(fyYear, 6, 1), // July 1
        endDate: new Date(fyYear + 1, 5, 30), // June 30
    }
}

export function getFinancialYear(date: Date): FinancialYear {
    const year = date.getFullYear()
    const month = date.getMonth()
    const fyYear = month >= 6 ? year : year - 1

    return {
        label: `FY ${fyYear}-${(fyYear + 1).toString().slice(-2)}`,
        startDate: new Date(fyYear, 6, 1),
        endDate: new Date(fyYear + 1, 5, 30),
    }
}
