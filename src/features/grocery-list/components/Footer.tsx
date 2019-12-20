import React from 'react';
import { Filter } from 'constants/constants';
import classnames from 'classnames';

interface Props {
    count: number;
    completedCount: number;
    onClearCompleted: () => void;
    nowShowing: string;
    onFilter: (filter: Filter) => void;
}
export const Footer = ({count, completedCount, onClearCompleted, nowShowing, onFilter}: Props) => {
    const activeTodoWord: string = pluralize(count, 'item');
    let clearButton = null;

    if (completedCount > 0) {
        clearButton = (
            <button
                className="clear-completed"
                onClick={onClearCompleted}>
                Clear completed
            </button>
        );
    }

    return (
        <footer className="footer">
					<span className="grocery-count">
						<strong>{count}</strong> {activeTodoWord} left
					</span>
            <ul className="filters">
                <li onClick={() => onFilter(Filter.ALL_GROCERIES)}>
                    <a
                        href="#/"
                        className={classnames({selected: nowShowing === Filter.ALL_GROCERIES})}>
                        All
                    </a>
                </li>
                {' '}
                <li onClick={() => onFilter(Filter.ACTIVE_GROCERIES)}>
                    <a
                        href="#/active"
                        className={classnames({selected: nowShowing === Filter.ACTIVE_GROCERIES})}>
                        Active
                    </a>
                </li>
                {' '}
                <li onClick={() => onFilter(Filter.COMPLETED_GROCERIES)}>
                    <a
                        href="#/completed"
                        className={classnames({selected: nowShowing === Filter.COMPLETED_GROCERIES})}>
                        Completed
                    </a>
                </li>
            </ul>
            {clearButton}
        </footer>
    );
}

function pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's';
}
