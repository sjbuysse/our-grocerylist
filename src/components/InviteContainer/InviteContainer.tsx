import React, { Component } from 'react';
import { StoreState } from '../../model/store-state.interface';
import { UserData } from '../../model/user-data.interface';
import InviteExistingUser from './InviteExistingUser';
import { connect } from 'react-redux';
import * as actions from 'statemanagement/actions/data/data.actions';
import * as UserService from 'services/UserService';
import { RouteComponentProps, withRouter } from 'react-router';
import { first, tap } from 'rxjs/internal/operators';
import { uuid } from '../../utils';
import { AuthMetaData } from '../../model/auth-meta-data.interface';
import Spinner from '../Spinner/Spinner';
import { Dispatch } from 'redux';

type Props = RouteComponentProps<any> & {
    authMetaData: AuthMetaData;
    user: UserData | undefined;
    userHasGroceryListId: boolean;
    groceryListIdOfUser: string | undefined;
    setUserData: (userData: UserData | undefined) => void;
}

interface InviteContainerState {
    loading: boolean;
    groceryListIdOfInvite: string | undefined;
}

class InviteContainer extends Component<Props, InviteContainerState> {
    state: InviteContainerState = {
        loading: false,
        groceryListIdOfInvite: undefined
    };

    constructor(props: Props) {
        super(props);
        const searchParams = new URLSearchParams(props.history.location.search).get('groceryListId');
        if (!this.props.userHasGroceryListId) {
            this.state = {
                loading: true,
                groceryListIdOfInvite: !!searchParams ? searchParams : uuid()
            };
            this.onAcceptInvite();
        } else {
            this.state = {
                loading: false,
                groceryListIdOfInvite: !!searchParams ? searchParams : uuid()
            };
        }
    }

    onAcceptInvite = () => {
        UserService.addGroceryListIdToUserData(this.props.authMetaData, this.state.groceryListIdOfInvite!).pipe(
            first(),
            tap(this.props.setUserData),
        ).subscribe(() => {
            this.setState({
                loading: false,
            });
        });
    };

    render() {
        const userAlreadyHasDifferentGroceryList: boolean = (this.props.groceryListIdOfUser !== undefined && this.props.groceryListIdOfUser !== this.state.groceryListIdOfInvite)
        return this.state.loading ? (<Spinner/>) :
            (<div>
                {!!userAlreadyHasDifferentGroceryList
                    ? <InviteExistingUser onAcceptInvite={this.onAcceptInvite}/>
                    : (<div>
                        <p className="added-as-colaborator-text">You've been added as a collaborator to the grocery
                            list, and will be able to add, check
                            off and delete groceries.</p>
                    </div>)}
            </div>);
    }
}

export function mapStateToProps({data}: StoreState) {
    return {
        authMetaData: data.authMetaData!,
        user: data.user,
        userHasGroceryListId: !!data.user ? !!data.user.groceryListId : false,
        groceryListIdOfUser: !!data.user ? data.user.groceryListId : undefined,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.DataActions>) {
    return {
        setUserData: (userData: UserData | undefined) => dispatch(actions.setUser(userData)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InviteContainer));
