// Libraries
import axios from "axios";
import {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

// Contexts
import AuthContext from "../contexts/Auth.context";
import ListsContext from "../contexts/Lists.context";

// Reducers
import ListsReducer from "../reducers/Lists.reducer";

// Components
import ListView from "../components/ListView";
import ListNav from "../components/ListNav";

/**
 * Tasks page component.
 * 
 * @component
 * @returns {JSX.Element} The rendered tasks page component.
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

  useEffect(() => {
    if (currentList.name) {
      setCurrentList(lists.find((list) => list.name === currentList.name));
    }
  }, [lists]);

  /**
   * Adds a new list to the database and updates the lists state.
   */
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
   * Selects the list to be viewed.
   * @param {Event} event The event object used to target the inner text of the button it is attached to.
   */
  const selectList = (event) => {
    setCurrentList(lists.find((list) => list.name === event.target.innerText));
  };
  
  return (
    <ListsContext.Provider value={{ lists, dispatchLists }}>
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
    </ListsContext.Provider>
  );
};

export default TasksPage;
