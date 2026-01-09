import { Home } from 'lucide-react'

interface PropertyCardProps {
    address: string
    value: string
    status: 'rented' | 'vacant' | 'primary_residence'
    yield?: string
    weeklyRent?: string
}

const statusColors = {
    rented: 'text-accent-lime bg-accent-lime/10',
    vacant: 'text-accent-coral bg-accent-coral/10',
    primary_residence: 'text-accent-purple bg-accent-purple/10',
}

const statusLabels = {
    rented: 'Leased',
    vacant: 'Vacant',
    primary_residence: 'Primary',
}

export function PropertyCard({ address, value, status, yield: rentalYield, weeklyRent }: PropertyCardProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-dark-card-hover/50 rounded-xl border border-dark-border hover:border-accent-teal/30 transition-all cursor-pointer interactive-card">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-teal/20 to-accent-blue/20 rounded-xl flex items-center justify-center">
                    <Home size={20} className="text-accent-teal" />
                </div>
                <div>
                    <p className="text-white font-medium">{address}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[status]}`}>
                            {statusLabels[status]}
                        </span>
                        {weeklyRent && (
                            <span className="text-xs text-gray-400">${weeklyRent}/wk</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <p className="text-white font-semibold">{value}</p>
                {rentalYield && (
                    <p className="text-sm text-accent-lime">{rentalYield} Yield</p>
                )}
            </div>
        </div>
    )
}
