import { AuthMetaData } from '../model/auth-meta-data.interface';
import { UserData } from '../model/user-data.interface';

export interface State {
    authMetaData?: AuthMetaData;
    user?: UserData;
}
