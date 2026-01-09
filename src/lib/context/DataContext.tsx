'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Account, Property, Transaction, Category, AutoRule, Contact, BankCode } from '../types'

// ============================================
// CRUD STATUS
// ============================================
export type RecordStatus = 'active' | 'archived' | 'deleted'

// ============================================
// BASE ENTITY WITH CRUD FIELDS
// ============================================
interface CrudEntity {
    id: string
    status: RecordStatus
    createdAt: Date
    updatedAt: Date
    archivedAt?: Date
    deletedAt?: Date
}

// Extend base types with CRUD fields
export type AccountRecord = Account & CrudEntity
export type PropertyRecord = Property & CrudEntity
export type TransactionRecord = Transaction & CrudEntity & {
    categoryId?: string
    entityId?: string
}
export type CategoryRecord = Category & CrudEntity
export type AutoRuleRecord = AutoRule & CrudEntity
export type ContactRecord = Contact & CrudEntity

// ============================================
// DATA STATE
// ============================================
interface DataState {
    accounts: AccountRecord[]
    properties: PropertyRecord[]
    transactions: TransactionRecord[]
    categories: CategoryRecord[]
    autoRules: AutoRuleRecord[]
    contacts: ContactRecord[]
}

// ============================================
// CONTEXT TYPE
// ============================================
interface DataContextType {
    // State
    data: DataState

    // Generic CRUD operations
    // Accounts
    addAccount: (account: Omit<AccountRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => AccountRecord
    updateAccount: (id: string, updates: Partial<AccountRecord>) => void
    archiveAccount: (id: string) => void
    deleteAccount: (id: string) => void
    restoreAccount: (id: string) => void
    getAccounts: (includeArchived?: boolean) => AccountRecord[]

    // Properties
    addProperty: (property: Omit<PropertyRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => PropertyRecord
    updateProperty: (id: string, updates: Partial<PropertyRecord>) => void
    archiveProperty: (id: string) => void
    deleteProperty: (id: string) => void
    restoreProperty: (id: string) => void
    getProperties: (includeArchived?: boolean) => PropertyRecord[]

    // Transactions
    addTransaction: (transaction: Omit<TransactionRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => TransactionRecord
    updateTransaction: (id: string, updates: Partial<TransactionRecord>) => void
    deleteTransaction: (id: string) => void
    getTransactions: (includeArchived?: boolean) => TransactionRecord[]

    // Contacts
    addContact: (contact: Omit<ContactRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => ContactRecord
    updateContact: (id: string, updates: Partial<ContactRecord>) => void
    archiveContact: (id: string) => void
    deleteContact: (id: string) => void
    getContacts: (includeArchived?: boolean) => ContactRecord[]

    // Auto Rules
    addAutoRule: (rule: Omit<AutoRuleRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => AutoRuleRecord
    updateAutoRule: (id: string, updates: Partial<AutoRuleRecord>) => void
    deleteAutoRule: (id: string) => void
    getAutoRules: () => AutoRuleRecord[]
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function generateId(prefix: string): string {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

// ============================================
// INITIAL DATA (Empty for Production/Test)
// ============================================
const INITIAL_ACCOUNTS: AccountRecord[] = []

const INITIAL_PROPERTIES: PropertyRecord[] = []

const INITIAL_STATE: DataState = {
    accounts: INITIAL_ACCOUNTS,
    properties: INITIAL_PROPERTIES,
    transactions: [],
    categories: [],
    autoRules: [],
    contacts: []
}

// ============================================
// CONTEXT
// ============================================
const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<DataState>(INITIAL_STATE)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from LocalStorage on mount
    React.useEffect(() => {
        const savedData = localStorage.getItem('mwf_data')
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData)
                // Need to revive dates since JSON.parse makes them strings
                const revivedState: DataState = {
                    ...parsed,
                    accounts: parsed.accounts.map((x: any) => ({ ...x, createdAt: new Date(x.createdAt), updatedAt: new Date(x.updatedAt), archivedAt: x.archivedAt ? new Date(x.archivedAt) : undefined, deletedAt: x.deletedAt ? new Date(x.deletedAt) : undefined })),
                    properties: parsed.properties.map((x: any) => ({ ...x, purchaseDate: new Date(x.purchaseDate), createdAt: new Date(x.createdAt), updatedAt: new Date(x.updatedAt), archivedAt: x.archivedAt ? new Date(x.archivedAt) : undefined, deletedAt: x.deletedAt ? new Date(x.deletedAt) : undefined })),
                    transactions: parsed.transactions.map((x: any) => ({ ...x, date: new Date(x.date), importedAt: new Date(x.importedAt), createdAt: new Date(x.createdAt), updatedAt: new Date(x.updatedAt) })),
                    // categories, contacts, autoRules similarly if needed, but they are empty in initial mock
                    categories: parsed.categories || [],
                    contacts: parsed.contacts || [],
                    autoRules: parsed.autoRules || []
                }
                setData(revivedState)
            } catch (e) {
                console.error('Failed to load data', e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to LocalStorage on change
    React.useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('mwf_data', JSON.stringify(data))
        }
    }, [data, isLoaded])

    // ========== ACCOUNTS ==========
    const addAccount = useCallback((account: Omit<AccountRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
        const newAccount: AccountRecord = {
            ...account,
            id: generateId('acc'),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        }
        setData(prev => ({ ...prev, accounts: [...prev.accounts, newAccount] }))
        return newAccount
    }, [])

    const updateAccount = useCallback((id: string, updates: Partial<AccountRecord>) => {
        setData(prev => ({
            ...prev,
            accounts: prev.accounts.map(acc =>
                acc.id === id ? { ...acc, ...updates, updatedAt: new Date() } : acc
            )
        }))
    }, [])

    const archiveAccount = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            accounts: prev.accounts.map(acc =>
                acc.id === id ? { ...acc, status: 'archived' as RecordStatus, archivedAt: new Date(), updatedAt: new Date() } : acc
            )
        }))
    }, [])

    const deleteAccount = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            accounts: prev.accounts.map(acc =>
                acc.id === id ? { ...acc, status: 'deleted' as RecordStatus, deletedAt: new Date(), updatedAt: new Date() } : acc
            )
        }))
    }, [])

    const restoreAccount = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            accounts: prev.accounts.map(acc =>
                acc.id === id ? { ...acc, status: 'active' as RecordStatus, archivedAt: undefined, updatedAt: new Date() } : acc
            )
        }))
    }, [])

    const getAccounts = useCallback((includeArchived = false) => {
        return data.accounts.filter(acc =>
            acc.status !== 'deleted' && (includeArchived || acc.status !== 'archived')
        )
    }, [data.accounts])

    // ========== PROPERTIES ==========
    const addProperty = useCallback((property: Omit<PropertyRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
        const newProperty: PropertyRecord = {
            ...property,
            id: generateId('prop'),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        }
        setData(prev => ({ ...prev, properties: [...prev.properties, newProperty] }))
        return newProperty
    }, [])

    const updateProperty = useCallback((id: string, updates: Partial<PropertyRecord>) => {
        setData(prev => ({
            ...prev,
            properties: prev.properties.map(prop =>
                prop.id === id ? { ...prop, ...updates, updatedAt: new Date() } : prop
            )
        }))
    }, [])

    const archiveProperty = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            properties: prev.properties.map(prop =>
                prop.id === id ? { ...prop, status: 'archived' as RecordStatus, archivedAt: new Date(), updatedAt: new Date() } : prop
            )
        }))
    }, [])

    const deleteProperty = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            properties: prev.properties.map(prop =>
                prop.id === id ? { ...prop, status: 'deleted' as RecordStatus, deletedAt: new Date(), updatedAt: new Date() } : prop
            )
        }))
    }, [])

    const restoreProperty = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            properties: prev.properties.map(prop =>
                prop.id === id ? { ...prop, status: 'active' as RecordStatus, archivedAt: undefined, updatedAt: new Date() } : prop
            )
        }))
    }, [])

    const getProperties = useCallback((includeArchived = false) => {
        return data.properties.filter(prop =>
            prop.status !== 'deleted' && (includeArchived || prop.status !== 'archived')
        )
    }, [data.properties])

    // ========== TRANSACTIONS ==========
    const addTransaction = useCallback((transaction: Omit<TransactionRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
        const newTransaction: TransactionRecord = {
            ...transaction,
            id: generateId('txn'),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        }
        setData(prev => ({ ...prev, transactions: [...prev.transactions, newTransaction] }))
        return newTransaction
    }, [])

    const updateTransaction = useCallback((id: string, updates: Partial<TransactionRecord>) => {
        setData(prev => ({
            ...prev,
            transactions: prev.transactions.map(txn =>
                txn.id === id ? { ...txn, ...updates, updatedAt: new Date() } : txn
            )
        }))
    }, [])

    const deleteTransaction = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            transactions: prev.transactions.map(txn =>
                txn.id === id ? { ...txn, status: 'deleted' as RecordStatus, deletedAt: new Date(), updatedAt: new Date() } : txn
            )
        }))
    }, [])

    const getTransactions = useCallback((includeArchived = false) => {
        return data.transactions.filter(txn =>
            txn.status !== 'deleted' && (includeArchived || txn.status !== 'archived')
        )
    }, [data.transactions])

    // ========== CONTACTS ==========
    const addContact = useCallback((contact: Omit<ContactRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
        const newContact: ContactRecord = {
            ...contact,
            id: generateId('contact'),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        }
        setData(prev => ({ ...prev, contacts: [...prev.contacts, newContact] }))
        return newContact
    }, [])

    const updateContact = useCallback((id: string, updates: Partial<ContactRecord>) => {
        setData(prev => ({
            ...prev,
            contacts: prev.contacts.map(c =>
                c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
            )
        }))
    }, [])

    const archiveContact = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            contacts: prev.contacts.map(c =>
                c.id === id ? { ...c, status: 'archived' as RecordStatus, archivedAt: new Date(), updatedAt: new Date() } : c
            )
        }))
    }, [])

    const deleteContact = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            contacts: prev.contacts.map(c =>
                c.id === id ? { ...c, status: 'deleted' as RecordStatus, deletedAt: new Date(), updatedAt: new Date() } : c
            )
        }))
    }, [])

    const getContacts = useCallback((includeArchived = false) => {
        return data.contacts.filter(c =>
            c.status !== 'deleted' && (includeArchived || c.status !== 'archived')
        )
    }, [data.contacts])

    // ========== AUTO RULES ==========
    const addAutoRule = useCallback((rule: Omit<AutoRuleRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
        const newRule: AutoRuleRecord = {
            ...rule,
            id: generateId('rule'),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        }
        setData(prev => ({ ...prev, autoRules: [...prev.autoRules, newRule] }))
        return newRule
    }, [])

    const updateAutoRule = useCallback((id: string, updates: Partial<AutoRuleRecord>) => {
        setData(prev => ({
            ...prev,
            autoRules: prev.autoRules.map(rule =>
                rule.id === id ? { ...rule, ...updates, updatedAt: new Date() } : rule
            )
        }))
    }, [])

    const deleteAutoRule = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            autoRules: prev.autoRules.filter(rule => rule.id !== id)
        }))
    }, [])

    const getAutoRules = useCallback(() => {
        return data.autoRules.filter(rule => rule.status === 'active')
    }, [data.autoRules])

    const value: DataContextType = {
        data,
        addAccount, updateAccount, archiveAccount, deleteAccount, restoreAccount, getAccounts,
        addProperty, updateProperty, archiveProperty, deleteProperty, restoreProperty, getProperties,
        addTransaction, updateTransaction, deleteTransaction, getTransactions,
        addContact, updateContact, archiveContact, deleteContact, getContacts,
        addAutoRule, updateAutoRule, deleteAutoRule, getAutoRules
    }

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error('useData must be used within a DataProvider')
    }
    return context
}
