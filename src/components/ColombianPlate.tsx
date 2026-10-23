import React from 'react';
import { VehicleType } from '../types/parking';
import { formatPlateDisplay } from '../utils/formatters';

interface ColombianPlateProps {
  plate: string;
  vehicleType?: VehicleType;
  isPublicService?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ColombianPlate: React.FC<ColombianPlateProps> = ({
  plate,
  vehicleType = 'AUTOMOVIL',
  isPublicService = false,
  size = 'md',
  className = '',
}) => {
  const formatted = formatPlateDisplay(plate);

  // Colombian license plates:
  // Particular: Yellow (#FACC15) with black border and text
  // Public service: White with black border and text
  // Bicycle: Blue/Slate badge
  if (vehicleType === 'BICICLETA') {
    return (
      <span
        className={`inline-flex items-center justify-center font-mono font-semibold tracking-wider bg-slate-100 text-slate-800 border border-slate-300 rounded ${
          size === 'sm' ? 'px-1.5 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-base' : 'px-2 py-1 text-sm'
        } ${className}`}
      >
        {plate}
      </span>
    );
  }

  const bgClass = isPublicService ? 'bg-white text-slate-950' : 'bg-amber-300 text-slate-950';

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs min-w-[70px]',
    md: 'px-2.5 py-1 text-sm min-w-[95px]',
    lg: 'px-4 py-1.5 text-base min-w-[120px]',
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-mono font-bold tracking-widest uppercase border-2 border-slate-900 rounded shadow-xs select-all ${bgClass} ${sizeClasses[size]} ${className}`}
      title={`Placa: ${formatted}`}
    >
      <span className="tabular-nums">{formatted}</span>
    </div>
  );
};
