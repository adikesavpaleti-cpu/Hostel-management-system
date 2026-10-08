import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import RoomsView from './components/RoomsView';
import ResidentsView from './components/ResidentsView';
import AllocationsView from './components/AllocationsView';
import FeesView from './components/FeesView';
import ComplaintsView from './components/ComplaintsView';
import GatePassView from './components/GatePassView';
import MessView from './components/MessView';
import StudentPortalView from './components/StudentPortalView';
import Toast from './components/Toast';

import { 
  RoomDetailsModal, 
  StudentProfileModal, 
  RegisterStudentModal, 
  PrintReceiptModal,
  RaiseComplaintModal,
  RequestGatePassModal,
  RegisterVisitorModal
} from './components/Modals';

import { getAppData, saveAppData, resetStorageToDefaults } from './data/storage';

export default function App() {
  const [appData, setAppData] = useState(getAppData);
  const [persona, setPersona] = useState('warden'); // 'warden' or 'student'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'allocate', 'registerStudent', 'addComplaint', 'addPass', 'addVisitor'
  const [selectedRoomModal, setSelectedRoomModal] = useState(null);
  const [selectedResidentModal, setSelectedResidentModal] = useState(null);
  const [selectedReceiptModal, setSelectedReceiptModal] = useState(null);

  // Sync persona changes to tab
  const handlePersonaChange = (newPersona) => {
    setPersona(newPersona);
    if (newPersona === 'student') {
      setActiveTab('student_portal');
      showToast('Switched to Student Persona (Alex Johnson - Room A-204)', 'info');
    } else {
      setActiveTab('dashboard');
      showToast('Switched to Warden / Admin Management Portal', 'info');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all hostel management data back to default demo records?')) {
      resetStorageToDefaults();
      setAppData(getAppData());
      showToast('Demo data successfully restored to default state!', 'success');
    }
  };

  // --- Core CRUD Handlers ---

  // 1. Room Allocation
  const handleAllocateRoom = ({ residentId, blockId, roomNo, bedNo, checkInDate, cautionPaid }) => {
    const updatedResidents = appData.residents.map(res => {
      if (res.id === residentId) {
        return {
          ...res,
          blockId,
          roomNo,
          bedNo,
          checkInDate,
          cautionDepositPaid: cautionPaid
        };
      }
      return res;
    });

    // Update Room occupancy status
    const roomResCount = updatedResidents.filter(r => r.roomNo === roomNo).length;
    const targetRoom = appData.rooms.find(r => r.roomNo === roomNo);
    const newStatus = roomResCount >= targetRoom?.capacity ? 'Occupied' : 'Partial';

    const updatedRooms = appData.rooms.map(r => {
      if (r.roomNo === roomNo) return { ...r, status: newStatus };
      return r;
    });

    setAppData(prev => {
      const next = { ...prev, residents: updatedResidents, rooms: updatedRooms };
      saveAppData('RESIDENTS', updatedResidents);
      saveAppData('ROOMS', updatedRooms);
      return next;
    });
  };

  // 2. Register Student
  const handleRegisterStudent = (formData) => {
    const newId = `RES-${1000 + appData.residents.length + 1}`;
    const newRes = {
      id: newId,
      ...formData,
      checkInDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      feeStatus: 'Paid',
      avatarBg: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)}, #3b82f6)`
    };

    const updatedResidents = [...appData.residents, newRes];

    // Create fee record
    const newFee = {
      id: `REC-${900 + appData.fees.length + 1}`,
      residentId: newId,
      residentName: formData.name,
      rollNo: formData.rollNo,
      roomNo: formData.roomNo,
      blockId: formData.blockId,
      term: 'Fall Semester 2026',
      roomRent: 1800,
      messFee: 800,
      cautionDeposit: 200,
      wifiFee: 100,
      totalAmount: 2900,
      amountPaid: 2900,
      balanceDue: 0,
      status: 'Paid',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'NetBanking',
      transactionId: `TXN-${Math.floor(10000000 + Math.random()*90000000)}`
    };

    const updatedFees = [...appData.fees, newFee];

    setAppData(prev => {
      const next = { ...prev, residents: updatedResidents, fees: updatedFees };
      saveAppData('RESIDENTS', updatedResidents);
      saveAppData('FEES', updatedFees);
      return next;
    });

    showToast(`Registered student ${formData.name} & allocated to Room ${formData.roomNo}!`);
  };

  // 3. Record Fee Payment
  const handleRecordPayment = (feeObj) => {
    const updatedFees = appData.fees.map(f => {
      if (f.id === feeObj.id) {
        return {
          ...f,
          amountPaid: f.totalAmount,
          balanceDue: 0,
          status: 'Paid',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'NetBanking / UPI'
        };
      }
      return f;
    });

    const updatedResidents = appData.residents.map(r => {
      if (r.id === feeObj.residentId) {
        return { ...r, feeStatus: 'Paid' };
      }
      return r;
    });

    setAppData(prev => {
      const next = { ...prev, fees: updatedFees, residents: updatedResidents };
      saveAppData('FEES', updatedFees);
      saveAppData('RESIDENTS', updatedResidents);
      return next;
    });

    showToast(`Payment of $${feeObj.balanceDue || feeObj.totalAmount} cleared for ${feeObj.residentName}!`);
  };

  // 4. Raise Complaint
  const handleRaiseComplaint = (cData) => {
    const newId = `CMP-${400 + appData.complaints.length + 1}`;
    const newComplaint = {
      id: newId,
      residentId: 'RES-1001',
      ...cData,
      status: 'Pending',
      reportedDate: new Date().toLocaleString(),
      assignedTo: 'Unassigned',
      wardenNotes: 'Ticket queued for technician inspection.'
    };

    const updatedComplaints = [newComplaint, ...appData.complaints];

    setAppData(prev => {
      const next = { ...prev, complaints: updatedComplaints };
      saveAppData('COMPLAINTS', updatedComplaints);
      return next;
    });

    showToast(`Complaint ${newId} submitted for Room ${cData.roomNo}!`);
  };

  // 5. Update Complaint Status
  const handleUpdateComplaintStatus = (cObj) => {
    const nextStatus = cObj.status === 'Pending' ? 'In Progress' : 'Resolved';
    const updated = appData.complaints.map(c => {
      if (c.id === cObj.id) return { ...c, status: nextStatus };
      return c;
    });

    setAppData(prev => {
      const next = { ...prev, complaints: updated };
      saveAppData('COMPLAINTS', updated);
      return next;
    });

    showToast(`Updated ticket ${cObj.id} status to ${nextStatus}!`);
  };

  // 6. Gate Pass Actions
  const handleApprovePass = (passId) => {
    const updated = appData.gatePasses.map(g => {
      if (g.id === passId) return { ...g, status: 'Approved', approvedBy: 'Dr. Robert Vance (Warden)' };
      return g;
    });
    setAppData(prev => {
      const next = { ...prev, gatePasses: updated };
      saveAppData('GATE_PASSES', updated);
      return next;
    });
    showToast(`Gate Pass ${passId} Approved!`);
  };

  const handleRejectPass = (passId) => {
    const updated = appData.gatePasses.map(g => {
      if (g.id === passId) return { ...g, status: 'Rejected' };
      return g;
    });
    setAppData(prev => {
      const next = { ...prev, gatePasses: updated };
      saveAppData('GATE_PASSES', updated);
      return next;
    });
    showToast(`Gate Pass ${passId} Rejected.`, 'info');
  };

  const handleRequestPass = (passData) => {
    const newId = `GP-${700 + appData.gatePasses.length + 1}`;
    const newPass = {
      id: newId,
      residentId: 'RES-1001',
      ...passData,
      status: 'Pending',
      approvedBy: '-',
      qrCodeVal: `${newId}-APPROVED`
    };

    const updated = [newPass, ...appData.gatePasses];
    setAppData(prev => {
      const next = { ...prev, gatePasses: updated };
      saveAppData('GATE_PASSES', updated);
      return next;
    });
    showToast(`Submitted Outing Gate Pass ${newId} for warden approval!`);
  };

  // 7. Register Visitor
  const handleRegisterVisitor = (visitorData) => {
    const newId = `VIS-${300 + appData.visitors.length + 1}`;
    const newVis = {
      id: newId,
      ...visitorData,
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      exitTime: 'In Campus'
    };

    const updated = [newVis, ...appData.visitors];
    setAppData(prev => {
      const next = { ...prev, visitors: updated };
      saveAppData('VISITORS', updated);
      return next;
    });
    showToast(`Logged visitor ${visitorData.visitorName} at Security Gate!`);
  };

  // 8. Toggle Room Maintenance
  const handleToggleMaintenance = (roomId) => {
    const updatedRooms = appData.rooms.map(r => {
      if (r.id === roomId) {
        const nextStatus = r.status === 'Maintenance' ? 'Vacant' : 'Maintenance';
        return { ...r, status: nextStatus };
      }
      return r;
    });

    setAppData(prev => {
      const next = { ...prev, rooms: updatedRooms };
      saveAppData('ROOMS', updatedRooms);
      return next;
    });
    showToast('Updated room maintenance status.');
  };

  // 9. Toggle Meal Opt Out
  const handleToggleMealOptOut = (dayName) => {
    const currentList = appData.mealOptOuts || [];
    const nextList = currentList.includes(dayName) 
      ? currentList.filter(d => d !== dayName) 
      : [...currentList, dayName];

    setAppData(prev => {
      const next = { ...prev, mealOptOuts: nextList };
      saveAppData('MEAL_OPTOUTS', nextList);
      return next;
    });

    showToast(nextList.includes(dayName) ? `Opted out of meal on ${dayName}!` : `Restored meal headcount for ${dayName}.`);
  };

  // Side counts for sidebar badges
  const sideCounts = {
    residents: appData.residents.length,
    pendingFees: appData.fees.filter(f => f.status !== 'Paid').length,
    pendingComplaints: appData.complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length,
    pendingGatePasses: appData.gatePasses.filter(g => g.status === 'Pending').length
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        persona={persona}
        setPersona={handlePersonaChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onResetData={handleResetData}
      />

      <div className="app-main">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={sideCounts}
          persona={persona}
        />

        {/* Main Content Area */}
        <main className="content-area">
          
          {activeTab === 'dashboard' && (
            <DashboardView
              data={appData}
              setActiveTab={setActiveTab}
              onOpenModal={(modalName) => {
                if (modalName === 'allocate') setActiveTab('allocations');
                else if (modalName === 'registerStudent') setActiveModal('registerStudent');
                else if (modalName === 'addComplaint') setActiveModal('addComplaint');
              }}
            />
          )}

          {activeTab === 'rooms' && (
            <RoomsView
              data={appData}
              searchQuery={searchQuery}
              onSelectRoom={(room) => setSelectedRoomModal(room)}
              onOpenAllocateModal={(room) => setActiveTab('allocations')}
              onToggleMaintenance={handleToggleMaintenance}
            />
          )}

          {activeTab === 'residents' && (
            <ResidentsView
              data={appData}
              searchQuery={searchQuery}
              onSelectResident={(resident) => setSelectedResidentModal(resident)}
              onOpenRegisterModal={() => setActiveModal('registerStudent')}
            />
          )}

          {activeTab === 'allocations' && (
            <AllocationsView
              data={appData}
              onAllocateRoom={handleAllocateRoom}
              onToast={showToast}
            />
          )}

          {activeTab === 'fees' && (
            <FeesView
              data={appData}
              onRecordPayment={handleRecordPayment}
              onSelectReceipt={(receipt) => setSelectedReceiptModal(receipt)}
            />
          )}

          {activeTab === 'complaints' && (
            <ComplaintsView
              data={appData}
              onOpenRaiseModal={() => setActiveModal('addComplaint')}
              onUpdateComplaint={handleUpdateComplaintStatus}
            />
          )}

          {activeTab === 'gatepass' && (
            <GatePassView
              data={appData}
              onApprovePass={handleApprovePass}
              onRejectPass={handleRejectPass}
              onOpenPassModal={() => setActiveModal('addPass')}
              onOpenVisitorModal={() => setActiveModal('addVisitor')}
            />
          )}

          {activeTab === 'mess' && (
            <MessView
              data={appData}
              onToggleMealOptOut={handleToggleMealOptOut}
              mealOptOuts={appData.mealOptOuts || []}
            />
          )}

          {activeTab === 'student_portal' && (
            <StudentPortalView
              data={appData}
              onOpenModal={(modalName) => setActiveModal(modalName)}
              onSelectReceipt={(receipt) => setSelectedReceiptModal(receipt)}
              onToggleMealOptOut={handleToggleMealOptOut}
              mealOptOuts={appData.mealOptOuts || []}
            />
          )}

        </main>
      </div>

      {/* --- Render Modals --- */}
      
      {/* 1. Room Details Modal */}
      {selectedRoomModal && (
        <RoomDetailsModal
          room={selectedRoomModal}
          block={appData.blocks.find(b => b.id === selectedRoomModal.blockId)}
          residents={appData.residents}
          onClose={() => setSelectedRoomModal(null)}
          onOpenAllocate={() => setActiveTab('allocations')}
          onToggleMaintenance={handleToggleMaintenance}
        />
      )}

      {/* 2. Resident Student Profile Modal */}
      {selectedResidentModal && (
        <StudentProfileModal
          resident={selectedResidentModal}
          block={appData.blocks.find(b => b.id === selectedResidentModal.blockId)}
          fee={appData.fees.find(f => f.residentId === selectedResidentModal.id)}
          onClose={() => setSelectedResidentModal(null)}
        />
      )}

      {/* 3. Register Student Modal */}
      {activeModal === 'registerStudent' && (
        <RegisterStudentModal
          blocks={appData.blocks}
          rooms={appData.rooms}
          onClose={() => setActiveModal(null)}
          onRegister={handleRegisterStudent}
        />
      )}

      {/* 4. Print Receipt Modal */}
      {selectedReceiptModal && (
        <PrintReceiptModal
          receipt={selectedReceiptModal}
          onClose={() => setSelectedReceiptModal(null)}
        />
      )}

      {/* 5. Raise Complaint Modal */}
      {activeModal === 'addComplaint' && (
        <RaiseComplaintModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleRaiseComplaint}
        />
      )}

      {/* 6. Request Gate Pass Modal */}
      {activeModal === 'addPass' && (
        <RequestGatePassModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleRequestPass}
        />
      )}

      {/* 7. Register Security Gate Visitor Modal */}
      {activeModal === 'addVisitor' && (
        <RegisterVisitorModal
          residents={appData.residents}
          onClose={() => setActiveModal(null)}
          onSubmit={handleRegisterVisitor}
        />
      )}

      {/* Toast Popup Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
