// Libraries
import axios from "axios";
import { useContext, useState } from 'react';

// Contexts
import ListsContext from "../contexts/Lists.context";

const ListItem = ({ description, uuid, currentList }) => {
  const { dispatchLists } = useContext(ListsContext);
  const [entry, setEntry] = useState(description);
  const [isStatic, setIsStatic] = useState(true);
  const [oldValue, setOldValue] = useState(description);

  /**
   * 
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
   * 
   */
  const cancelChanges = () => {
    setEntry(oldValue);
    setIsStatic(true);
  };

  /**
   * 
   */
  const editItem = () => {
    setIsStatic(false);
  };

  /**
   * 
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
    )
};

export default ListItem;
