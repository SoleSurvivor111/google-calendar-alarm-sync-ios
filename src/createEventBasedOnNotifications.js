const DEBUG = true; // Set to false in production

function log(message) {
  if (DEBUG) Logger.log(message);
}

/**
 * Converts minutes into the largest appropriate time unit for readability.
 */
function getReadableTimeUnit(minutes) {
  const unitMapping = [
    { unit: "y", minutes: 525600 },
    { unit: "mo", minutes: 43200 },
    { unit: "w", minutes: 10080 },
    { unit: "d", minutes: 1440 },
    { unit: "h", minutes: 60 },
    { unit: "m", minutes: 1 },
  ];

  for (let { unit, minutes: unitMinutes } of unitMapping) {
    if (minutes >= unitMinutes) {
      return {
        readableValue: Math.round(minutes / unitMinutes),
        readableUnit: unit,
      };
    }
  }
  return { readableValue: minutes, readableUnit: "m" };
}

/**
 * Create short hash id from string for event
 */
function createShortIdFromString(idSafe) {
  return Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, idSafe)
  ).slice(0, 8);
}

/**
 * Create short random id for event
 */
function createRandomShortId() {
  return Utilities.getUuid().replace(/-/g, "").substring(0, 8);
}

/**
 * Main function to create helper events based on notifications
 */
function createEventBasedOnNotifications() {
  const cal = CalendarApp.getDefaultCalendar();
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const defaultReminderMinutes = 30;

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfYesterday = new Date(startOfToday.getTime() - msPerDay);
  const endOfTomorrow = new Date(startOfToday.getTime() + 2 * msPerDay);

  const parentIdName = "parentId";
  const alarmIdName = "alarmId";
  const userProps = PropertiesService.getUserProperties();
  const snapshotKey = "snapshot";

  const matchHelperRegExp = /^\[.+? before\]:/;

  // Debounce guard to prevent infinite loops
  const nowTs = Date.now();
  const lastRunTs = parseInt(userProps.getProperty("lastRun") || "0", 10);
  if (nowTs - lastRunTs < 5000) {
    log("⚠️ Skipping run to prevent loop re-trigger.");
    return;
  }
  userProps.setProperty("lastRun", nowTs.toString());

  const allEvents = cal.getEvents(startOfYesterday, endOfTomorrow);
  const originalEvents = [];
  const helperEvents = [];

  // Separate original and helper events
  allEvents.forEach((event) => {
    if (!matchHelperRegExp.test(event.getTitle())) {
      originalEvents.push(event);
    } else {
      helperEvents.push(event);
    }
  });

  // Process original events
  originalEvents.forEach((event) => {
    const title = event.getTitle();
    const startTime = event.getStartTime();
    const originalEventId = event.getId();
    const shortId = createShortIdFromString(originalEventId);
    let description = event.getDescription();

    // Ensure description has IDs for tracking
    if (!description.includes(shortId)) {
      description += `\n\n${alarmIdName}=[${shortId}]`;
      event.setDescription(description.trim());
      log(`✏️ Updated description with IDs for: "${title}"`);
    }

    // Retrieve and normalize reminders
    let reminders = [
      ...event.getPopupReminders(),
      ...event.getEmailReminders(),
    ].sort((a, b) => a - b);

    if (reminders.length === 0) {
      reminders = [defaultReminderMinutes];
    }

    if (title.includes("no alarm")) {
      reminders = [];
    }

    // Check for changes using snapshot to avoid unnecessary recreation
    const lastSnapshotRaw = userProps.getProperty(
      `${snapshotKey}_${originalEventId}`
    );
    const lastSnapshot = lastSnapshotRaw ? JSON.parse(lastSnapshotRaw) : null;

    const currentSnapshot = {
      reminders,
      startTime: event.getStartTime().getTime(),
      endTime: event.getEndTime().getTime(),
      title: event.getTitle(),
    };

    if (JSON.stringify(lastSnapshot) === JSON.stringify(currentSnapshot)) {
      log(`✅ No change for "${event.getTitle()}". Skipping.`);
      return;
    }

    log(`🔄 Changes detected for "${title}". Updating helpers.`);

    // Delete outdated helpers for this event
    helperEvents
      .filter((e) =>
        e.getDescription().includes(`${parentIdName}=[${originalEventId}]`)
      )
      .forEach((e) => {
        e.deleteEvent();
        log(`🗑️ Deleted outdated helper: ${e.getTitle()}`);
      });

    // Create new helper events for each reminder
    reminders.forEach((minutesBefore) => {
      const reminderTime = new Date(
        startTime.getTime() - minutesBefore * 60 * 1000
      );
      if (reminderTime < startOfYesterday) {
        log(`⏩ Skipping past reminder for "${title}" at ${reminderTime}`);
        return;
      }

      const reminderEndTime = new Date(reminderTime.getTime() + 5 * 60 * 1000);
      const { readableValue, readableUnit } =
        getReadableTimeUnit(minutesBefore);
      const helperTitle = `[${readableValue}${readableUnit} before]: ${title}`;

      cal.createEvent(helperTitle, reminderTime, reminderEndTime, {
        description: `${parentIdName}=[${originalEventId}]\n${alarmIdName}=[${createRandomShortId()}]`,
      });

      log(`✅ Created helper: "${helperTitle}" at ${reminderTime}`);
    });

    // Update snapshot for this event
    userProps.setProperty(
      `${snapshotKey}_${originalEventId}`,
      JSON.stringify(currentSnapshot)
    );
  });
}
