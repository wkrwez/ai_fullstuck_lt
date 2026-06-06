import styles from "./Button1.module.css";

export default function Button1() {
  return (
    <div className={styles["btn-wrapper"]}>
      <button className={styles["btn"]}>button1</button>
    </div>
  );
}
