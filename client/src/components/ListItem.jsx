import axios from "axios";
import { useState } from 'react';

const ListItem = ({ description, dispatchItems, uuid, items, list }) => {
  const [entry, setEntry] = useState(description);
  const [isStatic, setIsStatic] = useState(true);
  const [oldValue, setOldValue] = useState(description);

  /**
   * 
   */
  const deleteItem = () => {
    axios.patch(
      `/api/v1/lists/${list._id}`,
      { items: items.filter((item) => item.uuid !== uuid) },
    )
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchItems({ payload: { uuid }, type: 'DELETE_ITEM' });
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
      `/api/v1/lists/${list._id}`,
      { items: [
        ...items.filter((item) => item.uuid !== uuid),
        { uuid: uuid, description: entry }
      ]}
    )
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchItems({ payload: { uuid, description: entry }, type: 'UPDATE_ITEM' });
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
