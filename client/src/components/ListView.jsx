// Libraries
import axios from 'axios';
import { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Contexts
import ListsContext from '../contexts/Lists.context';

// Components
import AuthContext from '../contexts/Auth.context';
import ListItem from "./ListItem";

/**
 * List view component.
 * 
 * @component
 * @param {Object} props             Properties used by the component.
 * @param {Object} props.currentList The current list being viewed. 
 * @returns {React.JSX.Element} The rendered list view component.
 */
const ListView = ({ currentList }) => {
  const { dispatchLists } = useContext(ListsContext);
  const { user } = useContext(AuthContext);
  const [entry, setEntry] = useState('');

  /**
   * Adds a new uncompleted task to the list in the database and state.
   */
  const addListItem = () => {
    axios.patch(
      `/api/v1/lists/${currentList._id}`,
      { uncompleted_items: [
        ...currentList.uncompleted_items,
        {
          description: entry,
          prev_list_id: currentList._id,
          list_id: currentList._id,
        },
      ]},
      { headers: { Authorization: `Bearer ${user.token}` } }
    )
    .then((response) => {
      // toast pop-up
      if (response.statusText === 'OK') {
        dispatchLists({
          type: 'UPDATE_LIST',
          payload: {
            ...currentList,
            uncompleted_items: [
              ...currentList.uncompleted_items,
              {
                description: entry,
                prev_list_id: currentList._id,
                list_id: currentList._id,
              },
            ],
          },
        });
        setEntry('');
      }
    })
    .catch((error) => {
      // toast pop-up
      console.error(error.message);
    });
  };

  /**
   * Clears all completed tasks from the list in the database and state.
   */
  const clearCompleted = () => {
    axios.patch(
      `/api/v1/lists/${currentList._id}`,
      { completed_items: [] },
      { headers: { Authorization: `Bearer ${user.token}` } }
    )
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchLists({
          payload: {
            ...currentList,
            completed_items: [],
          },
          type: 'UPDATE_LIST'
        })
      }
    })
    .catch((error) => console.error(error.message));
  };

  /**
   * Deletes the current list if user confirms.
   */
  const deleteList = () => {
    const acceptsDeletion = window.confirm(`Are you sure you want to delete the ${currentList.name} list?`);

    if (acceptsDeletion) {
      axios.delete(
        `/api/v1/lists/${currentList._id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((response) => {
        if (response.statusText === 'OK') {
          dispatchLists({ payload: currentList, type: 'DELETE_LIST' });
        }
      })
      .catch((error) => console.error(error.message));
    }
  };

  return (
    <>
      <p>{currentList.name}</p>
      <button onClick={deleteList}>Delete List</button>
      {
        (currentList.uncompleted_items.length > 0) ? (
          currentList.uncompleted_items.map((item) => {
            return <ListItem
              currentList={currentList}
              description={item.description}
              _id={item._id}
              isCompleted={false}
              key={uuidv4()}
            />;
          })
        ) : <p>No list items yet.</p>
      }
      <p>Completed</p>
      <button onClick={clearCompleted}>Clear Completed</button>
      {
        currentList.completed_items.length > 0 && (
          currentList.completed_items.map((item) => {
            return <ListItem
              currentList={currentList}
              description={item.description}
              _id={item._id}
              isCompleted={true}
              key={uuidv4()}
            />
          })
        )
      }
      <input type="text" value={entry} onChange={(event) => setEntry(event.target.value)} />
      <button onClick={addListItem}>Add Item</button>
    </>
  );
};

export default ListView;
