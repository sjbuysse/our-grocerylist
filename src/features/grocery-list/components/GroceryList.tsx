import React from 'react';
import { Grocery } from '../model/grocery.interface';
import GroceryListItem from './GroceryListItem';

interface GroceryListProps {
    groceries: Grocery[];
    handleToggle: (id: string) => void;
    handleSave: (id: string, text: string) => void;
    handleDestroy: (id: string) => void;
    handleEdit: (id: string) => void;
    handleCancel: () => void;
    editing: string;
}

const GroceryList = (props: GroceryListProps) => {
    const groceries = props.groceries.map((grocery) => {
        return (
            <GroceryListItem
                key={grocery.id}
                grocery={grocery}
                onToggle={() => props.handleToggle(grocery.id)}
                onDestroy={() => props.handleDestroy(grocery.id)}
                onEdit={() => props.handleEdit(grocery.id)}
                editing={props.editing === grocery.id}
                onSave={(name: string) => props.handleSave(grocery.id, name)}
                onCancel={props.handleCancel}
            />
        );
    });
    return (
        <section className="main">
            <ul className="grocery-list">
                {groceries}
            </ul>
        </section>
    )
}

export default GroceryList;
