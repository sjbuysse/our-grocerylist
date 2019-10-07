import React, { Component } from 'react';
import { createGrocery, Grocery } from '../../model/grocery.interface';
import NewGrocery from './NewGrocery';
import GroceryList from './GroceryList';
import * as GroceryHttpService from 'services/GroceryService';
import { Observable, Subscription } from 'rxjs/index';
import { StoreState } from '../../model/store-state.interface';
import { connect } from 'react-redux';
import Spinner from '../Spinner/Spinner';
import { UserData } from '../../model/user-data.interface';
import { AuthMetaData } from '../../model/auth-meta-data.interface';
import * as UserService from 'services/UserService';
import * as actions from 'statemanagement/actions/data/data.actions';
import { map, switchMap, tap } from 'rxjs/internal/operators';
import { Dispatch } from 'redux';
import { Footer } from './Footer';
import { Filter } from '../../constants/constants';

interface GroceryContainerState {
    groceries: Grocery[];
    loading: boolean;
    editing: string;
    filter: Filter;
}

interface GroceryContainerProps {
    authMetaData: AuthMetaData,
    user: UserData | undefined,
    groceryListId: string | undefined,
    setUserData: (userData: UserData | undefined) => void,
}

class GroceryContainer extends Component<GroceryContainerProps, GroceryContainerState> {
    state: GroceryContainerState = {
        groceries: [],
        loading: true,
        editing: '',
        filter: Filter.ALL_GROCERIES
    };
    //@ts-ignore
    groceries$: Observable<Grocery[]>;

    private subscriptions: Subscription[] = [];

    componentDidMount() {
        if (!this.props.user || !this.props.user.groceryListId) {
            this.groceries$ = UserService.getUserDataOrCreateIfUndefined$(this.props.authMetaData).pipe(
                tap(this.props.setUserData),
                map(userData => userData!.groceryListId),
                switchMap(GroceryHttpService.getAll));
        } else {
            this.groceries$ = GroceryHttpService.getAll(this.props.user.groceryListId);
        }

        this.subscriptions.push(this.groceries$.subscribe((groceries: Grocery[]) =>
            this.setState({groceries, loading: false})));
    }

    componentWillUnmount() {
        this.subscriptions.filter(s => !s.closed).forEach(s => s.unsubscribe());
    }

    getActiveTodosCount(): number {
        return this.state.groceries.filter(grocery => !grocery.completed).length;
    }

    handleCreateGrocery = (value: string) => {
        const grocery: Grocery = createGrocery(value);
        if (this.props.groceryListId) {
            GroceryHttpService.add(this.props.groceryListId, grocery);
        }
    }

    toggle = (id: string) => {
        const toggledGrocery: Grocery = this.state.groceries.find(grocery => grocery.id === id) as Grocery;
        if (this.props.groceryListId) {
            GroceryHttpService.update(this.props.groceryListId, {
                ...toggledGrocery,
                completed: !toggledGrocery.completed
            });
        }
    }

    destroy = (id: string) => {
        if (this.props.groceryListId) {
            GroceryHttpService.remove(this.props.groceryListId, id);
        }
    }

    destroyAllCompleted = () => {
        const completedGrocerylistIds: string[] = this.state.groceries.filter(grocery => grocery.completed).map(grocery => grocery.id);
        if (this.props.groceryListId) {
            GroceryHttpService.removeBatch(this.props.groceryListId.toString(), completedGrocerylistIds).then(() => console.log('deleted batch'));
        }
    }

    toggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        const groceryIds = this.state.groceries.map(grocery => grocery.id);
        if (this.props.groceryListId) {
            GroceryHttpService.toggleAll(this.props.groceryListId.toString(), groceryIds, checked).then(() => console.log('completed'));
        }
    }

    edit = (groceryId: string) => {
        this.setState(() => ({
            editing: groceryId
        }));
    }

    save = (id: string, text: string) => {
        const grocery: Grocery = createGrocery(text, id);
        if (this.props.groceryListId) {
            GroceryHttpService.update(this.props.groceryListId, grocery);
            this.setState({
                editing: ''
            });
        }
    }

    cancel = () => {
        this.setState({editing: ''});
    }

    setFilter = (filter: Filter) => {
        this.setState({filter})
    }

    getFiteredGroceries = (): Grocery[] => {
        switch(this.state.filter) {
            case Filter.ALL_GROCERIES:
                return this.state.groceries;
                break;
            case Filter.COMPLETED_GROCERIES:
                return this.state.groceries.filter(grocery => grocery.completed);
                break;
            case Filter.ACTIVE_GROCERIES:
                return this.state.groceries.filter(grocery => !grocery.completed);
                break;
        }
    }

    render() {
        return (
            <div>
                {this.state.loading ? (<Spinner/>) :
                    (<div className="grocery-list-with-input-wrapper">
                        <NewGrocery handleCreateGrocery={this.handleCreateGrocery}
                                    activeTodosCount={this.getActiveTodosCount()}
                                    toggleAll={this.toggleAll}/>
                        {this.state.groceries && (
                            <GroceryList groceries={this.getFiteredGroceries()}
                                         handleToggle={this.toggle}
                                         handleSave={this.save}
                                         handleDestroy={this.destroy}
                                         handleEdit={this.edit}
                                         editing={this.state.editing}
                                         handleCancel={this.cancel}
                            />
                        )}
                        <Footer
                            count={this.getActiveTodosCount()}
                            onFilter={this.setFilter}
                            completedCount={this.state.groceries.length - this.getActiveTodosCount()}
                            onClearCompleted={this.destroyAllCompleted}
                            nowShowing={this.state.filter}
                        />
                    </div>)}
            </div>
        );
    }
}

export function mapStateToProps({data}: StoreState) {
    return {
        user: data.user,
        groceryListId: !!data.user ? data.user.groceryListId : undefined,
        authMetaData: data!.authMetaData!
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.DataActions>) {
    return {
        setUserData: (userData: UserData | undefined) => dispatch(actions.setUser(userData)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroceryContainer)

