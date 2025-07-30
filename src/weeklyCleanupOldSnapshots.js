function weeklyCleanupOldSnapshots() {
  const userProps = PropertiesService.getUserProperties();
  const allProps = userProps.getProperties();
  const nowTs = Date.now();

  let deletedCount = 0;
  for (const key in allProps) {
    if (key.startsWith("snapshot_")) {
      try {
        const data = JSON.parse(allProps[key]);
        if (!data.endTime || data.endTime < nowTs) {
          userProps.deleteProperty(key);
          deletedCount++;
          log(`🧹 Deleted snapshot for past event: ${key}`);
        }
      } catch (e) {
        userProps.deleteProperty(key);
        deletedCount++;
        log(`🧹 Deleted legacy snapshot (invalid JSON): ${key}`);
      }
    }
  }

  log(
    `✅ weeklyCleanupOldSnapshots completed: ${deletedCount} past snapshots removed.`
  );
}
