function cleanupOldSnapshots() {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfYesterday = new Date(startOfToday.getTime() - MS_PER_DAY);
  const userProps = PropertiesService.getUserProperties();
  const allProps = userProps.getProperties();

  let deletedCount = 0;
  for (const key in allProps) {
    if (key.startsWith("snapshot_")) {
      try {
        const data = JSON.parse(allProps[key]);
        if (!data.endTime || data.endTime < startOfYesterday) {
          userProps.deleteProperty(key);
          deletedCount++;
          Logger.log(`🧹 Deleted snapshot for past event: ${key}`);
        }
      } catch (e) {
        // Handle legacy format without endTime by deleting (safe fallback)
        userProps.deleteProperty(key);
        deletedCount++;
        Logger.log(`🧹 Deleted legacy snapshot (invalid JSON): ${key}`);
      }
    }
  }

  Logger.log(
    `✅ cleanupOldSnapshots completed: ${deletedCount} snapshots removed.`
  );
}
