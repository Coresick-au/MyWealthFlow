// Category Guesser - Auto-categorization based on description patterns

export function guessCategory(description: string): string {
    const normalize = description.toUpperCase()

    // ============================================
    // GROCERIES
    // ============================================
    if (
        normalize.includes('WOOLWORTHS') ||
        normalize.includes('COLES') ||
        normalize.includes('ALDI') ||
        normalize.includes('IGA') ||
        normalize.includes('COSTCO') ||
        normalize.includes('FOODWORKS') ||
        normalize.includes('FOODLAND')
    ) return 'Groceries'

    // ============================================
    // FUEL
    // ============================================
    if (
        normalize.includes('AMPOL') ||
        normalize.includes('BP ') ||
        normalize.includes('SHELL') ||
        normalize.includes('CALTEX') ||
        normalize.includes('7-ELEVEN') ||
        normalize.includes('PUMA ENERGY') ||
        normalize.includes('UNITED PETROL') ||
        normalize.includes('LIBERTY OIL')
    ) return 'Fuel'

    // ============================================
    // PROPERTY / REPAIRS
    // ============================================
    if (
        normalize.includes('BUNNINGS') ||
        normalize.includes('MITRE 10') ||
        normalize.includes('TOTAL TOOLS') ||
        normalize.includes('MASTERS')
    ) return 'Repairs & Maintenance'

    // ============================================
    // UTILITIES
    // ============================================
    if (
        normalize.includes('SYNERGY') ||
        normalize.includes('WATER CORP') ||
        normalize.includes('ORIGIN ENERGY') ||
        normalize.includes('AGL') ||
        normalize.includes('ALINTA') ||
        normalize.includes('HORIZON POWER')
    ) return 'Utilities'

    // Telco
    if (
        normalize.includes('TELSTRA') ||
        normalize.includes('OPTUS') ||
        normalize.includes('VODAFONE') ||
        normalize.includes('TPG') ||
        normalize.includes('AUSSIE BROADBAND')
    ) return 'Utilities'

    // ============================================
    // COUNCIL / RATES
    // ============================================
    if (
        normalize.includes('COUNCIL') ||
        normalize.includes('SHIRE') ||
        normalize.includes('RATES')
    ) return 'Council Rates'

    // ============================================
    // INSURANCE
    // ============================================
    if (
        normalize.includes('INSURANCE') ||
        normalize.includes('NRMA') ||
        normalize.includes('RACQ') ||
        normalize.includes('RAC ') ||
        normalize.includes('ALLIANZ') ||
        normalize.includes('SUNCORP') ||
        normalize.includes('QBE') ||
        normalize.includes('YOUI')
    ) return 'Insurance - Property'

    // ============================================
    // BODY CORPORATE / STRATA
    // ============================================
    if (
        normalize.includes('STRATA') ||
        normalize.includes('BODY CORP') ||
        normalize.includes('OWNERS CORP')
    ) return 'Body Corporate'

    // ============================================
    // AGENT FEES
    // ============================================
    if (
        normalize.includes('PROPERTY MANAGEMENT') ||
        normalize.includes('REAL ESTATE') ||
        normalize.includes('RENTAL MANAGEMENT')
    ) return 'Agent Fees'

    // ============================================
    // RENTAL INCOME
    // ============================================
    if (
        normalize.includes('RENTAL') ||
        normalize.includes('RENT PAYMENT') ||
        normalize.includes('TENANT')
    ) return 'Rental Income'

    // ============================================
    // INTEREST
    // ============================================
    if (
        normalize.includes('INTEREST') &&
        normalize.includes('LOAN')
    ) return 'Interest on Loans'

    // ============================================
    // TAX
    // ============================================
    if (
        normalize.includes('ATO') ||
        normalize.includes('AUSTRALIAN TAX') ||
        normalize.includes('TAX OFFICE')
    ) return 'Tax'

    // ============================================
    // DINING
    // ============================================
    if (
        normalize.includes('MCDONALD') ||
        normalize.includes('KFC') ||
        normalize.includes('HUNGRY JACK') ||
        normalize.includes('SUBWAY') ||
        normalize.includes('DOMINOS') ||
        normalize.includes('PIZZA HUT') ||
        normalize.includes('NANDOS') ||
        normalize.includes('GRILL\'D') ||
        normalize.includes('GUZMAN')
    ) return 'Dining Out'

    // Food delivery
    if (
        normalize.includes('UBER EATS') ||
        normalize.includes('DOORDASH') ||
        normalize.includes('MENULOG') ||
        normalize.includes('DELIVEROO')
    ) return 'Dining Out'

    // ============================================
    // TRAVEL
    // ============================================
    if (
        normalize.includes('QANTAS') ||
        normalize.includes('VIRGIN') ||
        normalize.includes('JETSTAR') ||
        normalize.includes('FLIGHT CENTRE') ||
        normalize.includes('BOOKING.COM') ||
        normalize.includes('AIRBNB') ||
        normalize.includes('EXPEDIA') ||
        normalize.includes('WEBJET')
    ) return 'Travel'

    // ============================================
    // SUBSCRIPTIONS
    // ============================================
    if (
        normalize.includes('NETFLIX') ||
        normalize.includes('SPOTIFY') ||
        normalize.includes('DISNEY+') ||
        normalize.includes('AMAZON PRIME') ||
        normalize.includes('STAN') ||
        normalize.includes('YOUTUBE') ||
        normalize.includes('APPLE.COM') ||
        normalize.includes('GOOGLE STORAGE') ||
        normalize.includes('MICROSOFT') ||
        normalize.includes('ADOBE')
    ) return 'Subscriptions'

    // ============================================
    // TRANSFERS - FAMILY (Check description patterns)
    // ============================================
    if (
        normalize.includes('TRANSFER TO') ||
        normalize.includes('TFR TO')
    ) return 'Transfer - Family'

    // ============================================
    // INTERNAL TRANSFERS
    // ============================================
    if (
        normalize.includes('TRANSFER BETWEEN') ||
        normalize.includes('INTERNAL TRANSFER')
    ) return 'Transfer - Between Accounts'

    // ============================================
    // DEFAULT
    // ============================================
    return 'Uncategorized'
}

// List of all categories for dropdowns
export const CATEGORIES = [
    'Uncategorized',
    'Groceries',
    'Fuel',
    'Dining Out',
    'Repairs & Maintenance',
    'Travel',
    'Utilities',
    'Insurance - Property',
    'Subscriptions',
    'Entertainment',
    'Health',
    'Council Rates',
    'Water Charges',
    'Land Tax',
    'Body Corporate',
    'Agent Fees',
    'Cleaning',
    'Gardening',
    'Pest Control',
    'Interest on Loans',
    'Rental Income',
    'Salary',
    'Interest Earned',
    'Other Income',
    'Tax',
    'Transfer - Family',
    'Transfer - Between Accounts',
    'Transfer - Other',
    'Other Expense',
] as const

export type Category = typeof CATEGORIES[number]
