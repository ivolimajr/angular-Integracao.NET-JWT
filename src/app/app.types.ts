import {FuseNavigationItem} from '@fuse/components/navigation';
import {Message} from 'app/layout/common/messages/messages.types';
import {Notification} from 'app/layout/common/notifications/notifications.types';
import {Shortcut} from 'app/layout/common/shortcuts/shortcuts.types';
import {Usuario} from 'app/shared/models/usuario.model';

export interface InitialData {
    messages: Message[];
    navigation: {
        compact: FuseNavigationItem[];
        default: FuseNavigationItem[];
        futuristic: FuseNavigationItem[];
        horizontal: FuseNavigationItem[];
    };
    notifications: Notification[];
    shortcuts: Shortcut[];
    user: Usuario;
}
