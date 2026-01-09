interface StatCardProps {
    title: string
    value: string
    change?: string
    positive?: boolean
    neutral?: boolean
    variant?: 'teal' | 'purple' | 'blue' | 'green' | 'coral'
    icon?: React.ReactNode
}

export function StatCard({
    title,
    value,
    change,
    positive,
    neutral,
    variant = 'teal',
    icon
}: StatCardProps) {
    const gradientClasses = {
        teal: 'gradient-card-teal',
        purple: 'gradient-card-purple',
        blue: 'gradient-card-blue',
        green: 'gradient-card-green',
        coral: 'gradient-card-coral',
    }

    return (
        <div className={`${gradientClasses[variant]} rounded-2xl p-6 interactive-card`}>
            <div className="flex items-start justify-between">
                <p className="text-sm text-gray-400 font-medium">{title}</p>
                {icon && (
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                        {icon}
                    </div>
                )}
            </div>
            <div className="mt-3">
                <span className="text-3xl font-bold text-white stat-value">{value}</span>
            </div>
            {change && (
                <div className={`text-sm font-medium mt-2 ${neutral
                        ? 'text-gray-400'
                        : positive
                            ? 'text-accent-lime'
                            : 'text-accent-coral'
                    }`}>
                    {change}
                </div>
            )}
        </div>
    )
}
