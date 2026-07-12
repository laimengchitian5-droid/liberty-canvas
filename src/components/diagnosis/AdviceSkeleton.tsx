import styles from "./diagnosis.module.css";

export function AdviceSkeleton() {
  return (
    <div className={styles.skeletonStack} aria-live="polite" aria-busy="true">
      <span className="sr-only">AI アドバイスを生成しています</span>
      <div className={styles.skeletonBlockWide} />
      <div className={styles.skeletonBlockMedium} />
      <div className={styles.skeletonBlockWide} />
      <div className={styles.skeletonBlock} />
    </div>
  );
}
