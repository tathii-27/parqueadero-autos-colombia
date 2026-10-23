export type VehicleType = 'AUTOMOVIL' | 'MOTO' | 'CAMIONETA' | 'BICICLETA';

export type ServiceType = 'MENSUALIDAD' | 'OCASIONAL';

export type CellStatus = 'DISPONIBLE' | 'OCUPADA' | 'RESERVADA_MENSUAL' | 'MANTENIMIENTO';

export type CellZone = 'ZONA_A_AUTOS' | 'ZONA_B_MOTOS' | 'ZONA_C_ESPECIALES';

export interface ParkingCell {
  id: string;
  code: string;
  zone: CellZone;
  allowedType: VehicleType;
  status: CellStatus;
  currentVehiclePlate?: string;
  reservedForUserId?: string;
  notes?: string;
}

export interface VehicleEntry {
  id: string;
  ticketNumber: string;
  plate: string;
  vehicleType: VehicleType;
  serviceType: ServiceType;
  userId?: string;
  clientName?: string;
  cellId: string;
  entryTime: string; // ISO string
  exitTime?: string;
  initialConditionNotes?: string;
  status: 'ACTIVO' | 'FINALIZADO';
  totalMinutes?: number;
  amountDue?: number;
  paymentId?: string;
}

export interface ClientVehicle {
  plate: string;
  brand: string;
  model: string;
  color: string;
  type: VehicleType;
}

export type SubscriptionStatus = 'ACTIVA' | 'POR_VENCER' | 'VENCIDA';

export interface UserClient {
  id: string;
  fullName: string;
  docType: 'CC' | 'CE' | 'NIT' | 'PASAPORTE';
  docNumber: string;
  phone: string;
  email: string;
  address: string;
  assignedCellId?: string;
  vehicles: ClientVehicle[];
  subscription: {
    startDate: string;
    endDate: string;
    monthlyRate: number;
    status: SubscriptionStatus;
    planType: string;
  };
  notes?: string;
  createdAt: string;
}

export type IncidentType = 
  | 'RAYON_GOLPE'
  | 'FUGA_LIQUIDOS'
  | 'LUCES_ENCENDIDAS'
  | 'ALARMA_ACTIVA'
  | 'OBJETO_VALOR'
  | 'PUERTA_VENTANA'
  | 'MECANICO'
  | 'OTRO';

export type IncidentSeverity = 'BAJA' | 'MEDIA' | 'ALTA';

export type IncidentStatus = 'PENDIENTE' | 'NOTIFICADO' | 'EN_PROCESO' | 'RESUELTA';

export interface VehicleIncident {
  id: string;
  code: string;
  plate: string;
  cellId?: string;
  vehicleType?: VehicleType;
  date: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  reportedBy: string;
  status: IncidentStatus;
  clientPhone?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export type PaymentMethod = 
  | 'EFECTIVO'
  | 'NEQUI'
  | 'DAVIPLATA'
  | 'TARJETA_DEBITO'
  | 'TARJETA_CREDITO'
  | 'TRANSFERENCIA';

export type PaymentConcept = 
  | 'MENSUALIDAD'
  | 'PARQUEO_OCASIONAL'
  | 'SERVICIO_ADICIONAL'
  | 'EXTRADIA';

export interface Payment {
  id: string;
  receiptNumber: string;
  date: string;
  concept: PaymentConcept;
  amount: number;
  paymentMethod: PaymentMethod;
  plate?: string;
  userId?: string;
  clientName: string;
  clientDoc: string;
  details: string;
  cashier: string;
}

export interface BusinessConfig {
  name: string;
  nit: string;
  address: string;
  city: string;
  phone: string;
  regime: string;
  hourlyRates: Record<VehicleType, number>;
  fractionRateMinutes: number;
  monthlyRates: Record<VehicleType, number>;
  gracePeriodMinutes: number;
}
