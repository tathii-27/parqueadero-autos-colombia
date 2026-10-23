import { VehicleType } from '../types/parking';

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return d.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTimeOnly(isoString: string): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return d.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateOnly(isoString: string): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return d.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function calculateDuration(entryTimeIso: string, exitTimeIso?: string): {
  totalMinutes: number;
  hours: number;
  minutes: number;
  days: number;
  formattedString: string;
} {
  const start = new Date(entryTimeIso).getTime();
  const end = exitTimeIso ? new Date(exitTimeIso).getTime() : Date.now();
  const diffMs = Math.max(0, end - start);
  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  let formattedString = '';
  if (days > 0) {
    formattedString += `${days}d `;
  }
  if (hours > 0 || days > 0) {
    formattedString += `${hours}h `;
  }
  formattedString += `${minutes}m`;

  return { totalMinutes, hours, minutes, days, formattedString };
}

export function formatPlateDisplay(plate: string): string {
  if (!plate) return '';
  const cleaned = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cleaned.length === 6) {
    // Standard Colombian plate: 3 letters + 3 numbers (car) or 3 letters + 2 numbers + 1 letter (moto)
    return `${cleaned.slice(0, 3)}·${cleaned.slice(3)}`;
  }
  return cleaned;
}

export function getVehicleTypeLabel(type: VehicleType): string {
  switch (type) {
    case 'AUTOMOVIL':
      return 'Automóvil';
    case 'MOTO':
      return 'Motocicleta';
    case 'CAMIONETA':
      return 'Camioneta / SUV';
    case 'BICICLETA':
      return 'Bicicleta';
    default:
      return type;
  }
}
