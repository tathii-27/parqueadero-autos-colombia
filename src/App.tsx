import React, { useState } from 'react';
import { ParkingProvider } from './context/ParkingContext';
import { ActiveTab, Header } from './components/Header';
import { LiveOperationsView } from './components/LiveOperationsView';
import { CellsView } from './components/CellsView';
import { UsersView } from './components/UsersView';
import { IncidentsView } from './components/IncidentsView';
import { PaymentsView } from './components/PaymentsView';
import { RequirementsView } from './components/RequirementsView';
import { ArchitectureView } from './components/ArchitectureView';
import { PackageDiagramView } from './components/PackageDiagramView';
import { UseCaseDiagramView } from './components/UseCaseDiagramView';
import { FigmaMockupsView } from './components/FigmaMockupsView';
import { DatabaseModelView } from './components/DatabaseModelView';
import { SettingsView } from './components/SettingsView';
import { EntryModal } from './components/EntryModal';
import { ExitModal } from './components/ExitModal';
import { TicketPrintModal } from './components/TicketPrintModal';
import { VehicleEntry } from './types/parking';

function ParkingApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('operaciones');

  // Entry Modal State
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [preselectedCellId, setPreselectedCellId] = useState<string | undefined>();

  // Exit Modal State
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [selectedEntryForExit, setSelectedEntryForExit] = useState<VehicleEntry | null>(null);

  // Ticket / Receipt Modal State
  const [ticketModalState, setTicketModalState] = useState<{
    isOpen: boolean;
    type: 'ENTRY_TICKET' | 'EXIT_RECEIPT';
    ticketOrReceiptNumber: string;
    plate: string;
  }>({
    isOpen: false,
    type: 'ENTRY_TICKET',
    ticketOrReceiptNumber: '',
    plate: '',
  });

  // Incident Quick Prefill
  const [incidentPrefill, setIncidentPrefill] = useState<{ plate: string; cellId?: string }>({
    plate: '',
    cellId: '',
  });

  // Handlers
  const handleOpenNewEntry = (cellId?: string) => {
    setPreselectedCellId(cellId);
    setIsEntryModalOpen(true);
  };

  const handleEntrySuccess = (ticketNumber: string, plate: string) => {
    setTicketModalState({
      isOpen: true,
      type: 'ENTRY_TICKET',
      ticketOrReceiptNumber: ticketNumber,
      plate,
    });
  };

  const handleSelectExit = (entry: VehicleEntry) => {
    setSelectedEntryForExit(entry);
    setIsExitModalOpen(true);
  };

  const handleExitSuccess = (entry: VehicleEntry, receiptId?: string) => {
    if (receiptId) {
      setTicketModalState({
        isOpen: true,
        type: 'EXIT_RECEIPT',
        ticketOrReceiptNumber: receiptId,
        plate: entry.plate,
      });
    }
  };

  const handleViewTicketOrReceipt = (
    ticketOrReceiptNumber: string,
    plate: string,
    isReceipt = false
  ) => {
    setTicketModalState({
      isOpen: true,
      type: isReceipt ? 'EXIT_RECEIPT' : 'ENTRY_TICKET',
      ticketOrReceiptNumber,
      plate,
    });
  };

  const handleOpenIncidentForVehicle = (plate: string, cellId?: string) => {
    setIncidentPrefill({ plate, cellId });
    setActiveTab('novedades');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewEntry={() => handleOpenNewEntry()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'operaciones' && (
          <LiveOperationsView
            onOpenNewEntry={() => handleOpenNewEntry()}
            onSelectExit={handleSelectExit}
            onViewTicket={(ticket, plate) => handleViewTicketOrReceipt(ticket, plate, false)}
            onOpenIncident={handleOpenIncidentForVehicle}
          />
        )}

        {activeTab === 'celdas' && (
          <CellsView
            onDirectEntryToCell={cellId => handleOpenNewEntry(cellId)}
            onDirectExitFromCell={plate => {
              // Switch to operations with prefill
              setActiveTab('operaciones');
            }}
          />
        )}

        {activeTab === 'usuarios' && (
          <UsersView
            onViewReceipt={(rec, plate) => handleViewTicketOrReceipt(rec, plate, true)}
          />
        )}

        {activeTab === 'novedades' && (
          <IncidentsView
            initialPlate={incidentPrefill.plate}
            initialCellId={incidentPrefill.cellId}
            onClearInitialValues={() => setIncidentPrefill({ plate: '', cellId: '' })}
          />
        )}

        {activeTab === 'pagos' && (
          <PaymentsView
            onViewReceipt={(rec, plate) => handleViewTicketOrReceipt(rec, plate, true)}
          />
        )}

        {activeTab === 'requisitos' && (
          <RequirementsView
            onNavigateToOperations={() => setActiveTab('operaciones')}
            onOpenNewEntry={() => handleOpenNewEntry()}
          />
        )}

        {activeTab === 'arquitectura' && <ArchitectureView />}

        {activeTab === 'paquetes' && <PackageDiagramView />}

        {activeTab === 'casos_uso' && <UseCaseDiagramView />}

        {activeTab === 'mockups' && <FigmaMockupsView />}

        {activeTab === 'basedatos' && <DatabaseModelView />}

        {activeTab === 'configuracion' && <SettingsView />}
      </main>

      {/* Entry Modal */}
      <EntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onEntrySuccess={handleEntrySuccess}
        preselectedCellId={preselectedCellId}
      />

      {/* Exit Modal */}
      <ExitModal
        isOpen={isExitModalOpen}
        entry={selectedEntryForExit}
        onClose={() => {
          setIsExitModalOpen(false);
          setSelectedEntryForExit(null);
        }}
        onExitSuccess={handleExitSuccess}
      />

      {/* Printable Ticket / Receipt Modal */}
      <TicketPrintModal
        isOpen={ticketModalState.isOpen}
        onClose={() =>
          setTicketModalState(prev => ({ ...prev, isOpen: false }))
        }
        type={ticketModalState.type}
        ticketOrReceiptNumber={ticketModalState.ticketOrReceiptNumber}
        plate={ticketModalState.plate}
      />

      {/* Clean quiet footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Parqueadero Autos Colombia · Sistema de Control Operativo y Facturación
          </div>
          <div>
            Estándar IEEE 830 · Ingeniería de Requerimientos IU Digital de Antioquia
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ParkingProvider>
      <ParkingApp />
    </ParkingProvider>
  );
}
