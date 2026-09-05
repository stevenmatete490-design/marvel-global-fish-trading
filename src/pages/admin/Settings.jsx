import { useState } from "react";
import {
Bell,
Building2,
Lock,
Save,
Settings as SettingsIcon,
ShieldCheck,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";

function Settings() {
const [companyName, setCompanyName] = useState(
"MARVEL GLOBAL FISH TRADING"
);

const [email, setEmail] = useState(
"[marvelglobal2020@gmail.com](mailto:marvelglobal2020@gmail.com)"
);

const [phone, setPhone] = useState(
"+254 793 609252"
);

const [notifications, setNotifications] = useState(true);

const handleSave = (event) => {
event.preventDefault();


const settings = {
  companyName,
  email,
  phone,
  notifications,
};

localStorage.setItem(
  "marvel_company_settings",
  JSON.stringify(settings)
);

window.alert("Settings saved successfully.");


};

return ( <AdminLayout> <div className="admin-page">
{/* HEADER */} <header className="admin-header"> <div> <span className="section-label">
SYSTEM CONFIGURATION </span>

```
        <h1>Settings</h1>

        <p>
          Manage your company information and
          administration preferences.
        </p>
      </div>
    </header>

    <div className="admin-content">
      {/* COMPANY PROFILE */}
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="section-label">
              COMPANY PROFILE
            </span>

            <h2>Business Information</h2>
          </div>

          <Building2 size={24} />
        </div>

        <form onSubmit={handleSave}>
          <div className="admin-form-grid">
            {/* COMPANY NAME */}
            <div className="admin-form-group">
              <label htmlFor="companyName">
                Company Name
              </label>

              <input
                id="companyName"
                name="companyName"
                type="text"
                value={companyName}
                onChange={(event) =>
                  setCompanyName(event.target.value)
                }
                required
              />
            </div>

            {/* EMAIL */}
            <div className="admin-form-group">
              <label htmlFor="email">
                Business Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            {/* PHONE */}
            <div className="admin-form-group">
              <label htmlFor="phone">
                Business Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                required
              />
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="admin-settings-section">
            <div className="admin-settings-icon">
              <Bell size={20} />
            </div>

            <div className="admin-settings-content">
              <strong>Admin Notifications</strong>

              <p>
                Receive notifications about new
                orders, payments and customer
                activity.
              </p>
            </div>

            <label
              className="admin-toggle"
              aria-label="Enable admin notifications"
            >
              <input
                type="checkbox"
                checked={notifications}
                onChange={(event) =>
                  setNotifications(
                    event.target.checked
                  )
                }
              />

              <span />
            </label>
          </div>

          {/* ACCESS CONTROL */}
          <div className="admin-settings-section">
            <div className="admin-settings-icon">
              <ShieldCheck size={20} />
            </div>

            <div className="admin-settings-content">
              <strong>Administrator Access</strong>

              <p>
                Your account has access to the
                Marvel Global Fish Trading
                administration system.
              </p>
            </div>
          </div>

          {/* SECURITY */}
          <div className="admin-settings-section">
            <div className="admin-settings-icon">
              <Lock size={20} />
            </div>

            <div className="admin-settings-content">
              <strong>Security</strong>

              <p>
                Keep your administrator credentials
                secure and never share your login
                information.
              </p>
            </div>
          </div>

          {/* SAVE */}
          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-primary-button"
            >
              <Save size={17} />
              Save Settings
            </button>
          </div>
        </form>
      </section>

      {/* SYSTEM PREFERENCES */}
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="section-label">
              ADMINISTRATION
            </span>

            <h2>System Preferences</h2>
          </div>

          <SettingsIcon size={24} />
        </div>

        <div className="admin-report-grid">
          {/* COMPANY */}
          <article className="admin-report-card">
            <Building2 size={24} />

            <h3>Company Profile</h3>

            <p>
              Update the business information used
              throughout the administration system.
            </p>
          </article>

          {/* ACCESS */}
          <article className="admin-report-card">
            <ShieldCheck size={24} />

            <h3>Access Control</h3>

            <p>
              Review administrator access and
              security preferences.
            </p>
          </article>

          {/* NOTIFICATIONS */}
          <article className="admin-report-card">
            <Bell size={24} />

            <h3>Notifications</h3>

            <p>
              Control notifications for important
              business activities.
            </p>
          </article>
        </div>
      </section>
    </div>
  </div>
</AdminLayout>

);
}

export default Settings;
