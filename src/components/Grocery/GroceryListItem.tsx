import React, { Component, RefObject } from 'react';
import { Grocery } from '../../model/grocery.interface';
import classnames from 'classnames';
import { ENTER_KEY, ESCAPE_KEY } from 'constants/constants';

interface GroceryItemProps {
    grocery: Grocery;
    editing: boolean;
    onSave: (value: string) => void;
    onDestroy: () => void;
    onEdit: () => void;
    onCancel: () => void;
    onToggle: () => void;
}

interface GroceryState {
    editText: string;
}

class GroceryListItem extends Component<GroceryItemProps, GroceryState> {
    state = {
        editText: ''
    }

    private textInput: RefObject<HTMLInputElement> = React.createRef();

    handleSubmit = () => {
        const value = this.state.editText.trim();
        if (value) {
            this.props.onSave(value);
            this.setState({editText: value});
        } else {
            this.props.onDestroy();
        }
    }

    handleEdit = () => {
        this.props.onEdit();
        this.setState({editText: this.props.grocery.name});
    }

    handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.which === ESCAPE_KEY) {
            this.setState({editText: this.props.grocery.name});
            this.props.onCancel();
        } else if (event.which === ENTER_KEY) {
            this.handleSubmit();
        }
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.editing) {
            this.setState({editText: event.target.value});
        }
    }

    /**
     * This is a completely optional performance enhancement that you can
     * implement on any React component. If you were to delete this method
     * the app would still work correctly (and still be very performant!), we
     * just use it as an example of how little code it takes to get an order
     * of magnitude performance improvement.
     */
    shouldComponentUpdate(nextProps: GroceryItemProps, nextState: GroceryState) {
        return (
            nextProps.grocery !== this.props.grocery ||
            nextProps.editing !== this.props.editing ||
            nextState.editText !== this.state.editText
        );
    }

    /**
     * Focus on input element if we start editing
     */
    componentDidUpdate(prevProps: GroceryItemProps) {
        if (!prevProps.editing && this.props.editing && this.textInput.current) {
            this.textInput.current.focus();
        }
    }

    render() {
        return (
            <li className={classnames({
                completed: this.props.grocery.completed,
                editing: this.props.editing
            })}>
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={this.props.grocery.completed}
                        onChange={this.props.onToggle}
                    />
                    <label onDoubleClick={this.handleEdit}>
                        {this.props.grocery.name}
                    </label>
                    <button className="destroy" onClick={this.props.onDestroy}/>
                </div>
                <input
                    ref={this.textInput}
                    className="edit"
                    value={this.state.editText}
                    onBlur={this.handleSubmit}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                />
            </li>
        );
    }
}


export default GroceryListItem;
