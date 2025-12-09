import Sidebar from '../components/Sidebar.js';

export default {
  render: () => {
    return `
            <div class="dashboard-layout">
                ${Sidebar()}
                <main class="main-content">
                    <header class="page-header">
                        <h2>Factory Settings</h2>
                    </header>

                    <div class="settings-container" style="max-width: 800px; background: white; border-radius: 8px; border: 1px solid #eee; overflow: hidden; margin-top: 20px;">
                        
                        <div class="tabs-header" style="display: flex; border-bottom: 1px solid #eee; background: #f9f9f9;">
                            <button class="tab-btn active" data-tab="general" style="padding: 15px 25px; border: none; background: white; border-bottom: 2px solid #3b7486; cursor: pointer; font-weight: 500;">General</button>
                            <button class="tab-btn" data-tab="team" style="padding: 15px 25px; border: none; background: transparent; cursor: pointer; color: #666;">Team Members</button>
                        </div>

                        <div id="tab-general" class="tab-content" style="padding: 30px;">
                            <h3 style="margin-bottom: 20px;">Factory Information</h3>
                            
                            <div class="form-group" style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; color: #666;">Factory Name</label>
                                <input type="text" class="form-control" value="My Furniture Factory" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>

                            <div class="form-group" style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; color: #666;">Default Unit</label>
                                <select class="form-control" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="mm">Millimeters (mm)</option>
                                    <option value="cm">Centimeters (cm)</option>
                                    <option value="inch">Inches (in)</option>
                                </select>
                            </div>

                            <button class="btn-primary" style="margin-top: 10px;">Save Changes</button>
                        </div>

                        <div id="tab-team" class="tab-content" style="padding: 30px; display: none;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <h3>Team Access</h3>
                                <button class="btn-primary" id="btnInvite">+ Invite Member</button>
                            </div>

                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="border-bottom: 2px solid #eee; text-align: left;">
                                        <th style="padding: 10px;">User</th>
                                        <th style="padding: 10px;">Role</th>
                                        <th style="padding: 10px; text-align: right;">Action</th>
                                    </tr>
                                </thead>
                                <tbody id="teamList">
                                    </tbody>
                            </table>
                        </div>

                    </div>
                </main>
            </div>
        `;
  },

  afterRender: () => {
    // --- TABS LOGIC ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // 1. Aktiv klassni almashtirish
        tabs.forEach(t => {
          t.classList.remove('active');
          t.style.background = 'transparent';
          t.style.borderBottom = 'none';
        });
        tab.classList.add('active');
        tab.style.background = 'white';
        tab.style.borderBottom = '2px solid #3b7486';

        // 2. Contentni almashtirish
        const target = tab.dataset.tab;
        contents.forEach(c => c.style.display = 'none');
        document.getElementById(`tab-${target}`).style.display = 'block';
      });
    });

    // --- TEAM LIST MOCK DATA ---
    const teamMembers = [
      { name: "Admin User", email: "admin@rhino-file-processor.com", role: "Owner" },
      { name: "John Designer", email: "john@design.com", role: "Editor" },
      { name: "Factory Manager", email: "manager@factory.com", role: "Viewer" }
    ];

    const teamList = document.getElementById('teamList');

    function renderTeam() {
      teamList.innerHTML = teamMembers.map((member, index) => `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 15px 10px;">
                        <div style="font-weight: 500;">${member.name}</div>
                        <div style="font-size: 12px; color: #888;">${member.email}</div>
                    </td>
                    <td style="padding: 10px;">
                        <span style="background: #e3f2fd; color: #1565c0; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${member.role}</span>
                    </td>
                    <td style="padding: 10px; text-align: right;">
                        ${member.role !== 'Owner' ? `<button class="btn-delete-user" data-index="${index}" style="color: red; border: none; background: none; cursor: pointer;">Remove</button>` : ''}
                    </td>
                </tr>
            `).join('');

      // Delete Event
      document.querySelectorAll('.btn-delete-user').forEach(btn => {
        btn.addEventListener('click', (e) => {
          if (confirm("Remove this user?")) {
            teamMembers.splice(e.target.dataset.index, 1);
            renderTeam();
          }
        });
      });
    }
    renderTeam();

    // Invite Button
    document.getElementById('btnInvite').addEventListener('click', () => {
      const email = prompt("Enter email address to invite:");
      if (email) {
        teamMembers.push({ name: "New User", email: email, role: "Viewer" });
        renderTeam();
      }
    });
  }
};
