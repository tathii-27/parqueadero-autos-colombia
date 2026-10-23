import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  INITIAL_ACTIVE_ENTRIES, 
  INITIAL_CELLS, 
  INITIAL_CLIENTS, 
  INITIAL_CONFIG, 
  INITIAL_INCIDENTS, 
  INITIAL_PAYMENTS 
} from '../data/initialData';
import { 
  BusinessConfig, 
  CellStatus, 
  IncidentSeverity, 
  IncidentStatus, 
  IncidentType, 
  ParkingCell, 
  Payment, 
  PaymentMethod, 
  ServiceType, 
  UserClient, 
  VehicleEntry, 
  VehicleIncident, 
  VehicleType 
} from '../types/parking';
import { calculateDuration } from '../utils/formatters';

interface RegisterEntryPayload {
  plate: string;
  vehicleType: VehicleType;
  serviceType: ServiceType;
  userId?: string;
  clientName?: string;
  cellId: string;
  initialConditionNotes?: string;
  entryTime?: string;
}

interface RegisterExitResult {
  entry: VehicleEntry;
  payment?: Payment;
}

interface ParkingContextType {
  cells: ParkingCell[];
  activeEntries: VehicleEntry[];
  completedEntries: VehicleEntry[];
  clients: UserClient[];
  incidents: VehicleIncident[];
  payments: Payment[];
  config: BusinessConfig;
  
  // Actions
  registerEntry: (payload: RegisterEntryPayload) => VehicleEntry;
  calculateExitQuote: (entryId: string) => {
    durationMinutes: number;
    durationFormatted: string;
    rateApplied: number;
    subtotal: number;
    discount: number;
    totalToPay: number;
    isMensualidadActive: boolean;
  };
  registerExit: (
    entryId: string,
    paymentMethod: PaymentMethod,
    discount?: number,
    additionalCharge?: number,
    notes?: string
  ) => RegisterExitResult;
  createClient: (client: Omit<UserClient, 'id' | 'createdAt'>, initialPaymentMethod?: PaymentMethod) => UserClient;
  updateClient: (id: string, updates: Partial<UserClient>) => void;
  renewSubscription: (clientId: string, months: number, paymentMethod: PaymentMethod) => Payment;
  updateCellStatus: (cellId: string, status: CellStatus, notes?: string) => void;
  createCell: (cell: Omit<ParkingCell, 'id'>) => ParkingCell;
  createIncident: (incident: {
    plate: string;
    cellId?: string;
    vehicleType?: VehicleType;
    type: IncidentType;
    severity: IncidentSeverity;
    description: string;
    reportedBy: string;
    clientPhone?: string;
  }) => VehicleIncident;
  updateIncidentStatus: (id: string, status: IncidentStatus, resolutionNotes?: string) => void;
  recordDirectPayment: (payment: Omit<Payment, 'id' | 'receiptNumber' | 'date'>) => Payment;
  updateConfig: (newConfig: BusinessConfig) => void;
  resetToDemoData: () => void;
}

const ParkingContext = createContext<ParkingContextType | null>(null);

const STORAGE_KEYS = {
  CELLS: 'pac_cells_v1',
  ACTIVE_ENTRIES: 'pac_active_entries_v1',
  COMPLETED_ENTRIES: 'pac_completed_entries_v1',
  CLIENTS: 'pac_clients_v1',
  INCIDENTS: 'pac_incidents_v1',
  PAYMENTS: 'pac_payments_v1',
  CONFIG: 'pac_config_v1',
};

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cells, setCells] = useState<ParkingCell[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CELLS);
    return saved ? JSON.parse(saved) : INITIAL_CELLS;
  });

  const [activeEntries, setActiveEntries] = useState<VehicleEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ENTRIES);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_ENTRIES;
  });

  const [completedEntries, setCompletedEntries] = useState<VehicleEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_ENTRIES);
    return saved ? JSON.parse(saved) : [];
  });

  const [clients, setClients] = useState<UserClient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [incidents, setIncidents] = useState<VehicleIncident[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [config, setConfig] = useState<BusinessConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CELLS, JSON.stringify(cells));
  }, [cells]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ENTRIES, JSON.stringify(activeEntries));
  }, [activeEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_ENTRIES, JSON.stringify(completedEntries));
  }, [completedEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }, [config]);

  // Recalculate subscription statuses periodically
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setClients(prev =>
      prev.map(c => {
        const end = c.subscription.endDate;
        const diffDays = Math.ceil(
          (new Date(end).getTime() - new Date(today).getTime()) / (1000 * 3600 * 24)
        );
        let newStatus = c.subscription.status;
        if (diffDays < 0) {
          newStatus = 'VENCIDA';
        } else if (diffDays <= 5) {
          newStatus = 'POR_VENCER';
        } else {
          newStatus = 'ACTIVA';
        }
        if (newStatus !== c.subscription.status) {
          return {
            ...c,
            subscription: { ...c.subscription, status: newStatus }
          };
        }
        return c;
      })
    );
  }, []);

  const registerEntry = (payload: RegisterEntryPayload): VehicleEntry => {
    const normPlate = payload.plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const ticketSeq = Math.floor(1000 + Math.random() * 9000);
    const newTicketNumber = `PAC-2026-${ticketSeq}`;
    
    // Check if client is registered by plate
    let foundUserId = payload.userId;
    let foundClientName = payload.clientName;
    let effectiveServiceType = payload.serviceType;

    if (!foundUserId) {
      const matchClient = clients.find(c => 
        c.vehicles.some(v => v.plate.toUpperCase().replace(/[^A-Z0-9]/g, '') === normPlate)
      );
      if (matchClient) {
        foundUserId = matchClient.id;
        foundClientName = matchClient.fullName;
        if (matchClient.subscription.status !== 'VENCIDA') {
          effectiveServiceType = 'MENSUALIDAD';
        }
      }
    }

    const newEntry: VehicleEntry = {
      id: `ent-${Date.now()}`,
      ticketNumber: newTicketNumber,
      plate: normPlate,
      vehicleType: payload.vehicleType,
      serviceType: effectiveServiceType,
      userId: foundUserId,
      clientName: foundClientName,
      cellId: payload.cellId,
      entryTime: payload.entryTime || new Date().toISOString(),
      initialConditionNotes: payload.initialConditionNotes,
      status: 'ACTIVO',
    };

    setActiveEntries(prev => [newEntry, ...prev]);

    // Update cell status
    setCells(prev =>
      prev.map(cell => {
        if (cell.id === payload.cellId) {
          return {
            ...cell,
            status: 'OCUPADA',
            currentVehiclePlate: normPlate,
          };
        }
        return cell;
      })
    );

    return newEntry;
  };

  const calculateExitQuote = (entryId: string) => {
    const entry = activeEntries.find(e => e.id === entryId);
    if (!entry) {
      return {
        durationMinutes: 0,
        durationFormatted: '0m',
        rateApplied: 0,
        subtotal: 0,
        discount: 0,
        totalToPay: 0,
        isMensualidadActive: false,
      };
    }

    const { totalMinutes, formattedString } = calculateDuration(entry.entryTime);
    
    // Check if monthly subscription covers this entry
    let isMensualidadActive = false;
    if (entry.serviceType === 'MENSUALIDAD' && entry.userId) {
      const client = clients.find(c => c.id === entry.userId);
      if (client && client.subscription.status !== 'VENCIDA') {
        isMensualidadActive = true;
      }
    }

    if (isMensualidadActive) {
      return {
        durationMinutes: totalMinutes,
        durationFormatted: formattedString,
        rateApplied: 0,
        subtotal: 0,
        discount: 0,
        totalToPay: 0,
        isMensualidadActive: true,
      };
    }

    // Occasional parking fee calculation
    const hourlyRate = config.hourlyRates[entry.vehicleType] || 4000;
    
    // Check grace period (e.g., first 15 mins free if specified)
    if (totalMinutes <= config.gracePeriodMinutes) {
      return {
        durationMinutes: totalMinutes,
        durationFormatted: formattedString,
        rateApplied: hourlyRate,
        subtotal: 0,
        discount: 0,
        totalToPay: 0,
        isMensualidadActive: false,
      };
    }

    // Bill by fractions of an hour (e.g. 1 hour minimum, rounded up or proportional)
    const billableHours = Math.max(1, Math.ceil(totalMinutes / 60));
    const subtotal = billableHours * hourlyRate;

    return {
      durationMinutes: totalMinutes,
      durationFormatted: formattedString,
      rateApplied: hourlyRate,
      subtotal,
      discount: 0,
      totalToPay: subtotal,
      isMensualidadActive: false,
    };
  };

  const registerExit = (
    entryId: string,
    paymentMethod: PaymentMethod,
    discount = 0,
    additionalCharge = 0,
    notes?: string
  ): RegisterExitResult => {
    const entry = activeEntries.find(e => e.id === entryId);
    if (!entry) {
      throw new Error('Vehículo no encontrado en patio activo');
    }

    const quote = calculateExitQuote(entryId);
    const finalAmount = Math.max(0, quote.totalToPay - discount + additionalCharge);
    const exitTime = new Date().toISOString();

    let createdPayment: Payment | undefined;

    // If there is an amount to pay or customer made payment, generate Payment record
    if (finalAmount > 0 || quote.isMensualidadActive === false) {
      const receiptSeq = Math.floor(10000 + Math.random() * 90000);
      createdPayment = {
        id: `pay-${Date.now()}`,
        receiptNumber: `REC-${receiptSeq}`,
        date: exitTime,
        concept: 'PARQUEO_OCASIONAL',
        amount: finalAmount,
        paymentMethod: paymentMethod,
        plate: entry.plate,
        userId: entry.userId,
        clientName: entry.clientName || 'Cliente Ocasional',
        clientDoc: entry.userId 
          ? clients.find(c => c.id === entry.userId)?.docNumber || 'Consumidor Final'
          : 'Consumidor Final',
        details: `Salida de parqueadero ticket ${entry.ticketNumber} - Duración: ${quote.durationFormatted} (${quote.durationMinutes} min). Tarifa: ${quote.rateApplied} COP/h. ${notes ? `Observaciones: ${notes}` : ''}`,
        cashier: 'Caja Principal - Operaciones',
      };

      setPayments(prev => [createdPayment!, ...prev]);
    }

    const finalizedEntry: VehicleEntry = {
      ...entry,
      status: 'FINALIZADO',
      exitTime,
      totalMinutes: quote.durationMinutes,
      amountDue: finalAmount,
      paymentId: createdPayment?.id,
    };

    // Update active and completed lists
    setActiveEntries(prev => prev.filter(e => e.id !== entryId));
    setCompletedEntries(prev => [finalizedEntry, ...prev]);

    // Free the cell or keep it reserved if assigned to subscriber
    setCells(prev =>
      prev.map(cell => {
        if (cell.id === entry.cellId) {
          const isReserved = cell.reservedForUserId;
          return {
            ...cell,
            status: isReserved ? 'RESERVADA_MENSUAL' : 'DISPONIBLE',
            currentVehiclePlate: undefined,
          };
        }
        return cell;
      })
    );

    return {
      entry: finalizedEntry,
      payment: createdPayment,
    };
  };

  const createClient = (
    clientData: Omit<UserClient, 'id' | 'createdAt'>, 
    initialPaymentMethod?: PaymentMethod
  ): UserClient => {
    const newId = `usr-${Date.now()}`;
    const newClient: UserClient = {
      ...clientData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setClients(prev => [newClient, ...prev]);

    // If a reserved cell was selected, assign it
    if (clientData.assignedCellId) {
      setCells(prev =>
        prev.map(c => {
          if (c.id === clientData.assignedCellId) {
            return {
              ...c,
              status: c.status === 'OCUPADA' ? 'OCUPADA' : 'RESERVADA_MENSUAL',
              reservedForUserId: newId,
            };
          }
          return c;
        })
      );
    }

    // If initial payment method provided, record subscription payment
    if (initialPaymentMethod && clientData.subscription.monthlyRate > 0) {
      const receiptSeq = Math.floor(10000 + Math.random() * 90000);
      const subPayment: Payment = {
        id: `pay-${Date.now()}`,
        receiptNumber: `REC-${receiptSeq}`,
        date: new Date().toISOString(),
        concept: 'MENSUALIDAD',
        amount: clientData.subscription.monthlyRate,
        paymentMethod: initialPaymentMethod,
        plate: clientData.vehicles[0]?.plate || '',
        userId: newId,
        clientName: clientData.fullName,
        clientDoc: `${clientData.docType} ${clientData.docNumber}`,
        details: `Inscripción mensualidad periodo ${clientData.subscription.startDate} al ${clientData.subscription.endDate} - Plan: ${clientData.subscription.planType}`,
        cashier: 'Administración - Autos Colombia',
      };
      setPayments(prev => [subPayment, ...prev]);
    }

    return newClient;
  };

  const updateClient = (id: string, updates: Partial<UserClient>) => {
    setClients(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const renewSubscription = (clientId: string, months: number, paymentMethod: PaymentMethod): Payment => {
    const client = clients.find(c => c.id === clientId);
    if (!client) throw new Error('Cliente no encontrado');

    const currentEnd = new Date(client.subscription.endDate);
    const baseDate = currentEnd.getTime() > Date.now() ? currentEnd : new Date();
    
    // Add months
    const newEndDate = new Date(baseDate);
    newEndDate.setMonth(newEndDate.getMonth() + months);
    const newEndDateStr = newEndDate.toISOString().split('T')[0];

    const amount = client.subscription.monthlyRate * months;

    // Update client
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          return {
            ...c,
            subscription: {
              ...c.subscription,
              endDate: newEndDateStr,
              status: 'ACTIVA',
            },
          };
        }
        return c;
      })
    );

    // Register payment
    const receiptSeq = Math.floor(10000 + Math.random() * 90000);
    const renewalPayment: Payment = {
      id: `pay-${Date.now()}`,
      receiptNumber: `REC-${receiptSeq}`,
      date: new Date().toISOString(),
      concept: 'MENSUALIDAD',
      amount,
      paymentMethod,
      plate: client.vehicles[0]?.plate || '',
      userId: clientId,
      clientName: client.fullName,
      clientDoc: `${client.docType} ${client.docNumber}`,
      details: `Renovación de mensualidad (${months} ${months === 1 ? 'mes' : 'meses'}) hasta ${newEndDateStr} - Celda: ${client.assignedCellId || 'Rotativa'}`,
      cashier: 'Caja Principal - Operaciones',
    };

    setPayments(prev => [renewalPayment, ...prev]);
    return renewalPayment;
  };

  const updateCellStatus = (cellId: string, status: CellStatus, notes?: string) => {
    setCells(prev =>
      prev.map(c => {
        if (c.id === cellId) {
          return {
            ...c,
            status,
            notes: notes !== undefined ? notes : c.notes,
          };
        }
        return c;
      })
    );
  };

  const createCell = (cellData: Omit<ParkingCell, 'id'>): ParkingCell => {
    const newCell: ParkingCell = {
      ...cellData,
      id: cellData.code.trim().toUpperCase(),
    };
    setCells(prev => [...prev, newCell]);
    return newCell;
  };

  const createIncident = (incidentData: {
    plate: string;
    cellId?: string;
    vehicleType?: VehicleType;
    type: IncidentType;
    severity: IncidentSeverity;
    description: string;
    reportedBy: string;
    clientPhone?: string;
  }): VehicleIncident => {
    const codeSeq = Math.floor(100 + Math.random() * 900);
    const newIncident: VehicleIncident = {
      id: `inc-${Date.now()}`,
      code: `NOV-${codeSeq}`,
      plate: incidentData.plate.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      cellId: incidentData.cellId,
      vehicleType: incidentData.vehicleType,
      date: new Date().toISOString(),
      type: incidentData.type,
      severity: incidentData.severity,
      description: incidentData.description,
      reportedBy: incidentData.reportedBy || 'Operador de Turno',
      status: 'PENDIENTE',
      clientPhone: incidentData.clientPhone,
    };

    setIncidents(prev => [newIncident, ...prev]);
    return newIncident;
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus, resolutionNotes?: string) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === id) {
          return {
            ...inc,
            status,
            resolutionNotes: resolutionNotes || inc.resolutionNotes,
            resolvedAt: status === 'RESUELTA' ? new Date().toISOString() : inc.resolvedAt,
          };
        }
        return inc;
      })
    );
  };

  const recordDirectPayment = (paymentData: Omit<Payment, 'id' | 'receiptNumber' | 'date'>): Payment => {
    const receiptSeq = Math.floor(10000 + Math.random() * 90000);
    const payment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber: `REC-${receiptSeq}`,
      date: new Date().toISOString(),
    };
    setPayments(prev => [payment, ...prev]);
    return payment;
  };

  const updateConfig = (newConfig: BusinessConfig) => {
    setConfig(newConfig);
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.CELLS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);

    setCells(INITIAL_CELLS);
    setActiveEntries(INITIAL_ACTIVE_ENTRIES);
    setCompletedEntries([]);
    setClients(INITIAL_CLIENTS);
    setIncidents(INITIAL_INCIDENTS);
    setPayments(INITIAL_PAYMENTS);
    setConfig(INITIAL_CONFIG);
  };

  return (
    <ParkingContext.Provider
      value={{
        cells,
        activeEntries,
        completedEntries,
        clients,
        incidents,
        payments,
        config,
        registerEntry,
        calculateExitQuote,
        registerExit,
        createClient,
        updateClient,
        renewSubscription,
        updateCellStatus,
        createCell,
        createIncident,
        updateIncidentStatus,
        recordDirectPayment,
        updateConfig,
        resetToDemoData,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
