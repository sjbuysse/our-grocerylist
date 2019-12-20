import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

type Props = RouteComponentProps<any> & {
    onAcceptInvite: () => void;
}

const InviteExistingUser = ({onAcceptInvite, history}: Props) => (
    <div>
        You already have a grocery list linked to your account. If you accept the invite you will lose your current
        grocery list and join the new one.
        Are you sure you wish to do this?
        <br/>
        <div className="invite-existing-user-button-wrapper">
            <button className="button pointer" onClick={onAcceptInvite}>
                <strong>Yes</strong>
            </button>
            <button className="button button-red pointer" onClick={() => history.push('/')}>
                <strong>No, thanks</strong>
            </button>
        </div>
    </div>
)

export default withRouter(InviteExistingUser);
