import React, { Component } from 'react';
import { ENTER_KEY } from '../../constants/constants';

interface NewGroceryState {
    newGrocery: string;
}

interface NewGroceryProps {
    handleCreateGrocery: (grocery: string) => void,
    toggleAll: (event: React.ChangeEvent<HTMLInputElement>) => void,
    activeTodosCount: number
}

class NewGrocery extends Component<NewGroceryProps, NewGroceryState> {
    state: NewGroceryState = {
        newGrocery: ''
    }

    handleNewGroceryKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode !== ENTER_KEY) {
            return;
        }

        event.preventDefault();

        const val = this.state.newGrocery.trim();

        if (val) {
            this.props.handleCreateGrocery(val);
            this.setState(() => ({
                newGrocery: '',
            }));
        }
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({newGrocery: event.target.value});
    }

    render() {
       return (
           <div>
               <input
                   id="toggle-all"
                   className="toggle-all"
                   type="checkbox"
                   onChange={this.props.toggleAll}
                   checked={this.props.activeTodosCount === 0}
               />
               <label
                   htmlFor="toggle-all"
               />
               <input
                   className="new-grocery"
                   placeholder="What do we need?"
                   value={this.state.newGrocery}
                   onKeyDown={this.handleNewGroceryKeyDown}
                   onChange={this.handleChange}
                   autoFocus={true}
               />
           </div>

       );
    }
}

export default NewGrocery;
