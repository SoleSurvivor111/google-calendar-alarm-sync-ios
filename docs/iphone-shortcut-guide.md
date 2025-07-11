# ⏰ iPhone Shortcut Guide: “Set Alarms from Calendar Event”

This shortcut automatically **sets native iPhone alarms based on your Google Calendar events**, using the *helper events* created by your Google Apps Script for reliable triggering.

---

## 🚀 What This Shortcut Does

✅ **Scans your calendar** for upcoming helper events (e.g., `[30m before]: Meeting with Client`).
✅ Extracts the reminder time from these helper events.
✅ Automatically **sets a native iPhone alarm** at that time.
✅ Deletes the alarm automatically after it goes off (optional).

---

## 🛠️ How It Works

1️⃣ **Helper events are created** by your Google Apps Script at your reminder times.
2️⃣ This shortcut:
   - Finds the next helper event.
   - Calculates its start time.
   - Sets a native alarm on your iPhone for that time.

Native iPhone alarms:
- **Bypass DND or Focus modes** if allowed in your settings.
- Work offline and reliably wake the device.

---

## 📲 How to Set Up

### 1️⃣ Get the Shortcut
- Import your “Set Alarms from Calendar Event” shortcut into your Shortcuts app.

### 2️⃣ Configure Calendar Access
- Ensure the shortcut has access to your calendar:
  - Go to `Settings` → `Privacy & Security` → `Calendars` → Enable access for Shortcuts.

### 3️⃣ Configure Alarm Permissions
- Allow the shortcut to set alarms automatically:
  - Run the shortcut once manually and grant permission to manage alarms.

---

## 🔄 Recommended Automation

To run automatically:
- Open the **Shortcuts app**.
- Go to **Automation** → `+` → `Create Personal Automation`.
- Select **Time of Day** (e.g., every morning at 6:00 AM).
- Add Action → **Run Shortcut** → Select your “Set Alarms from Calendar Event” shortcut.
- Disable **Ask Before Running** to automate fully.

Or trigger it:
- When connecting to a charger.
- When connecting to Wi-Fi at home.
- On arriving at your home location in the morning.

---

## ⚙️ Customization Options

✅ Filter by calendar:
- Restrict to your helper event calendar if you store helpers in a dedicated calendar.

✅ Filter by event name:
- Use the `[XX before]:` naming to find only helper events.

✅ Limit lookahead:
- Configure the shortcut to look only 24 hours ahead for performance.

✅ Auto-delete alarms:
- Use an additional automation to clear alarms after they go off.

---

## 🪄 Why This Is Useful

- Native iPhone alarms **wake the device and bypass silent mode**.
- Google Calendar reminders are not always reliable on iOS; this bridges the gap.
- Pairs seamlessly with your helper event script for a **fully automated workflow**.
- Useful for critical reminders (medications, important meetings, travel, or calls).

---

## ✅ Example Workflow

1️⃣ Add an event in Google Calendar with a 15-minute reminder.
2️⃣ The Google Apps Script creates:
