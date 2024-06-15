// Libraries
import axios from "axios";
import { useContext, useState } from 'react';

// Contexts
import ListsContext from "../contexts/Lists.context";

/**
 * List item component.
 * 
 * @component
 * @param {Object} props       Properties used by the component.
 * @param {string} description The list item description/name.
 * @param {string} uuid        Unique ID of the item.
 * @param {Object} currentList The current list being viewed.
 * @returns {JSX.Element} The rendered list item component.
 */
const ListItem = ({ description, uuid, currentList }) => {
  const { dispatchLists } = useContext(ListsContext);
  const [entry, setEntry] = useState(description);
  const [isStatic, setIsStatic] = useState(true);
  const [oldValue, setOldValue] = useState(description);

  /**
   * Deletes the item from the list in the database and state.
   */
  const deleteItem = () => {
    axios.patch(
      `/api/v1/lists/${currentList._id}`,
      { items: currentList.items.filter((item) => item.uuid !== uuid) },
    )
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchLists({
          payload: {
            ...currentList,
            items: currentList.items.filter((item) => item.uuid !== uuid)
          },
          type: 'UPDATE_LIST',
        });
      }
    })
    .catch((error) => console.error(error));
  };

  /**
   * Cancels changes to the item.
   */
  const cancelChanges = () => {
    setEntry(oldValue);
    setIsStatic(true);
  };

  /**
   * Initiates item editing.
   */
  const editItem = () => {
    setIsStatic(false);
  };

  /**
   * Saves changes to the item in the list in the database and state.
   */
  const saveChanges = () => {
    axios.patch(
      `/api/v1/lists/${currentList._id}`,
      { items: [
        ...currentList.items.filter((item) => item.uuid !== uuid),
        { uuid: uuid, description: entry }
      ]}
    )
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchLists({
          payload: {
            ...currentList,
            items: [...currentList.items.filter((item) => item.uuid !== uuid), { uuid, description: entry }]
          },
          type: 'UPDATE_LIST'
        });
      }
    })
    .catch((error) => console.error(error.message))
    .finally(() => {
      setOldValue(entry);
      setIsStatic(true);
    });
  };
  
  return (
    <>
      { isStatic ? (
        <>
          <p>{description}</p>
          <button onClick={editItem}>Edit</button>
          <button onClick={deleteItem}>Delete</button>
        </>
      ) : (
        <>
          <input type="text" value={entry} onChange={(event) => setEntry(event.target.value)}/>
          <button onClick={saveChanges}>Save</button>
          <button onClick={cancelChanges}>Cancel</button>
        </>
      )}
    </>
  );
};

export default ListItem;
