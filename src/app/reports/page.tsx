'use client'

import { FileText, Download, Calendar, PieChart, DollarSign, Home, Briefcase } from 'lucide-react'
import { getCurrentFinancialYear } from '@/lib/types'

export default function ReportsPage() {
    const currentFY = getCurrentFinancialYear()

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Tax Reports</h1>
                    <p className="text-gray-500 mt-1">Generate reports for your accountant</p>
                </div>
                <div className="flex items-center gap-2 bg-dark-card border border-dark-border px-4 py-2 rounded-xl">
                    <Calendar size={18} className="text-accent-teal" />
                    <span className="text-white font-bold">{currentFY.label}</span>
                </div>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Income & Expenses */}
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-accent-teal/50 transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-accent-teal/20 rounded-xl flex items-center justify-center">
                            <Home size={24} className="text-accent-teal" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg group-hover:text-accent-teal transition-colors">
                                Property Income & Expenses
                            </h3>
                            <p className="text-sm text-gray-500">Per-property breakdown for Schedule E</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Summarizes rental income, deductible expenses, and net rental income for each investment property.
                    </p>
                    <button className="w-full py-3 bg-dark-bg border border-dark-border rounded-xl text-white font-medium hover:bg-dark-card-hover transition-all flex items-center justify-center gap-2">
                        <Download size={18} />
                        Generate Report
                    </button>
                </div>

                {/* Depreciation Schedule */}
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-accent-lime/50 transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-accent-lime/20 rounded-xl flex items-center justify-center">
                            <DollarSign size={24} className="text-accent-lime" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg group-hover:text-accent-lime transition-colors">
                                Depreciation Schedule
                            </h3>
                            <p className="text-sm text-gray-500">Division 40 & 43 deductions</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Annual depreciation deductions for plant & equipment (Div 40) and building structure (Div 43).
                    </p>
                    <button className="w-full py-3 bg-dark-bg border border-dark-border rounded-xl text-white font-medium hover:bg-dark-card-hover transition-all flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                        <FileText size={18} />
                        Coming Soon
                    </button>
                </div>

                {/* Work Expenses */}
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-blue-500/50 transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <Briefcase size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                                Work-Related Expenses
                            </h3>
                            <p className="text-sm text-gray-500">D1-D5 deduction summary</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        All transactions tagged to "Work" entity, categorized by ATO deduction type.
                    </p>
                    <button className="w-full py-3 bg-dark-bg border border-dark-border rounded-xl text-white font-medium hover:bg-dark-card-hover transition-all flex items-center justify-center gap-2">
                        <Download size={18} />
                        Generate Report
                    </button>
                </div>

                {/* Category Summary */}
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-purple-500/50 transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <PieChart size={24} className="text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">
                                Category Summary
                            </h3>
                            <p className="text-sm text-gray-500">Full year spending breakdown</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        All transactions grouped by category with totals, useful for budgeting and tax planning.
                    </p>
                    <button className="w-full py-3 bg-dark-bg border border-dark-border rounded-xl text-white font-medium hover:bg-dark-card-hover transition-all flex items-center justify-center gap-2">
                        <Download size={18} />
                        Generate Report
                    </button>
                </div>
            </div>

            {/* ATO Reminder */}
            <div className="mt-8 bg-gradient-to-r from-accent-teal/10 to-accent-lime/10 border border-accent-teal/30 rounded-2xl p-6">
                <h4 className="font-bold text-white mb-2">📋 Tax Time Reminder</h4>
                <p className="text-gray-400 text-sm">
                    Australian financial year runs from <span className="text-accent-teal font-bold">1 July</span> to <span className="text-accent-teal font-bold">30 June</span>.
                    Make sure all transactions are allocated before generating your final reports for your accountant.
                </p>
            </div>
        </div>
    )
}
