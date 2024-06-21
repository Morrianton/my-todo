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
  const [isStatic, setIsStatic] = useState(true);
  const [itemEntry, setItemEntry] = useState('');
  const [listEntry, setListEntry] = useState(currentList.name);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingListItems, setIsLoadingListItems] = useState(false);

  /**
   * Adds a new item to the list in the database and state.
   */
  const addListItem = () => {
    const uuid = uuidv4();
    setIsLoadingListItems(true);

    axios.patch(
      `/api/v1/lists/${currentList._id}`,
      { items: [
        ...currentList.items,
        { uuid: uuid, description: itemEntry }
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
            items: [...currentList.items, { uuid: uuid, description: itemEntry }]
          }
        });
      }
    })
    .catch((error) => {
      // toast pop-up
      console.error(error.message);
    })
    .finally(() => {
      setItemEntry('');
      setIsLoadingListItems(false);
    });
  };

  /**
   * 
   */
  const cancelChanges = () => {
    setIsStatic(true);
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

  /**
   * 
   */
  const editList = () => {
    setListEntry(currentList.name);
    setIsStatic(false);
  };

  /**
   * 
   */
  const saveChanges = () => {
    setIsLoadingList(true);
    axios.patch(
      `/api/v1/lists/${currentList._id}`,
      { name: listEntry },
      { headers: { Authorization: `Bearer ${user.token}` } }
    )
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchLists({
          payload: { ...currentList, name: listEntry },
          type: 'UPDATE_LIST',
        });
      }
    })
    .catch((error) => {
      console.error(error.message);
    })
    .finally(() => {
      setIsLoadingList(false);
      setIsStatic(true);
    });
  };
  
  return (
    <>
      { isStatic ? (
        <>
          <p>{currentList.name}</p>
          <button disabled={isLoadingList} onClick={editList}>Edit List</button>
          <button disabled={isLoadingList} onClick={deleteList}>Delete List</button>
        </>
      ) : (
        <>
          <input type="text" value={listEntry} onChange={(event) => setListEntry(event.target.value)}/>
          <button disabled={isLoadingList} onClick={saveChanges}>Save</button>
          <button disabled={isLoadingList} onClick={cancelChanges}>Cancel</button>
        </>
      )}
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
      <input type="text" value={itemEntry} onChange={(event) => setItemEntry(event.target.value)} />
      <button disabled={isLoadingListItems} onClick={addListItem}>{(isLoadingListItems) ? 'Loading...' : 'Add Item'}</button>
    </>
  );
};

export default ListView;
