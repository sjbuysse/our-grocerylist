import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { selectors as authSelectors } from '../../../features/user'

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

export function mapStateToProps(rootState: any): HeaderContainerProps {
    return {
        displayName: !!authSelectors.getAuthMetaData(rootState) ? authSelectors.getAuthMetaData(rootState)!.displayName : undefined,
    }
}

export default connect(mapStateToProps)(HeaderContainer)
