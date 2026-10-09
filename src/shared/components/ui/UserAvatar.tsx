import { getInitials } from "@/features/settings/utils/avatar";
import styles from "./UserAvatar.module.css";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
  initialsSize?: string;
}

const UserAvatar = ({
  name,
  avatarUrl,
  size = 32,
  className = "",
  initialsSize = "1rem",
}: UserAvatarProps) => {
  const initials = getInitials(name);
  const hasImage = Boolean(avatarUrl && avatarUrl.startsWith("data:image/"));

  return (
    <span
      className={`${styles.avatar} ${className}`.trim()}
      style={{ width: size, height: size, borderRadius:"0.4rem" }}
      aria-label={hasImage ? `${name}'s profile picture` : `${name} initials ${initials}`}
      
    >
      {hasImage ? (
        <img
          src={avatarUrl ?? undefined}
          alt={`${name} profile`}
          className={styles.image}
          draggable={false}
          referrerPolicy="no-referrer"
          onContextMenu={(event) => event.preventDefault()}
        />
      ) : (
        <span className={styles.initials} style={{ fontSize: initialsSize }}>
          {initials}
        </span>
      )}
    </span>
  );
};

export default UserAvatar;
