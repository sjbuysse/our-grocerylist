import {createButton} from 'react-social-login-buttons';
import SecretUserIcon from './SecretUserIcon';

const config = {
    text: 'Login anonymously',
    icon: SecretUserIcon,
    style: { background: '#3b5998' },
    activeStyle: { background: '#293e69' }
};
/** My Anonymous login button. */
const AnonymousLoginButton = createButton(config);

export default AnonymousLoginButton;