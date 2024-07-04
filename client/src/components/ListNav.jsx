// Libraries
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Contexts
import ListsContext from '../contexts/Lists.context';

/**
 * 
 * @returns 
 */
const ListNav = ({ currentList, selectList }) => {
  const { lists } = useContext(ListsContext);
  const availableLists = lists.filter((list) => list.name !== currentList.name);

  return (
    <>
      {
        availableLists.map((list) => <button key={uuidv4()} onClick={selectList}>{list.name}</button>)
      }
    </>
  );
};

export default ListNav;