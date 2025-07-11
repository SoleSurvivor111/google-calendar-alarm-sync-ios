# 📅 Google Calendar Reminder Helper Script Guide

This script automatically **creates helper events in your Google Calendar based on your existing event reminders**. It is useful for **triggering reliable notifications on iPhone, automations, or integrations that rely on event presence**.

---

## 🚀 What This Script Does

- **Reads your calendar events** (yesterday, today, tomorrow).
- For each event:
  - Checks its reminders (popup, email).
  - Creates small *helper events* at the reminder times named like:
    ```
    [30m before]: Team Standup
    ```
  - Keeps helpers in sync if you add or remove reminders.
  - Deletes outdated helpers automatically.
- **Avoids creating duplicate events**.
- Uses lightweight tracking for efficiency.

---

## 🛠️ How to Set Up

### 1️⃣ Copy and Paste the Script

- Open [Google Apps Script](https://script.google.com).
- Create a **new project**.
- Copy and paste your `createEventBasedOnNotifications` script.

### 2️⃣ Authorize Permissions

- Click **Run** on the `createEventBasedOnNotifications` function.
- Approve the requested permissions to allow calendar access.

### 3️⃣ Add a Trigger for Automatic Running

- Go to **Triggers** (⏰ icon or `Triggers` in the left sidebar).
- Add a new trigger:
  - Function: `createEventBasedOnNotifications`
  - Event Source: **Time-driven**
  - Select frequency: e.g., every 10 minutes or when events change.

---

## ⚙️ How It Works Internally

✅ **Fetches Events** for yesterday, today, and tomorrow.
✅ Skips events that already start with `[` to avoid recursion.
✅ Creates or updates **helper events at reminder times**.
✅ Uses a **short hash ID** for consistent linking and reference.
✅ Uses **user properties** to track snapshots and debounce redundant runs.

---

## 🪄 Why You Might Need This

✅ **iPhone and device compatibility:** iPhone alarms often don’t reliably trigger for Google Calendar reminders; these helper events act as reliable signals.

✅ **Home Assistant / automation triggers:** Allows you to trigger automations based on event starts rather than reminders.

✅ **Visual reminder overview:** See upcoming reminders as actual slots in your calendar.

✅ **Fully automatic:** No manual management of helper events needed.

---

## ⚠️ Notes and Tips

✅ Skips creating helpers if:
- No reminders exist for the event.
- Existing helpers already match current reminders.

✅ Default unit mapping:
- `y` = year
- `mo` = month
- `w` = week
- `d` = day
- `h` = hour
- `m` = minute

✅ Uses a **5-second debounce guard** to prevent loops if triggered repeatedly.

✅ Covers a **3-day window** (yesterday, today, tomorrow) to ensure late changes are synced without excessive API calls.

---

## 🛠️ Customization Ideas

- Change the **trigger frequency** depending on your needs (every 5 min, 15 min, hourly).
- Adjust the **time window** for scanning events to cover a longer or shorter period.
- Extend for **multiple calendars** by replacing `CalendarApp.getDefaultCalendar()` with `CalendarApp.getCalendarById()`.

---

## 💡 Troubleshooting

✅ **Nothing happens when triggered?**
- Check that you have granted permissions.
- Ensure there are events with active reminders in your calendar.

✅ **Helper events not updating?**
- The script only updates if reminders change.
- Try changing reminders to force a sync.

✅ **Quota issues?**
- Adjust the trigger frequency to run less often.
- Limit the scan window if you have a very large number of events.

---

## ✅ Summary

This script will:

- **Automatically create helper events** for each reminder on your calendar events.
- **Keep them in sync** when reminders change.
- Help ensure **reliable notifications** and **automation triggers** for your workflows.

Once configured, you can forget about it while it quietly keeps your calendar reminders robust and device-friendly.


