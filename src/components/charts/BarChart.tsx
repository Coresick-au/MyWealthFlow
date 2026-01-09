'use client'

interface BarChartProps {
    data: Array<{
        label: string
        value: number
        highlighted?: boolean
    }>
    title?: string
    subtitle?: string
}

export function BarChart({ data, title, subtitle }: BarChartProps) {
    const maxValue = Math.max(...data.map(d => d.value))

    return (
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
            {(title || subtitle) && (
                <div className="mb-6">
                    {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
            )}

            <div className="flex items-end gap-2 h-32">
                {data.map((item, index) => {
                    const height = (item.value / maxValue) * 100
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div
                                className={`w-full rounded-t-lg transition-all duration-300 ${item.highlighted
                                        ? 'bg-gradient-to-t from-accent-lime to-accent-lime/50'
                                        : 'bg-gradient-to-t from-accent-teal/60 to-accent-teal/30'
                                    }`}
                                style={{ height: `${height}%` }}
                            />
                            <span className="text-xs text-gray-500">{item.label}</span>
                        </div>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-dark-border">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-accent-teal/60"></div>
                    <span className="text-sm text-gray-400">Regular</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-accent-lime"></div>
                    <span className="text-sm text-gray-400">Highlighted</span>
                </div>
            </div>
        </div>
    )
}
