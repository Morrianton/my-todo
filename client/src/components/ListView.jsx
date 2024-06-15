// Libraries
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useContext, useState } from 'react';

// Contexts
import ListsContext from '../contexts/Lists.context';

// Components
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
      ]}
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
  
  return (
    <>
      <p>{ currentList.name }</p>
      <input type="text" value={entry} onChange={(event) => setEntry(event.target.value)} />
      <button onClick={ addListItem }>Add Item</button>
      {
        currentList.items.map((item) => {
          return <ListItem
            key={item.uuid}
            description={item.description}
            dispatchLists={dispatchLists}
            uuid={item.uuid}
            currentList={currentList}
          ></ListItem>
        })
      }
    </>
  );
};

export default ListView;
