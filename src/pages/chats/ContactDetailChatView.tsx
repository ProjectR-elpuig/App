import ContactDetail from '../contactos/ContactDetail';
import { useParams } from "react-router-dom";

const ContactDetailChatView: React.FC = () => {
    // Cambiar chatId → id para consistencia
    const { id } = useParams<{ id: string }>();

    return <ContactDetail
        hideMessageButton={true}
        customBackRoute={`/chats/chat/${id}`}
    />;
};

export default ContactDetailChatView;