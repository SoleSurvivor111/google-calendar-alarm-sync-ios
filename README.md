# Calendar Helper Events & iPhone Alarm Integration: Automatic Reminders for Your Google Calendar

**Automate your reminders, sync with iPhone alarms, and never miss an event again.**

This flexible **Google Apps Script + iPhone Shortcuts system** automatically creates clear, timed "helper events" in your Google Calendar and integrates them with **iPhone Clock alarms**. It's designed for busy people who want reliable reminders without the manual hassle.

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

## 🛠️ How to Set Up

1. **Copy the Google Apps Script** into your Google Drive project.
2. Set `DEBUG = true` for testing, `false` for live usage.
3. Authorize permissions when prompted (Calendar + Properties).
4. Set up triggers:

   * **Daily Google Script trigger** for scanning changes.
   * **iPhone Shortcut trigger** every 30 minutes (or hourly) to sync helper events with Clock alarms.
5. Ensure your **iOS default calendar is your Gmail/Google Calendar** for seamless syncing.

## 🧹 Recommended: Cleanup Script

Add the `cleanupOldSnapshots` script to:

* Remove expired or old `snapshot_*` properties weekly.
* Keep your Google Apps Script lean over long-term use.

Set a **weekly trigger** (e.g., Sundays) for this cleanup.

## 📂 Repository Structure

* `src/createEventBasedOnNotifications.js`: Main script for generating helper events.
* `src/Shortcut-CreateAlarms.shortcut`: iPhone Shortcut to convert helper events into alarms.
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

This project **automates Google Calendar reminders, syncs with your iPhone Clock alarms, and cleans up expired helpers**, giving you a **reliable, automated reminders workflow for your daily life**.

Set it up once and enjoy **automated event notifications for your Google Calendar on your iPhone** without manual effort.
