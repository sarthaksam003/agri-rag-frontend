import { IconButton } from "@/shared/components/ui/IconButton/IconButton";
import { BsStopFill } from "react-icons/bs";
import styles from "./ComposerToolbar.module.css";
import { useTranslation } from "@/features/localization/useTranslation";

interface StopButtonProps {
  onStop(): void;
  disabled?: boolean;
}

const StopButton = ({ onStop, disabled }: StopButtonProps) => {

  const { t } = useTranslation();
  return (
    <IconButton
      icon={<BsStopFill size={25} />}
      className={styles["send-btn"]}
      disabled={disabled}
      onClick={onStop}
      title={t("actions.stopGenerating")}
    />
  );
};

export default StopButton;