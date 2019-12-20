import React from 'react';
import Icon from '../Icon/Icon';
import { ICONS } from '../../../constants/constants';

interface HeaderProps {
    onClickUser: () => void;
    displayName: string | undefined | null;
}

const Header = ({onClickUser, displayName}: HeaderProps) => (
    <div>
        <button onClick={onClickUser} className='open-user-details-button pointer'>
            <Icon icon={ICONS.USER} color={'black'} size={16}/>
            <span>{displayName}</span>
        </button>
    </div>
)

export default Header;
