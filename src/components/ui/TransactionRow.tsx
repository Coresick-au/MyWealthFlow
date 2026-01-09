import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface TransactionRowProps {
    merchant: string
    category: string
    amount: string
    date: string
    isIncome?: boolean
}

export function TransactionRow({ merchant, category, amount, date, isIncome }: TransactionRowProps) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-dark-border last:border-0">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome
                        ? 'bg-accent-lime/10 text-accent-lime'
                        : 'bg-dark-card-hover text-gray-400'
                    }`}>
                    {isIncome ? <TrendingUp size={16} /> : <DollarSign size={16} />}
                </div>
                <div>
                    <p className="text-white font-medium">{merchant}</p>
                    <p className="text-sm text-gray-500">{category}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-semibold ${isIncome ? 'text-accent-lime' : 'text-white'}`}>
                    {amount}
                </p>
                <p className="text-sm text-gray-500">{date}</p>
            </div>
        </div>
    )
}
