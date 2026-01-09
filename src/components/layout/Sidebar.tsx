'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    TrendingUp,
    PieChart,
    Home,
    DollarSign,
    FileText,
    Upload,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'

const navItems = [
    { icon: PieChart, label: 'Dashboard', href: '/' },
    { icon: Home, label: 'Properties', href: '/properties' },
    { icon: DollarSign, label: 'Accounts', href: '/accounts' },
    { icon: FileText, label: 'Transactions', href: '/transactions' },
    { icon: Upload, label: 'Import', href: '/import' },
    { icon: FileText, label: 'Tax Reports', href: '/reports' },
]

interface SidebarProps {
    collapsed: boolean
    onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname()

    return (
        <aside
            className={`
        fixed left-0 top-0 h-screen bg-dark-card border-r border-dark-border
        flex flex-col transition-all duration-300 z-50
        ${collapsed ? 'w-20' : 'w-64'}
      `}
        >
            {/* Logo */}
            <div className="p-4 border-b border-dark-border">
                <Link href="/" className="flex items-center gap-3">
                    <img
                        src="/logo.png"
                        alt="My Wealth Flow"
                        className="h-8 w-auto"
                    />
                    {!collapsed && (
                        <span className="font-bold text-lg tracking-tight text-white">My Wealth Flow</span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                                    ? 'bg-gradient-to-r from-accent-lime/20 to-transparent text-accent-lime'
                                    : 'text-gray-400 hover:bg-dark-card-hover hover:text-white'
                                }
              `}
                        >
                            <item.icon size={20} className={isActive ? 'text-accent-lime' : ''} />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Financial Year Selector */}
            {!collapsed && (
                <div className="p-4 border-t border-dark-border">
                    <button className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-gray-400 hover:bg-dark-card-hover rounded-xl transition-colors">
                        <span>🇦🇺</span>
                        <span>FY 2025-2026</span>
                    </button>
                </div>
            )}

            {/* Collapse Toggle */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-dark-card border border-dark-border rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-card-hover transition-colors"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Dev Helper: Reset Data */}
            {!collapsed && (
                <div className="px-4 py-2">
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
                                localStorage.removeItem('mwf_data')
                                window.location.reload()
                            }
                        }}
                        className="w-full text-xs text-red-400 opacity-50 hover:opacity-100 transition-opacity"
                    >
                        [DEV] Reset All Data
                    </button>
                </div>
            )}

            {/* Settings at bottom */}
            <div className="p-3 border-t border-dark-border">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-dark-card-hover hover:text-white transition-colors"
                >
                    <Settings size={20} />
                    {!collapsed && <span className="font-medium">Settings</span>}
                </Link>
            </div>
        </aside>
    )
}
