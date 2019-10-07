import React, { Component } from 'react';
import fire from '../../fire';
import { StoreState } from '../../model/store-state.interface';
import { connect } from 'react-redux';
import { UserData } from '../../model/user-data.interface';
import * as UserService from 'services/UserService';
import { first, map, switchMap, tap } from 'rxjs/internal/operators';
import { Dispatch } from 'redux';
import * as actions from 'statemanagement/actions/data/data.actions';
import Spinner from '../Spinner/Spinner';
import { Observable } from 'rxjs/index';
import { AuthMetaData } from '../../model/auth-meta-data.interface';

interface Props {
    authMetaData: AuthMetaData,
    groceryListId: string | undefined,
    user: UserData | undefined,
    setUserData: (userData: UserData | undefined) => void,
}

interface UserSettingsContainerState {
    loading: boolean;
    membersOfGroceryList: UserData[];
}

class UserSettingsContainer extends Component<Props, UserSettingsContainerState> {
    state: UserSettingsContainerState = {
        loading: true,
        membersOfGroceryList: []
    };

    componentDidMount() {
        let getMembersOfGroceryList$: Observable<UserData[]>;
        if (!this.props.user || !this.props.groceryListId) {
            getMembersOfGroceryList$ = UserService.getUserDataOrCreateIfUndefined$(this.props.authMetaData).pipe(
                tap(this.props.setUserData),
                map(userData => userData!),
                switchMap(userData => UserService.getUsersByGroceryListId(userData.groceryListId).pipe(
                    first(),
                    map(users => users!))));
        } else {
            getMembersOfGroceryList$ = UserService.getUsersByGroceryListId(this.props.groceryListId).pipe(
                first(),
                map(users => users!));
        }
        getMembersOfGroceryList$.subscribe((users: UserData[]) => {
            this.setState({
                membersOfGroceryList: users,
                loading: false
            });
        });
    }

    logout = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        fire.auth().signOut()
    };

    render() {
        return (
            <div className="user-settings-container">
                {this.state.loading ? (<Spinner/>) :
                    (<div>
                        <h3>Members:</h3>
                        <ul>
                            {this.state.membersOfGroceryList.map(user => (
                                <li key={user.id}>{user.displayName}</li>
                            ))}
                        </ul>
                        < p> share this invite link with your partner to work together on the grocery list</p>
                        <div className="share-url-wrapper">
                            <code>https://{window.location.hostname}/invite?groceryListId={this.props.groceryListId}</code>
                        </div>
                        <h3 className="user-setting-actions-title">User actions</h3>
                        <div className="user-setting-actions-wrapper">
                            <div className="user-settings-action">
                                <span>Log me out</span>
                                <button className="button button-red pointer" onClick={this.logout}>
                                    <strong>Logout</strong>
                                </button>
                            </div>
                        </div>
                    </div>)
                }
            </div>

        )
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.DataActions>) {
    return {
        setUserData: (userData: UserData | undefined) => dispatch(actions.setUser(userData)),
    }
}

export function mapStateToProps({data}: StoreState) {
    return {
        groceryListId: !!data.user ? data.user.groceryListId : undefined,
        user: data.user,
        authMetaData: data!.authMetaData!
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingsContainer);
