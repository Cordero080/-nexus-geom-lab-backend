import ScrambleButton from '../../../ui/ScrambleButton/ScrambleButton';
import styles from './ExitButton.module.scss';

function ExitButton({ onClick }) {
  return (
    <div className={styles.exitButtonContainer}>
      <ScrambleButton
        onClick={onClick}
        variant="danger"
        className={styles.exitButton}
      >
        Exit
      </ScrambleButton>
    </div>
  );
}

export default ExitButton;
