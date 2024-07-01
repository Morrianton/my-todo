// Libraries
import { useContext } from 'react';

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
        availableLists.map((list) => <button key={list._id} onClick={selectList}>{list.name}</button>)
      }
    </>
  );
};

export default ListNav;