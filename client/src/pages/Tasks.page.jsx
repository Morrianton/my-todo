import axios from "axios";
import {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

// Contexts
// Reducers
import ListsReducer from "../reducers/Lists.reducer";
// Components
import ListView from "../components/ListView";
import ListNav from "../components/ui/ListNav";

/**
 * 
 * @returns 
 */
const TasksPage = () => {
  const user = useContext(AuthContext);
  const [lists, dispatchLists] = useReducer(ListsReducer, []);
  const [isPending, setIsPending] = useState(true);
  const [currentList, setCurrentList] = useState({});
  const [entry, setEntry] = useState('');
  
  useEffect(() => {
    const abortController = new AbortController();

    axios('/api/v1/lists/', { signal: abortController.signal })
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchLists({ payload: response.data, type: 'SET_LISTS' });
        setCurrentList(response.data[0]);
      }
      setIsPending(false);
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        setIsPending(false);
        console.error(error)
      }
    });

    return () => abortController.abort();
  }, []);

  const addNewList = () => {
    const listDetails = { name: entry, items: [], owner_id: user._id };

    axios(`/api/v1/lists/`, listDetails)
    .then((response) => {
      // toast pop-up
      if (response.statusText === 'OK') {
        dispatchLists({ type: 'CREATE_LIST', payload: listDetails });
        setCurrentList(listDetails);
        setEntry('');
      }
    })
    .catch((error) => {
      // toast pop-up
      console.error(error.message);
    });
  };

  /**
   * 
   */
  const selectList = (event) => {
    setCurrentList(lists.find((list) => list.name === event.target.innerText));
  };
  
  return (
    <>
      { isPending && <p>Loading...</p> }
      {
        !isPending && !lists &&
        <p>No lists yet.</p>
      }
      {
        !isPending && lists && !currentList.items &&
        <p>No list items yet.</p>
      }
      {
        !isPending && lists && currentList.items && (
          <>
            <ListNav
              currentList={currentList}
              lists={lists}
              selectList={selectList}
            />
            <ListView currentList={currentList} />
          </>
        )
      }
      { !isPending &&
        <div>
          <input type="text" value={entry} onChange={(event) => setEntry(event.target.value)}/>
          <button onClick={ addNewList }>Add List</button>
        </div>
      }
    </>
  );
};

export default TasksPage;
