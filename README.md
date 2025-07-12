# Calendar Helper Events & iPhone Alarm Integration: Automatic Reminders for Your Google Calendar

**Automate your reminders, sync with iPhone alarms, and never miss an event again.**

This flexible **Google Apps Script + iPhone Shortcuts system** automatically creates clear, timed "helper events" in your Google Calendar and integrates them with **iPhone Clock alarms**. It's designed for busy people who want reliable reminders without manual hassle.

## Why Generate Helper Events for iPhone Alarms

The iPhone Clock app and Reminders app **cannot directly trigger reliable alarms from Google Calendar events** due to iOS limitations. By generating **helper events** in your Google Calendar, this system creates precise, time-based placeholders that your iPhone Shortcuts can detect and convert into **Clock app alarms** automatically. This bypasses iOS limitations, ensuring you receive dependable, audible notifications for your calendar events without manual alarm setup, keeping your workflow seamless and automated.

## 📡 iPhone Google Calendar Update Limitation

The Google Calendar app and iOS Calendar on iPhone **do not support real-time push updates** due to iOS system limitations. They only fetch updates periodically, so newly generated helper events may take several minutes to appear on your iPhone after creation. This is normal and expected behavior, and users should note that alarms based on helper events will not be instant but will sync within the usual iOS fetch intervals.

## 🚩 About Default Reminder Time

Due to Google Apps Script limitations, the system cannot detect your calendar’s default reminder settings and will use a default 30-minute reminder for helper events unless a different reminder is explicitly set on the event.

## ✨ What This Script Does

* **Automatically generates small "helper events"** in your Google Calendar for each reminder you set on events.
* **Syncs helper events with iPhone Clock alarms** using Shortcuts for precise notifications.
* **Prevents duplicates and clutter** by tracking events and only updating when necessary.
* **Cleans up old helper events** when the original event is deleted or updated.
* Creates **readable titles** like `[30m before]: Meeting with Sarah` so you know exactly why the alarm is ringing.

## 📱 Why It's Useful for You

* **Miss fewer events** with layered notifications on both your Google Calendar and iPhone Clock.
* **See clear, time-based reminders** for your events directly on your iPhone.
* **Reduce mental load** by automating repetitive reminder and alarm setups.
* Ideal for freelancers, professionals, students, and anyone using **iPhone + Google Calendar** daily.

## 🚧 iOS Alarm Limitation

⚠️ Currently, the **iOS Shortcuts API cannot delete iPhone Clock alarms automatically**. You need to:

* Manually clear old alarms in the Clock app.
* Or use **Siri voice commands** like "Hey Siri, delete all alarms."

All other automation for Google Calendar helper events runs fully automatically.

## 🛠️ How to Set Up Google Apps Script

1. **Copy the Google Apps Script** into your Google Drive project.
2. Set `DEBUG = true` for testing, `false` for live usage.
3. Authorize permissions when prompted (Calendar + Properties).
4. Set up triggers:

   * **Daily Google Script trigger** for scanning changes.
   * **iPhone Shortcut trigger** every 30 minutes (or hourly) to sync helper events with Clock alarms.
5. Ensure your **iOS default calendar is your Gmail/Google Calendar** for seamless syncing.

## 🛠️ iPhone Shortcut Setup for Helper Events

To sync helper events with your iPhone Clock alarms automatically:

1. **Download the provided iOS Shortcut** from your repository (`src/Create Alarms From Calendar.shortcut`) or [link](https://www.icloud.com/shortcuts/be7134385027479ba1a065d39e901cec).
2. Open the Shortcuts app on your iPhone.
3. Import the Shortcut and review its permissions.
4. Go to the **Automation** tab in Shortcuts and create a new personal automation.
5. Select **Time of Day** trigger:

   * Set it to run **every 30 minutes, every 1 hour, or every 2 hours** depending on your preference for update frequency.
6. Add the imported Shortcut as the action to run automatically at these intervals.
7. Enable **'Run Automatically'** and disable 'Ask Before Running' for seamless syncing.

This setup ensures your iPhone periodically checks your Google Calendar for new helper events and creates the corresponding iPhone Clock alarms automatically without manual intervention, fitting your preferred refresh cadence.

## 🧹 Recommended: Cleanup Script

Add the `cleanupOldSnapshots` script to:

* Remove expired or old `snapshot_*` properties weekly.
* Keep your Google Apps Script lean over long-term use.

Set a **weekly trigger** (e.g., Sundays) for this cleanup.

## 📂 Repository Structure

* `src/createEventBasedOnNotifications.js`: Main script for generating helper events.
* `src/Create Alarms From Calendar.shortcut`: iPhone Shortcut to convert helper events into alarms.
* `src/weeklyCleanupOldSnapshots.js`: Optional cleanup helper.

Include these in your GitHub repo for easy modification and syncing.

## 🛎️ Example Usage

* You have a Google Calendar event tomorrow at 10:00 AM with a 30-minute reminder.
* The script will create a **helper event at 9:30 AM** titled:

  ```
  [30m before]: Client Strategy Call
  ```
* Your iPhone Shortcut will pick up this helper event and set an **alarm at 9:30 AM**.
* You will receive:

  * Your normal Google Calendar notification.
  * A precise iPhone Clock alarm to ensure you don't miss it.

## ✅ Why This Workflow?

This system helps you:

* Automate **time-based reminders with zero manual duplication**.
* Add **reliable, audible alarms on your iPhone for Google Calendar events**.
* Gain confidence in your schedule with layered notifications.
* Reduce repetitive setup for recurring reminders.

---

> **Summary:**
>
> This project **automates Google Calendar reminders, syncs with your iPhone Clock alarms, and cleans up expired helpers**, giving you a **reliable, automated reminders workflow for your daily life**.
>
> Set it up once and enjoy **automated event notifications for your Google Calendar on your iPhone** without manual effort.
