import './SettingsButtons.css';
import { IonIcon } from '@ionic/react';
import { bookmarkOutline } from 'ionicons/icons';

interface SettingsButtonsProps {
  text: string;
  icon?: string;
}

const SettingsButtons: React.FC<SettingsButtonsProps> = ({ text, icon }) => {
  return (
    <div className="settings-button">
        <IonIcon className='button-icon' icon={icon || bookmarkOutline}/>
        <span className='button-text'>{text}</span>
    </div>
  );
};

export default SettingsButtons;
