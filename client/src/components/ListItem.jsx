// Libraries
import axios from "axios";
import { useContext, useState } from 'react';

// Contexts
import AuthContext from "../contexts/Auth.context";
import ListsContext from "../contexts/Lists.context";

/**
 * List item component.
 * 
 * @component
 * @param {Object} props             Properties used by the component.
 * @param {string} props.description The list item description/name.
 * @param {string} props._id         Database ID of the item.
 * @param {Object} props.currentList The current list being viewed.
 * @returns {React.JSX.Element} The rendered list item component.
 */
const ListItem = ({ currentList, description, _id, isCompleted, prevListId }) => {
  const { lists, dispatchLists } = useContext(ListsContext);
  const { user } = useContext(AuthContext);
  const [entry, setEntry] = useState(description);
  const [isChecked, setIsChecked] = useState(isCompleted);
  const [isStatic, setIsStatic] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const targetedItems = (isCompleted) ? 'completed_items' : 'uncompleted_items';

  /**
   * Deletes the item from the list in the database and state.
   */
  const deleteItem = () => {
    axios.patch(
      `/api/v1/lists/${currentList._id}`,
      { [targetedItems]: currentList[targetedItems].filter((item) => item._id !== _id) },
      { headers: { Authorization: `Bearer ${user.token}` } }
    )
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchLists({
          payload: {
            ...currentList,
            [targetedItems]: currentList[targetedItems].filter((item) => item._id !== _id)
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
    setEntry(description);
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
      { [targetedItems]: [
        ...currentList[targetedItems].filter((item) => item._id !== _id),
        { _id, description: entry, prev_list_id: prevListId, list_id: currentList._id }
      ]},
      { headers: { Authorization: `Bearer ${user.token}` } }
    )
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchLists({
          payload: {
            ...currentList,
            [targetedItems]: [
              ...currentList[targetedItems].filter((item) => item._id !== _id),
              { _id, description: entry, prev_list_id: prevListId, list_id: currentList._id }
            ],
          },
          type: 'UPDATE_LIST'
        });
      }
    })
    .catch((error) => console.error(error.message))
  };

  /**
   * TODO
   * @param {Event} event TODO
   */
  const toggleCompletion = () => {
    setIsChecked(true);
    setIsPending(true);
    const updatedItems = (isCompleted) ? {
      uncompleted_items: [
        ...currentList.uncompleted_items,
        { _id, description: description, prev_list_id: prevListId, list_id: currentList._id },
      ],
      completed_items: [
        ...currentList.completed_items.filter((item) => item._id !== _id)
      ],
    } : {
      completed_items: [
        ...currentList.completed_items,
        { _id, description: description, prev_list_id: prevListId, list_id: currentList._id },
      ],
      uncompleted_items: [
        ...currentList.uncompleted_items.filter((item) => item._id !== _id)
      ],
    };
    
    axios.patch(
      `/api/v1/lists/${currentList._id}`,
      updatedItems,
      { headers: { Authorization: `Bearer ${user.token}` } }
    )
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchLists({
          payload: {
            ...currentList,
            ...updatedItems,
          },
          type: 'UPDATE_LIST'
        });
      }
    })
    .catch((error) => console.error(error.message));
  };
  
  return (
    <>
      { isStatic ? (
        <>
          <input
            type="checkbox"
            checked={isChecked}
            disabled={isPending}
            onChange={toggleCompletion}
          />
          <p>{description}</p>
          <button disabled={isPending} onClick={editItem}>Edit</button>
          <button disabled={isPending} onClick={deleteItem}>Delete</button>
        </>
      ) : (
        <>
          <input type="text" value={entry} onChange={(event) => setEntry(event.target.value)} />
          <button onClick={saveChanges}>Save</button>
          <button onClick={cancelChanges}>Cancel</button>
        </>
      )}
    </>
  );
};

export default ListItem;
