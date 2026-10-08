import { store } from './data/store.js';
import { getIcon } from './icons.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderRoomsView } from './views/roomsView.js';
import { renderResidentsView } from './views/residentsView.js';
import { renderAllocationsView } from './views/allocationsView.js';
import { renderFeesView } from './views/feesView.js';
import { renderComplaintsView } from './views/complaintsView.js';
import { renderGatePassView } from './views/gatePassView.js';
import { renderMessView } from './views/messView.js';
import { renderStudentPortalView } from './views/studentPortalView.js';
import { renderModalContent } from './modals.js';

class App {
  constructor() {
    this.currentTab = 'dashboard';
    this.persona = 'warden'; // 'warden' or 'student'
    this.searchQuery = '';
    this.activeModal = null;
    this.modalArg = null;
    this.modalExtra = null;

    this.init();
  }

  init() {
    // Inject header static icons
    document.getElementById('brandLogo').innerHTML = getIcon('home', 22, '#ffffff');
    document.getElementById('searchIcon').innerHTML = getIcon('search', 16);
    document.getElementById('refreshIcon').innerHTML = getIcon('refresh', 14);

    // Subscribe to store updates
    store.subscribe(() => {
      this.render();
    });

    // Close modal on background click
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'modalOverlay') {
        this.closeModal();
      }
    });

    // Initial render
    this.render();
  }

  switchPersona(newPersona) {
    this.persona = newPersona;
    const wardenBtn = document.getElementById('wardenPersonaBtn');
    const studentBtn = document.getElementById('studentPersonaBtn');

    if (newPersona === 'student') {
      wardenBtn.classList.remove('active');
      studentBtn.classList.add('active');
      this.currentTab = 'student_portal';
      this.showToast('Switched to Student Portal Persona (Alex Johnson - Room A-204)', 'info');
    } else {
      studentBtn.classList.remove('active');
      wardenBtn.classList.add('active');
      this.currentTab = 'dashboard';
      this.showToast('Switched to Warden / Admin Operations Desk', 'info');
    }

    this.render();
  }

  switchTab(tab) {
    this.currentTab = tab;
    this.render();
  }

  handleSearchInput(query) {
    this.searchQuery = query;
    if (this.currentTab !== 'residents') {
      this.currentTab = 'residents';
    }
    this.render();
  }

  openModal(type, arg = '', extra = '') {
    this.activeModal = type;
    this.modalArg = arg;
    this.modalExtra = extra;

    const overlay = document.getElementById('modalOverlay');
    const box = document.getElementById('modalBox');

    box.innerHTML = renderModalContent(type, arg, extra);
    overlay.classList.add('active');
  }

  closeModal() {
    this.activeModal = null;
    this.modalArg = null;
    this.modalExtra = null;
    document.getElementById('modalOverlay').classList.remove('active');
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const item = document.createElement('div');
    item.className = 'toast-item';
    item.style.borderColor = type === 'success' ? '#10b981' : type === 'info' ? '#38bdf8' : '#ef4444';
    item.innerHTML = `
      ${getIcon(type === 'success' ? 'check' : type === 'info' ? 'alert-circle' : 'x', 18, type === 'success' ? '#34d399' : '#38bdf8')}
      <span>${message}</span>
    `;

    container.appendChild(item);
    setTimeout(() => {
      item.style.opacity = '0';
      item.style.transition = 'opacity 0.3s ease';
      setTimeout(() => item.remove(), 300);
    }, 3500);
  }

  resetData() {
    if (confirm('Reset all hostel data back to initial default demo records?')) {
      store.resetToDefaults();
      this.showToast('Hostel management data successfully restored to defaults!', 'success');
    }
  }

  // --- Modal Form Action Handlers ---

  handleAllocateSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const residentId = form.residentId.value;
    const roomNo = form.roomNo.value;
    const bedNo = form.bedNo.value;
    const checkInDate = form.checkInDate.value;
    const cautionPaid = form.cautionPaid.value === 'true';

    const targetRoom = store.getData().rooms.find(r => r.roomNo === roomNo);
    const blockId = targetRoom ? targetRoom.blockId : 'BLK-A';

    const success = store.allocateRoom({ residentId, blockId, roomNo, bedNo, checkInDate, cautionPaid });
    if (success) {
      this.closeModal();
      this.showToast(`Successfully allocated Room ${roomNo} (${bedNo})!`, 'success');
    }
  }

  handleRegisterStudentSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const studentData = {
      name: form.name.value,
      rollNo: form.rollNo.value,
      gender: form.gender.value,
      branch: form.branch.value,
      year: form.year.value,
      phone: form.phone.value,
      parentPhone: form.parentPhone.value,
      roomNo: form.roomNo.value || '',
      bedNo: form.roomNo.value ? 'Bed 1' : '',
      blockId: form.roomNo.value ? (store.getData().rooms.find(r => r.roomNo === form.roomNo.value)?.blockId || 'BLK-A') : '',
      checkInDate: new Date().toISOString().split('T')[0],
      cautionDepositPaid: true,
      cautionDepositAmount: 5000
    };

    const newRes = store.registerResident(studentData);
    this.closeModal();
    this.showToast(`Registered resident student ${newRes.name} (${newRes.rollNo})!`, 'success');
  }

  handleCollectFeeSubmit(e, feeId) {
    e.preventDefault();
    const form = e.target;
    const amount = Number(form.amount.value);
    const paymentMode = form.paymentMode.value;
    const transactionRef = form.transactionRef.value;

    const success = store.recordPayment({ feeId, amount, paymentMode, transactionRef });
    if (success) {
      this.closeModal();
      this.showToast(`Payment of ₹${amount.toLocaleString('en-IN')} recorded successfully!`, 'success');
    }
  }

  handleAddComplaintSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const residentId = form.residentId.value;
    const resident = store.getData().residents.find(r => r.id === residentId);

    const complaintData = {
      residentId,
      residentName: resident ? resident.name : 'Alex Johnson',
      roomNo: resident ? (resident.roomNo || 'A-204') : 'A-204',
      category: form.category.value,
      title: form.title.value,
      priority: form.priority.value,
      description: form.description.value
    };

    const cmp = store.addComplaint(complaintData);
    this.closeModal();
    this.showToast(`Maintenance Ticket ${cmp.id} raised successfully!`, 'success');
  }

  handleRequestGatePassSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const residentId = form.residentId.value;
    const resident = store.getData().residents.find(r => r.id === residentId);

    const passData = {
      residentId,
      residentName: resident ? resident.name : 'Alex Johnson',
      rollNo: resident ? resident.rollNo : '2023CSE042',
      roomNo: resident ? resident.roomNo : 'A-204',
      passType: form.passType.value,
      outDate: form.outDate.value.replace('T', ' '),
      expectedInDate: form.expectedInDate.value.replace('T', ' '),
      destination: form.destination.value,
      reason: form.reason.value
    };

    const pass = store.requestGatePass(passData);
    this.closeModal();
    this.showToast(`Gate Pass request ${pass.id} submitted for approval!`, 'success');
  }

  handleAddVisitorSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const residentId = form.residentId.value;
    const resident = store.getData().residents.find(r => r.id === residentId);

    const visitorData = {
      visitorName: form.visitorName.value,
      phone: form.phone.value,
      residentName: resident ? resident.name : 'Alex Johnson',
      roomNo: resident ? resident.roomNo : 'A-204',
      relation: form.relation.value,
      idProof: form.idProof.value
    };

    const vis = store.addVisitor(visitorData);
    this.closeModal();
    this.showToast(`Visitor ${vis.visitorName} checked-in at campus gate!`, 'success');
  }

  vacateResident(residentId) {
    if (confirm('Are you sure you want to vacate this resident from their room?')) {
      store.vacateResident(residentId);
      this.showToast('Resident vacated from room successfully!', 'success');
    }
  }

  updateComplaint(id, status, notes = '') {
    store.updateComplaintStatus(id, status, notes);
    this.showToast(`Complaint status updated to ${status}!`, 'info');
  }

  resolveComplaintModal(id) {
    const notes = prompt('Enter resolution summary / technician notes:', 'Issue resolved and verified.');
    if (notes !== null) {
      store.updateComplaintStatus(id, 'Resolved', notes);
      this.showToast(`Complaint ${id} marked as Resolved!`, 'success');
    }
  }

  updateGatePass(id, status) {
    store.updateGatePassStatus(id, status);
    this.showToast(`Gate Pass ${id} ${status}!`, status === 'Approved' ? 'success' : 'info');
  }

  checkoutVisitor(id) {
    store.checkoutVisitor(id);
    this.showToast(`Visitor exit recorded.`, 'info');
  }

  // --- Sidebar & Main Renderer ---

  renderSidebar() {
    const data = store.getData();
    const openComplaintsCount = data.complaints.filter(c => c.status !== 'Resolved').length;
    const pendingPassesCount = data.gatePasses.filter(g => g.status === 'Pending').length;

    const navItems = [
      { id: 'dashboard', label: 'Dashboard Overview', icon: 'dashboard' },
      { id: 'rooms', label: 'Blocks & Rooms', icon: 'rooms' },
      { id: 'residents', label: 'Residents Registry', icon: 'residents' },
      { id: 'allocations', label: 'Bed Matrix & Allocation', icon: 'allocations' },
      { id: 'fees', label: 'Fees & Payments (₹)', icon: 'rupee' },
      { id: 'complaints', label: 'Complaints & Support', icon: 'complaints', badge: openComplaintsCount > 0 ? openComplaintsCount : null },
      { id: 'gatepass', label: 'Gate Pass & Visitors', icon: 'gatepass', badge: pendingPassesCount > 0 ? pendingPassesCount : null },
      { id: 'mess', label: 'Mess & Dining', icon: 'mess' },
      { id: 'student_portal', label: 'Student Portal View', icon: 'student' }
    ];

    const sidebarEl = document.getElementById('appSidebar');
    sidebarEl.innerHTML = navItems.map(item => `
      <div class="nav-item ${this.currentTab === item.id ? 'active' : ''}" onclick="window.app.switchTab('${item.id}')">
        <div class="nav-item-left">
          ${getIcon(item.icon, 18)}
          <span>${item.label}</span>
        </div>
        ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
      </div>
    `).join('');
  }

  render() {
    this.renderSidebar();

    const mainEl = document.getElementById('mainContent');

    switch (this.currentTab) {
      case 'dashboard':
        mainEl.innerHTML = renderDashboardView();
        break;
      case 'rooms':
        mainEl.innerHTML = renderRoomsView();
        break;
      case 'residents':
        mainEl.innerHTML = renderResidentsView(this.searchQuery);
        break;
      case 'allocations':
        mainEl.innerHTML = renderAllocationsView();
        break;
      case 'fees':
        mainEl.innerHTML = renderFeesView();
        break;
      case 'complaints':
        mainEl.innerHTML = renderComplaintsView();
        break;
      case 'gatepass':
        mainEl.innerHTML = renderGatePassView();
        break;
      case 'mess':
        mainEl.innerHTML = renderMessView();
        break;
      case 'student_portal':
        mainEl.innerHTML = renderStudentPortalView();
        break;
      default:
        mainEl.innerHTML = renderDashboardView();
    }
  }
}

// Instantiate global app
window.app = new App();
