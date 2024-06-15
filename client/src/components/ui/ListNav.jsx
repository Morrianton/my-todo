import { v4 as uuidv4 } from 'uuid';

/**
 * 
 * @returns 
 */
const ListNav = ({ currentList, lists, selectList }) => {
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