import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import api from "../../api/axios";

export default function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [settings, setSettings] = useState({
    interruption_alerts: 1,
    bill_reminders: 1,
    report_updates: 1,
    email_notifications: 0,
    dark_glass_mode: 1,
    safety_tips: 1,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  function applyTheme(data) {
    if (data.dark_glass_mode) {
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }

  async function loadSettings() {
    try {
      const res = await api.get(`/settings/${user.user_id}`);

      const data = {
        interruption_alerts: Number(res.data.interruption_alerts ?? 1),
        bill_reminders: Number(res.data.bill_reminders ?? 1),
        report_updates: Number(res.data.report_updates ?? 1),
        email_notifications: Number(res.data.email_notifications ?? 0),
        dark_glass_mode: Number(res.data.dark_glass_mode ?? 1),
        safety_tips: Number(res.data.safety_tips ?? 1),
      };

      setSettings(data);
      localStorage.setItem("settings", JSON.stringify(data));
      applyTheme(data);
    } catch {
      setMessage("Failed to load settings.");
    }
  }

  async function toggleSetting(key) {
    const updated = {
      ...settings,
      [key]: settings[key] ? 0 : 1,
    };

    setSettings(updated);
    localStorage.setItem("settings", JSON.stringify(updated));
    applyTheme(updated);

    try {
      const res = await api.put(`/settings/${user.user_id}`, updated);
      setMessage(res.data.message || "Settings saved successfully.");
    } catch {
      setMessage("Failed to save settings.");
    }
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Customize notifications, alerts, theme, and safety preferences."
      />

      {message && <div className="auth-message">{message}</div>}

      <Card title="Notification Preferences">
        <div className="settings-list">
          <SettingItem
            title="Power Interruption Alerts"
            description="Receive alerts when your area has scheduled or ongoing interruptions."
            checked={settings.interruption_alerts}
            onClick={() => toggleSetting("interruption_alerts")}
          />

          <SettingItem
            title="Bill Due Date Reminders"
            description="Receive reminders when your electricity bill is near its due date."
            checked={settings.bill_reminders}
            onClick={() => toggleSetting("bill_reminders")}
          />

          <SettingItem
            title="Damage Report Updates"
            description="Receive updates when admin changes the status of your submitted reports."
            checked={settings.report_updates}
            onClick={() => toggleSetting("report_updates")}
          />

          <SettingItem
            title="Email Notifications"
            description="Allow the system to send important updates to your email."
            checked={settings.email_notifications}
            onClick={() => toggleSetting("email_notifications")}
          />
        </div>
      </Card>

      <Card title="System Preferences">
        <div className="settings-list">
          <SettingItem
            title="Glass Dark Theme"
            description="Use the ElectroPulse transparent glass interface."
            checked={settings.dark_glass_mode}
            onClick={() => toggleSetting("dark_glass_mode")}
          />

          <SettingItem
            title="Safety Tips"
            description="Show safety reminders about damaged power lines and outages."
            checked={settings.safety_tips}
            onClick={() => toggleSetting("safety_tips")}
          />
        </div>
      </Card>
    </>
  );
}

function SettingItem({ title, description, checked, onClick }) {
  return (
    <div className="setting-item">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className={checked ? "toggle-switch active" : "toggle-switch"}
        onClick={onClick}
      >
        <span></span>
      </button>
    </div>
  );
}