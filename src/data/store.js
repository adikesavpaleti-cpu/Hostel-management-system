import { DEFAULT_HOSTEL_DATA } from './initialData.js';

const STORAGE_KEY = 'HOSTEL_MGMT_DATA_V3';

class Store {
  constructor() {
    this.listeners = [];
    this.data = this.loadData();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load storage:', e);
    }
    this.saveData(DEFAULT_HOSTEL_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_HOSTEL_DATA));
  }

  saveData(newData) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to save storage:', e);
    }
  }

  getData() {
    return this.data;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveData(this.data);
    this.listeners.forEach(l => l(this.data));
  }

  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_HOSTEL_DATA));
    this.notify();
  }

  // --- CRUD Actions ---

  allocateRoom({ residentId, blockId, roomNo, bedNo, checkInDate, cautionPaid }) {
    const resident = this.data.residents.find(r => r.id === residentId);
    if (!resident) return false;

    resident.blockId = blockId;
    resident.roomNo = roomNo;
    resident.bedNo = bedNo;
    resident.checkInDate = checkInDate || new Date().toISOString().split('T')[0];
    resident.cautionDepositPaid = cautionPaid;

    // Recalculate room status
    const targetRoom = this.data.rooms.find(r => r.roomNo === roomNo);
    if (targetRoom) {
      const occupiedCount = this.data.residents.filter(r => r.roomNo === roomNo).length;
      if (occupiedCount >= targetRoom.capacity) {
        targetRoom.status = 'Occupied';
      } else if (occupiedCount > 0) {
        targetRoom.status = 'Partial';
      } else {
        targetRoom.status = 'Vacant';
      }
    }

    this.notify();
    return true;
  }

  registerResident(residentData) {
    const newId = `RES-${100 + this.data.residents.length + 1}`;
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#ec4899', '#8b5cf6', '#f59e0b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newResident = {
      id: newId,
      ...residentData,
      avatarBg: randomColor
    };

    this.data.residents.unshift(newResident);

    // If room assigned, update room status
    if (newResident.roomNo) {
      const targetRoom = this.data.rooms.find(r => r.roomNo === newResident.roomNo);
      if (targetRoom) {
        const count = this.data.residents.filter(r => r.roomNo === newResident.roomNo).length;
        targetRoom.status = count >= targetRoom.capacity ? 'Occupied' : 'Partial';
      }
    }

    // Auto-generate Fee Invoice in ₹ INR
    const room = this.data.rooms.find(r => r.roomNo === newResident.roomNo);
    const roomFee = room ? room.feePerSemester : 45000;
    const newInvoice = {
      id: `INV-2026-00${this.data.fees.length + 1}`,
      residentId: newId,
      residentName: newResident.name,
      rollNo: newResident.rollNo,
      roomNo: newResident.roomNo || 'Unassigned',
      academicTerm: 'Odd Sem 2026-27',
      hostelFee: roomFee,
      messFee: 18000,
      cautionDeposit: newResident.cautionDepositAmount || 5000,
      totalAmount: roomFee + 18000 + (newResident.cautionDepositAmount || 5000),
      amountPaid: newResident.cautionDepositPaid ? 5000 : 0,
      balanceDue: roomFee + 18000 + (newResident.cautionDepositPaid ? 0 : 5000),
      dueDate: '2026-10-31',
      paymentDate: newResident.cautionDepositPaid ? new Date().toISOString().split('T')[0] : '',
      paymentMode: newResident.cautionDepositPaid ? 'Online UPI' : '-',
      transactionRef: newResident.cautionDepositPaid ? `UPI/${Math.floor(Math.random()*9000000000 + 1000000000)}/REG` : '-',
      status: newResident.cautionDepositPaid ? 'Pending' : 'Overdue'
    };

    this.data.fees.unshift(newInvoice);

    this.notify();
    return newResident;
  }

  vacateResident(residentId) {
    const resident = this.data.residents.find(r => r.id === residentId);
    if (!resident) return;

    const oldRoomNo = resident.roomNo;
    resident.roomNo = '';
    resident.bedNo = '';
    resident.blockId = '';

    if (oldRoomNo) {
      const room = this.data.rooms.find(r => r.roomNo === oldRoomNo);
      if (room) {
        const remaining = this.data.residents.filter(r => r.roomNo === oldRoomNo).length;
        room.status = remaining === 0 ? 'Vacant' : 'Partial';
      }
    }

    this.notify();
  }

  recordPayment({ feeId, amount, paymentMode, transactionRef }) {
    const fee = this.data.fees.find(f => f.id === feeId);
    if (!fee) return false;

    fee.amountPaid += Number(amount);
    fee.balanceDue = Math.max(0, fee.totalAmount - fee.amountPaid);
    fee.paymentDate = new Date().toISOString().split('T')[0];
    fee.paymentMode = paymentMode;
    fee.transactionRef = transactionRef || `TXN-${Math.floor(Math.random()*900000 + 100000)}`;

    if (fee.balanceDue === 0) {
      fee.status = 'Paid';
    } else {
      fee.status = 'Pending';
    }

    this.notify();
    return true;
  }

  addComplaint(complaintData) {
    const newId = `CMP-2026-0${this.data.complaints.length + 10}`;
    const newComplaint = {
      id: newId,
      dateReported: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending',
      assignedTo: 'Unassigned',
      resolutionNotes: '',
      ...complaintData
    };

    this.data.complaints.unshift(newComplaint);
    this.notify();
    return newComplaint;
  }

  updateComplaintStatus(id, status, notes = '') {
    const complaint = this.data.complaints.find(c => c.id === id);
    if (complaint) {
      complaint.status = status;
      if (notes) complaint.resolutionNotes = notes;
      this.notify();
    }
  }

  requestGatePass(passData) {
    const newId = `GP-${Math.floor(Math.random()*9000 + 1000)}`;
    const newPass = {
      id: newId,
      status: 'Pending',
      approvedBy: '',
      approvalDate: '',
      qrCodeData: `${newId}|${passData.rollNo}|${passData.residentName}|PENDING`,
      ...passData
    };

    this.data.gatePasses.unshift(newPass);
    this.notify();
    return newPass;
  }

  updateGatePassStatus(id, status, wardenName = 'Dr. R. K. Sharma (Warden)') {
    const pass = this.data.gatePasses.find(g => g.id === id);
    if (pass) {
      pass.status = status;
      pass.approvedBy = wardenName;
      pass.approvalDate = new Date().toISOString().replace('T', ' ').slice(0, 16);
      pass.qrCodeData = `${id}|${pass.rollNo}|${pass.residentName}|${status.toUpperCase()}`;
      this.notify();
    }
  }

  addVisitor(visitorData) {
    const newId = `VIS-${Math.floor(Math.random()*900 + 100)}`;
    const newVisitor = {
      id: newId,
      checkInTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      checkOutTime: '',
      gateNo: 'Gate 1 Main Entry',
      status: 'Inside Campus',
      ...visitorData
    };

    this.data.visitors.unshift(newVisitor);
    this.notify();
    return newVisitor;
  }

  checkoutVisitor(id) {
    const vis = this.data.visitors.find(v => v.id === id);
    if (vis) {
      vis.checkOutTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
      vis.status = 'Checked Out';
      this.notify();
    }
  }
}

export const store = new Store();
