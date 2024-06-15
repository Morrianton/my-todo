import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useReducer, useState } from 'react';

import ItemsReducer from '../reducers/Items.reducer';

import ListItem from "./ListItem";

const ListView = ({ currentList }) => {
  const [items, dispatchItems] = useReducer(ItemsReducer, currentList.items);
  const [entry, setEntry] = useState('');

  useEffect(() => {
    dispatchItems({ payload: currentList.items, type: 'SET_ITEMS' });
  }, [currentList]);

  /**
   * 
   * @param {*} entry 
   */
  const addListItem = () => {
    const uuid = uuidv4();

    axios.patch(
      `/api/v1/lists/${currentList._id}`,
      { items: [
        ...items,
        { uuid: uuid, description: entry }
      ]}
    )
    .then((response) => {
      // toast pop-up
      if (response.statusText === 'OK') {
        dispatchItems({ type: 'CREATE_ITEM', payload: { uuid: uuid, description: entry } });
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
        items.map((item) => {
          return <ListItem
            key={item.uuid}
            description={item.description}
            dispatchItems={dispatchItems}
            uuid={item.uuid}
            items={items}
            list={currentList}
          ></ListItem>
        })
      }
    </>
  );
};

export default ListView;
