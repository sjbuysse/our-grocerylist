import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { StoreState } from '../../model/store-state.interface';
import { Route } from 'react-router';

interface HeaderContainerProps {
    displayName: string | undefined | null;
}

const HeaderContainer = ({displayName}: HeaderContainerProps) => {
    return (
        <Route render={({history}) => (
            <div>
                <Header onClickUser={() => history.push('/user')} displayName={displayName}/>
                <header className="header">
                    <h1 onClick={() => history.push('/')} className="pointer">groceries</h1>
                </header>
            </div>
        )}/>
    )
}

export function mapStateToProps({data}: StoreState): HeaderContainerProps {
    return {
        displayName: !!data.authMetaData ? data.authMetaData.displayName : undefined,
    }
}

export default connect(mapStateToProps)(HeaderContainer)
