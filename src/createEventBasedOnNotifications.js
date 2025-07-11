const DEBUG = true; // Set to true during development

function log(message) {
  if (DEBUG) {
    Logger.log(message);
  }
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

  for (let i = 0; i < unitMapping.length; i++) {
    const { unit, minutes: unitMinutes } = unitMapping[i];
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
 * Create short id from string for event
 */
function getShortId(idSafe) {
  const hash = Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, idSafe)
  ).slice(0, 8);
  return hash;
}

/**
 * Create short id for event
 */
function createShortId() {
  const uuid = Utilities.getUuid().replace(/-/g, ""); // remove dashes
  return uuid.substring(0, 8); // take first 8 chars
}

function createEventBasedOnNotifications() {
  const cal = CalendarApp.getDefaultCalendar();
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfYesterday = new Date(
    startOfToday.getTime() - 24 * 60 * 60 * 1000
  );
  const endOfTomorrow = new Date(
    startOfToday.getTime() + 2 * 24 * 60 * 60 * 1000
  );
  const parentIdName = "parentId";
  const alarmId = "alarmId";
  const userProps = PropertiesService.getUserProperties();
  const mathchHelperRegExp = /\[.+ before\]:/;
  const matchParenIdRegExpt = /\[.+\]/;

  // Debounce guard to prevent loop
  const nowTs = Date.now();
  const lastRunTs = parseInt(userProps.getProperty("lastRun") || "0", 10);
  if (nowTs - lastRunTs < 5 * 1000) {
    // 5 sec
    log("⚠️ Skipping run to prevent loop re-trigger.");
    return;
  }
  userProps.setProperty("lastRun", nowTs.toString());

  const originalsEvents = [];
  const helpersEevents = [];
  //get all event in period
  cal.getEvents(startOfYesterday, endOfTomorrow).forEach((event) => {
    if (!mathchHelperRegExp.test(event.getTitle())) {
      originalsEvents.push(event);
    } else {
      helpersEevents.push(event);
    }
  });

  // delete helper event if parent have been deleted
  helpersEevents.forEach((event) => {
    const match = event
      .getDescription()
      .match(`${parentIdName}=${matchParenIdRegExpt}`);
    const parentId = match && match[1];
    if (parentId && !CalendarApp.getEventById(parentId)) {
      event.deleteEvent();
      log(`🗑️ Deleted orphan helper with missing parent: ${event.getTitle()}`);
    }
  });

  originalsEvents.forEach((event) => {
    const title = event.getTitle();
    const startTime = event.getStartTime();
    const id = event.getId();
    const shortIdForIphoneAlarm = getShortId(id);
    const description = event.getDescription();

    if (!description.includes(shortIdForIphoneAlarm)) {
      event.setDescription(
        description +
          `
                      \n\n${parentIdName}=[${id}]
                      \n${alarmId}=[${createShortId()}]
                    `
      );
    }

    let reminders = [
      ...event.getPopupReminders(),
      ...event.getEmailReminders(),
    ].sort((a, b) => a - b);
    // add defualt calendar app riminder
    if (reminders.length === 0) {
      reminders = [30]; // Assume default if none are set
    }

    const snapshotKey = `snapshot_${id}`;
    const lastSnapshotRaw = userProps.getProperty(snapshotKey);
    const lastSnapshot = lastSnapshotRaw
      ? JSON.parse(lastSnapshotRaw).reminders
      : [];

    if (JSON.stringify(lastSnapshot) === JSON.stringify(reminders)) {
      log(`✅ No reminder change for "${title}". Skipping.`);
      return;
    }

    log(`🔄 Changes detected for "${title}". Updating helpers.`);

    // Delete all old helpers for this event
    const allHelpers = cal
      .getEvents(startOfYesterday, endOfTomorrow)
      .filter(
        (e) =>
          e.getTitle().endsWith(`: ${title}`) &&
          e.getTitle().startsWith("[") &&
          e.getDescription().includes(`${parentIdName}=[${id}]`)
      );
    allHelpers.forEach((e) => {
      e.deleteEvent();
      log(`🗑️ Deleted helper: ${e.getTitle()}`);
    });

    // Create new helpers for current reminders
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
        // Create short id for itilities events and IPhone alarms
        description: `
                      \n\n${parentIdName}=[${id}]
                      \n${alarmId}=[${createShortId()}]
                    `,
      });

      log(`✅ Created helper: "${helperTitle}" at ${reminderTime}`);
    });

    userProps.setProperty(
      snapshotKey,
      JSON.stringify({
        reminders: reminders,
        endTime: event.getEndTime().getTime(),
      })
    );
  });
}
