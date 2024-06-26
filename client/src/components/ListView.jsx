// Libraries
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useContext, useState } from 'react';

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
 * @returns {JSX.Element} The rendered list view component.
 */
const ListView = ({ currentList }) => {
  const { dispatchLists } = useContext(ListsContext);
  const { user } = useContext(AuthContext);
  const [entry, setEntry] = useState('');

  /**
   * Adds a new item to the list in the database and state.
   */
  const addListItem = () => {
    const uuid = uuidv4();

    axios.patch(
      `/api/v1/lists/${currentList._id}`,
      { items: [
        ...currentList.items,
        { uuid: uuid, description: entry }
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
            items: [...currentList.items, { uuid: uuid, description: entry }]
          }
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
      {
        (currentList.items.length > 0) ? (
          currentList.items.map((item) => {
            return <ListItem
            key={item.uuid}
            description={item.description}
            dispatchLists={dispatchLists}
            uuid={item.uuid}
            currentList={currentList}
            ></ListItem>
          })
        ) : <p>No list items yet.</p>
      }
      <input type="text" value={entry} onChange={(event) => setEntry(event.target.value)} />
      <button onClick={addListItem}>Add Item</button>
    </>
  );
};

export default ListView;
