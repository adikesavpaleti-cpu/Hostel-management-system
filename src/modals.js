import { store } from './data/store.js';
import { getIcon, formatINR } from './icons.js';

export function renderModalContent(modalType, modalArg = '', modalExtra = '') {
  const data = store.getData();

  switch (modalType) {

    // 1. Allocate Room Modal
    case 'allocate':
    case 'allocateTargetRoom': {
      const targetRoomNo = modalType === 'allocateTargetRoom' ? modalArg : '';
      const targetBlockId = modalType === 'allocateTargetRoom' ? modalExtra : '';
      const unassigned = data.residents.filter(r => !r.roomNo || r.id === modalArg);
      const availableRooms = data.rooms.filter(r => r.status !== 'Occupied');

      return `
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            ${getIcon('key', 20, 'var(--accent-primary)')} Allocate Room & Bed
          </h3>
          <button class="btn btn-secondary btn-sm" style="padding: 4px 8px;" onclick="window.app.closeModal()">${getIcon('x', 16)}</button>
        </div>

        <form onsubmit="window.app.handleAllocateSubmit(event)">
          <div class="modal-body">
            
            <div class="form-group">
              <label>Select Resident Student</label>
              <select name="residentId" class="form-control" required>
                <option value="">-- Choose Resident Student --</option>
                ${data.residents.map(r => `
                  <option value="${r.id}" ${r.id === modalArg ? 'selected' : ''}>
                    ${r.name} (${r.rollNo}) - ${r.roomNo ? `Currently in ${r.roomNo}` : 'Unassigned'}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Select Hostel Room</label>
                <select name="roomNo" class="form-control" required onchange="window.app.updateRoomBlockSelect(this.value)">
                  <option value="">-- Choose Room --</option>
                  ${availableRooms.map(rm => `
                    <option value="${rm.roomNo}" ${rm.roomNo === targetRoomNo ? 'selected' : ''}>
                      Room ${rm.roomNo} (${rm.blockId}, ${rm.type}) - ${formatINR(rm.feePerSemester)}/sem
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label>Bed Position</label>
                <select name="bedNo" class="form-control" required>
                  <option value="Bed 1">Bed 1</option>
                  <option value="Bed 2">Bed 2</option>
                  <option value="Bed 3">Bed 3</option>
                </select>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Check-In Date</label>
                <input type="date" name="checkInDate" class="form-control" value="${new Date().toISOString().split('T')[0]}" required />
              </div>

              <div class="form-group">
                <label>Caution Deposit Status (₹5,000)</label>
                <select name="cautionPaid" class="form-control">
                  <option value="true">Paid (₹5,000 INR Received)</option>
                  <option value="false">Pending Payment</option>
                </select>
              </div>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">${getIcon('check', 16)} Confirm Allocation</button>
          </div>
        </form>
      `;
    }

    // 2. Register New Student Resident
    case 'registerStudent': {
      return `
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            ${getIcon('residents', 20, 'var(--accent-secondary)')} Register New Hostel Resident
          </h3>
          <button class="btn btn-secondary btn-sm" style="padding: 4px 8px;" onclick="window.app.closeModal()">${getIcon('x', 16)}</button>
        </div>

        <form onsubmit="window.app.handleRegisterStudentSubmit(event)">
          <div class="modal-body">
            
            <div class="form-grid">
              <div class="form-group">
                <label>Full Student Name</label>
                <input type="text" name="name" class="form-control" placeholder="e.g. Rahul Verma" required />
              </div>

              <div class="form-group">
                <label>Roll Number</label>
                <input type="text" name="rollNo" class="form-control" placeholder="e.g. 2024CS099" required />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Gender</label>
                <select name="gender" class="form-control" required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div class="form-group">
                <label>Branch & Course</label>
                <input type="text" name="branch" class="form-control" placeholder="e.g. Computer Science" required />
              </div>

              <div class="form-group">
                <label>Year of Study</label>
                <select name="year" class="form-control" required>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" class="form-control" placeholder="+91 98765 43210" required />
              </div>

              <div class="form-group">
                <label>Parent Contact Phone</label>
                <input type="tel" name="parentPhone" class="form-control" placeholder="+91 98765 00000" required />
              </div>
            </div>

            <div class="form-group">
              <label>Assign Hostel Room (Optional)</label>
              <select name="roomNo" class="form-control">
                <option value="">-- Leave Unassigned for Now --</option>
                ${data.rooms.filter(r => r.status !== 'Occupied').map(rm => `
                  <option value="${rm.roomNo}">Room ${rm.roomNo} (${rm.blockId}) - ${formatINR(rm.feePerSemester)}/sem</option>
                `).join('')}
              </select>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">${getIcon('check', 16)} Register Student</button>
          </div>
        </form>
      `;
    }

    // 3. Collect Fee Payment Modal (in ₹ INR)
    case 'collectFee': {
      const feeRecord = data.fees.find(f => f.id === modalArg);
      if (!feeRecord) return '';

      return `
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            ${getIcon('rupee', 20, 'var(--accent-success)')} Record Fee Payment (₹ INR)
          </h3>
          <button class="btn btn-secondary btn-sm" style="padding: 4px 8px;" onclick="window.app.closeModal()">${getIcon('x', 16)}</button>
        </div>

        <form onsubmit="window.app.handleCollectFeeSubmit(event, '${feeRecord.id}')">
          <div class="modal-body">
            
            <div style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1.25rem;">
              <div style="font-weight: 800; font-size: 1.1rem; color: #fff;">${feeRecord.residentName} (${feeRecord.rollNo})</div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">Invoice Ref: ${feeRecord.id} • Room ${feeRecord.roomNo}</div>
              <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #f87171; font-weight: 700;">
                Outstanding Balance: ${formatINR(feeRecord.balanceDue)}
              </div>
            </div>

            <div class="form-group">
              <label>Payment Amount to Collect (₹ INR)</label>
              <input type="number" name="amount" class="form-control" max="${feeRecord.balanceDue}" value="${feeRecord.balanceDue}" required />
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Payment Mode</label>
                <select name="paymentMode" class="form-control" required>
                  <option value="Online UPI">Online UPI (GPay/PhonePe/Paytm)</option>
                  <option value="Net Banking">Net Banking NEFT/RTGS</option>
                  <option value="Demand Draft">Demand Draft / Bank Cheque</option>
                  <option value="Cash Deposit">Cash Counter Receipt</option>
                </select>
              </div>

              <div class="form-group">
                <label>Transaction / DD Reference No.</label>
                <input type="text" name="transactionRef" class="form-control" placeholder="e.g. UPI/98127391823/ICICI" required />
              </div>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-success">${getIcon('check', 16)} Record Payment</button>
          </div>
        </form>
      `;
    }

    // 4. Printable Fee Receipt Modal (in ₹ INR)
    case 'printReceipt': {
      const feeRecord = data.fees.find(f => f.id === modalArg);
      if (!feeRecord) return '';

      return `
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            ${getIcon('print', 20, 'var(--accent-secondary)')} Official Fee Invoice & Tax Receipt
          </h3>
          <button class="btn btn-secondary btn-sm" style="padding: 4px 8px;" onclick="window.app.closeModal()">${getIcon('x', 16)}</button>
        </div>

        <div class="modal-body">
          <div class="printable-receipt" style="background: #ffffff; color: #0f172a; padding: 2rem; border-radius: 12px; font-family: sans-serif;">
            
            <!-- Receipt Header -->
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem; margin-bottom: 1.5rem;">
              <div>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: #1e293b;">COLLEGE HOSTEL BOARD</h2>
                <p style="font-size: 0.85rem; color: #64748b;">Official Fee Collection & Caution Deposit Receipt</p>
                <p style="font-size: 0.78rem; color: #94a3b8;">Campus Admin Complex, Main Campus</p>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 800; font-size: 1.1rem; color: #6366f1;">${feeRecord.id}</div>
                <div style="font-size: 0.85rem; color: #64748b;">Date: ${feeRecord.paymentDate || '2026-10-08'}</div>
                <div style="margin-top: 4px;"><span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">${feeRecord.status.toUpperCase()}</span></div>
              </div>
            </div>

            <!-- Student Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; font-size: 0.9rem;">
              <div>
                <p><strong>Student Name:</strong> ${feeRecord.residentName}</p>
                <p><strong>Roll Number:</strong> ${feeRecord.rollNo}</p>
                <p><strong>Room Number:</strong> ${feeRecord.roomNo}</p>
              </div>
              <div>
                <p><strong>Academic Term:</strong> ${feeRecord.academicTerm}</p>
                <p><strong>Payment Mode:</strong> ${feeRecord.paymentMode}</p>
                <p><strong>Transaction Ref:</strong> ${feeRecord.transactionRef}</p>
              </div>
            </div>

            <!-- Items Table in ₹ INR -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.9rem;">
              <thead>
                <tr style="background: #f1f5f9; text-align: left;">
                  <th style="padding: 8px; border-bottom: 2px solid #cbd5e1;">Fee Description</th>
                  <th style="padding: 8px; border-bottom: 2px solid #cbd5e1; text-align: right;">Amount (₹ INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Hostel Room & Amenities Fee</td>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatINR(feeRecord.hostelFee)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Mess & Dining Charges</td>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatINR(feeRecord.messFee)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Refundable Caution Deposit</td>
                  <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatINR(feeRecord.cautionDeposit)}</td>
                </tr>
              </tbody>
            </table>

            <!-- Total Calculations -->
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; font-size: 0.95rem;">
              <div>Total Billed Amount: <strong>${formatINR(feeRecord.totalAmount)}</strong></div>
              <div style="color: #166534;">Amount Paid: <strong>${formatINR(feeRecord.amountPaid)}</strong></div>
              <div style="font-size: 1.1rem; font-weight: 800; color: ${feeRecord.balanceDue > 0 ? '#b91c1c' : '#166534'}; margin-top: 4px;">
                Balance Due: ${formatINR(feeRecord.balanceDue)}
              </div>
            </div>

            <div style="margin-top: 2rem; border-top: 1px solid #e2e8f0; padding-top: 1rem; display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.8rem; color: #64748b;">
              <div>Computer Generated Electronic Receipt. Stamp & Signature Verified.</div>
              <div style="text-align: center;">
                <div style="font-weight: 700; color: #1e293b;">Hostel Chief Warden</div>
                <div>Authorized Signatory</div>
              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.app.closeModal()">Close</button>
          <button class="btn btn-primary" onclick="window.print()">
            ${getIcon('print', 16)} Print Tax Receipt
          </button>
        </div>
      `;
    }

    // 5. Raise Maintenance Complaint Modal
    case 'addComplaint': {
      return `
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            ${getIcon('complaints', 20, 'var(--accent-warning)')} Raise Maintenance Complaint Ticket
          </h3>
          <button class="btn btn-secondary btn-sm" style="padding: 4px 8px;" onclick="window.app.closeModal()">${getIcon('x', 16)}</button>
        </div>

        <form onsubmit="window.app.handleAddComplaintSubmit(event)">
          <div class="modal-body">
            
            <div class="form-grid">
              <div class="form-group">
                <label>Select Resident Student</label>
                <select name="residentId" class="form-control" required onchange="window.app.updateComplaintRoom(this.value)">
                  ${data.residents.map(r => `
                    <option value="${r.id}">${r.name} (${r.roomNo || 'Unassigned'})</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label>Category</label>
                <select name="category" class="form-control" required>
                  <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Cleaning">Cleaning & Pest Control</option>
                </select>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Issue Title Summary</label>
                <input type="text" name="title" class="form-control" placeholder="e.g. Water heater tap leaking in bath" required />
              </div>

              <div class="form-group">
                <label>Priority Level</label>
                <select name="priority" class="form-control" required>
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent / Emergency</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Detailed Issue Description</label>
              <textarea name="description" class="form-control" rows="3" placeholder="Describe the problem, location inside room, timing..." required></textarea>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-warning">${getIcon('check', 16)} Submit Ticket</button>
          </div>
        </form>
      `;
    }

    // 6. Request Gate Pass Modal
    case 'addPass': {
      return `
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            ${getIcon('gatepass', 20, 'var(--accent-primary)')} Request Gate Pass
          </h3>
          <button class="btn btn-secondary btn-sm" style="padding: 4px 8px;" onclick="window.app.closeModal()">${getIcon('x', 16)}</button>
        </div>

        <form onsubmit="window.app.handleRequestGatePassSubmit(event)">
          <div class="modal-body">
            
            <div class="form-grid">
              <div class="form-group">
                <label>Resident Student</label>
                <select name="residentId" class="form-control" required>
                  ${data.residents.map(r => `
                    <option value="${r.id}">${r.name} (${r.rollNo} - Room ${r.roomNo})</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label>Pass Type</label>
                <select name="passType" class="form-control" required>
                  <option value="Day Outing">Day Outing (Same day return)</option>
                  <option value="Night Outing">Night Outing (Overnight local stay)</option>
                  <option value="Weekend Leave">Weekend Leave (Home visit)</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Out Date & Time</label>
                <input type="datetime-local" name="outDate" class="form-control" required />
              </div>

              <div class="form-group">
                <label>Expected In Date & Time</label>
                <input type="datetime-local" name="expectedInDate" class="form-control" required />
              </div>
            </div>

            <div class="form-group">
              <label>Destination Address / City</label>
              <input type="text" name="destination" class="form-control" placeholder="e.g. Bangalore Home Visit" required />
            </div>

            <div class="form-group">
              <label>Reason for Leave</label>
              <textarea name="reason" class="form-control" rows="2" placeholder="State reason..." required></textarea>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">${getIcon('check', 16)} Submit Request</button>
          </div>
        </form>
      `;
    }

    // 7. Digital Gate Pass QR View Modal
    case 'viewPassQR': {
      const pass = data.gatePasses.find(g => g.id === modalArg);
      if (!pass) return '';

      return `
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            ${getIcon('qr', 20, 'var(--accent-secondary)')} Digital Gate Pass QR Code
          </h3>
          <button class="btn btn-secondary btn-sm" style="padding: 4px 8px;" onclick="window.app.closeModal()">${getIcon('x', 16)}</button>
        </div>

        <div class="modal-body" style="text-align: center;">
          <div style="background: rgba(15, 23, 42, 0.6); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); display: inline-block;">
            
            <div style="width: 180px; height: 180px; background: white; border-radius: 12px; margin: 0 auto 1.25rem; padding: 12px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md);">
              ${getIcon('qr', 150, '#0f172a')}
            </div>

            <h3 style="font-size: 1.4rem; font-weight: 800; color: #fff;">${pass.residentName}</h3>
            <p style="color: var(--accent-secondary); font-weight: 700;">Roll: ${pass.rollNo} • Room ${pass.roomNo}</p>

            <div style="margin-top: 1rem;">
              <span class="badge ${pass.status === 'Approved' ? 'badge-success' : pass.status === 'Pending' ? 'badge-warning' : 'badge-danger'}" style="font-size: 0.9rem; padding: 6px 16px;">
                PASS STATUS: ${pass.status.toUpperCase()}
              </span>
            </div>

            <div style="margin-top: 1rem; font-size: 0.85rem; color: var(--text-muted); text-align: left;">
              <div><strong>Pass ID:</strong> ${pass.id}</div>
              <div><strong>Type:</strong> ${pass.passType}</div>
              <div><strong>Valid From:</strong> ${pass.outDate}</div>
              <div><strong>Return By:</strong> ${pass.expectedInDate}</div>
              <div><strong>Approved By:</strong> ${pass.approvedBy || 'Pending Verification'}</div>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.app.closeModal()">Close</button>
        </div>
      `;
    }

    // 8. Log Visitor Entry Modal
    case 'addVisitor': {
      return `
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            ${getIcon('residents', 20, 'var(--accent-secondary)')} Log New Campus Visitor
          </h3>
          <button class="btn btn-secondary btn-sm" style="padding: 4px 8px;" onclick="window.app.closeModal()">${getIcon('x', 16)}</button>
        </div>

        <form onsubmit="window.app.handleAddVisitorSubmit(event)">
          <div class="modal-body">
            
            <div class="form-grid">
              <div class="form-group">
                <label>Visitor Full Name</label>
                <input type="text" name="visitorName" class="form-control" placeholder="e.g. Ramesh Patel" required />
              </div>

              <div class="form-group">
                <label>Visitor Phone Number</label>
                <input type="tel" name="phone" class="form-control" placeholder="+91 98765 00000" required />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Student Being Visited</label>
                <select name="residentId" class="form-control" required>
                  ${data.residents.map(r => `
                    <option value="${r.id}">${r.name} (Room ${r.roomNo || 'Unassigned'})</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label>Relation to Student</label>
                <select name="relation" class="form-control" required>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian / Relative</option>
                  <option value="Sibling">Brother / Sister</option>
                  <option value="Friend">Friend</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>ID Proof Details</label>
              <input type="text" name="idProof" class="form-control" placeholder="e.g. Aadhaar Card (XXXX-1234)" required />
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">${getIcon('check', 16)} Log Check-In</button>
          </div>
        </form>
      `;
    }

    // 9. Room Details Info Modal
    case 'roomDetails': {
      const room = data.rooms.find(r => r.roomNo === modalArg);
      if (!room) return '';
      const roomResidents = data.residents.filter(r => r.roomNo === room.roomNo);

      return `
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            ${getIcon('rooms', 20, 'var(--accent-primary)')} Room ${room.roomNo} Specifications
          </h3>
          <button class="btn btn-secondary btn-sm" style="padding: 4px 8px;" onclick="window.app.closeModal()">${getIcon('x', 16)}</button>
        </div>

        <div class="modal-body">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1.25rem; font-size: 0.9rem;">
            <div><strong>Hostel Block:</strong> ${room.blockId}</div>
            <div><strong>Floor Level:</strong> ${room.floor} Floor</div>
            <div><strong>Room Type:</strong> ${room.type}</div>
            <div><strong>Total Bed Capacity:</strong> ${room.capacity} Beds</div>
            <div><strong>Fee / Semester:</strong> <span style="color: var(--accent-success); font-weight: 700;">${formatINR(room.feePerSemester)}</span></div>
            <div><strong>Current Status:</strong> <span class="badge badge-info">${room.status}</span></div>
          </div>

          <h4 style="font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem;">Assigned Occupants (${roomResidents.length}/${room.capacity})</h4>
          
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${roomResidents.length > 0 ? roomResidents.map(res => `
              <div style="padding: 0.75rem; background: rgba(30, 41, 59, 0.6); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; color: #fff;">${res.name} <span style="font-size: 0.8rem; color: var(--accent-secondary);">(${res.bedNo || 'Bed 1'})</span></div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">Roll: ${res.rollNo} • Phone: ${res.phone}</div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="window.app.openModal('studentProfile', '${res.id}')">Profile</button>
              </div>
            `).join('') : `
              <p style="color: var(--text-muted); font-size: 0.88rem;">No students assigned to this room yet.</p>
            `}
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.app.closeModal()">Close</button>
        </div>
      `;
    }

    // 10. Student Profile Info Modal
    case 'studentProfile': {
      const student = data.residents.find(r => r.id === modalArg);
      if (!student) return '';
      const feeRecord = data.fees.find(f => f.residentId === student.id);

      return `
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            ${getIcon('residents', 20, 'var(--accent-secondary)')} Resident Student Profile
          </h3>
          <button class="btn btn-secondary btn-sm" style="padding: 4px 8px;" onclick="window.app.closeModal()">${getIcon('x', 16)}</button>
        </div>

        <div class="modal-body">
          
          <div style="display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1.25rem;">
            <div style="width: 72px; height: 72px; border-radius: 20px; background: ${student.avatarBg || 'var(--accent-primary)'}; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; color: white;">
              ${student.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <h3 style="font-size: 1.35rem; font-weight: 800; color: #fff;">${student.name}</h3>
              <p style="color: var(--accent-secondary); font-weight: 700; font-size: 0.88rem;">Roll No: ${student.rollNo}</p>
              <p style="color: var(--text-muted); font-size: 0.8rem;">${student.branch} • ${student.year}</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); font-size: 0.88rem;">
            <div><strong>Gender:</strong> ${student.gender}</div>
            <div><strong>Blood Group:</strong> ${student.bloodGroup || 'O+'}</div>
            <div><strong>Student Phone:</strong> ${student.phone}</div>
            <div><strong>Student Email:</strong> ${student.email || 'student@college.edu'}</div>
            <div><strong>Assigned Room:</strong> <span style="color: var(--accent-success); font-weight: 700;">${student.roomNo || 'Unassigned'} (${student.bedNo || '-'})</span></div>
            <div><strong>Caution Deposit:</strong> <span class="badge ${student.cautionDepositPaid ? 'badge-success' : 'badge-danger'}">${formatINR(student.cautionDepositAmount || 5000)} ${student.cautionDepositPaid ? 'Paid' : 'Unpaid'}</span></div>
            <div><strong>Parent Name:</strong> ${student.parentName || 'N/A'}</div>
            <div><strong>Parent Contact:</strong> ${student.parentPhone || 'N/A'}</div>
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.app.closeModal()">Close</button>
          ${feeRecord ? `
            <button class="btn btn-primary" onclick="window.app.openModal('printReceipt', '${feeRecord.id}')">
              ${getIcon('print', 16)} Fee Invoice
            </button>
          ` : ''}
        </div>
      `;
    }

    default:
      return '';
  }
}
