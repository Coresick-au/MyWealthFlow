'use client'

interface CircleChartData {
    value: number
    label: string
    color: string
    amount?: string
}

interface CircleChartProps {
    data: CircleChartData[]
    centerValue?: string
    centerLabel?: string
    size?: number
}

export function CircleChart({
    data,
    centerValue,
    centerLabel,
    size = 200
}: CircleChartProps) {
    const total = data.reduce((acc, item) => acc + item.value, 0)
    const strokeWidth = 16
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    let accumulatedOffset = 0

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                />

                {/* Data segments */}
                {data.map((item, index) => {
                    const percentage = item.value / total
                    const dashLength = circumference * percentage
                    const dashOffset = circumference * accumulatedOffset

                    accumulatedOffset += percentage

                    return (
                        <circle
                            key={index}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={item.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                            strokeDashoffset={-dashOffset}
                            strokeLinecap="round"
                            className="circle-glow transition-all duration-500"
                            style={{
                                filter: `drop-shadow(0 0 6px ${item.color})`,
                            }}
                        />
                    )
                })}
            </svg>

            {/* Center content */}
            {(centerValue || centerLabel) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {centerValue && (
                        <span className="text-2xl font-bold text-white">{centerValue}</span>
                    )}
                    {centerLabel && (
                        <span className="text-sm text-gray-400">{centerLabel}</span>
                    )}
                </div>
            )}
        </div>
    )
}

// Nested circles like in the reference design
interface NestedCirclesProps {
    circles: Array<{
        value: string
        label: string
        color: string
        size: number
    }>
}

export function NestedCircles({ circles }: NestedCirclesProps) {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {circles.map((circle, index) => (
                <div
                    key={index}
                    className="absolute rounded-full flex items-center justify-center animate-pulse-glow"
                    style={{
                        width: circle.size,
                        height: circle.size,
                        background: `radial-gradient(circle, ${circle.color}40 0%, ${circle.color}10 70%)`,
                        border: `2px solid ${circle.color}`,
                        boxShadow: `0 0 20px ${circle.color}40, inset 0 0 20px ${circle.color}20`,
                    }}
                >
                    {index === 0 && (
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{circle.value}</div>
                            <div className="text-xs text-gray-300">{circle.label}</div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
