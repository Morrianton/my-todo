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
  const { user } = useContext(AuthContext);
  const [lists, dispatchLists] = useReducer(ListsReducer, []);
  const [isPending, setIsPending] = useState(true);
  const [currentList, setCurrentList] = useState({});
  const [entry, setEntry] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  
  useEffect(() => {
    const abortController = new AbortController();

    if (user) {
      axios('/api/v1/lists/', {
        headers: { Authorization: `Bearer ${user.token}` },
        signal: abortController.signal,
      })
      .then((response) => {
        if (response.statusText === 'OK') {
          dispatchLists({ payload: response.data, type: 'SET_LISTS' });
          setCurrentList(response.data[0]);
          setIsLoggedIn(true);
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error(error)
        }
      })
      .finally(() => setIsPending(false));
  
      return () => abortController.abort();
    } else {
      setIsPending(false);
    }
  }, [user]);

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

    axios(
      `/api/v1/lists/`,
      listDetails,
      { headers: { Authorization: `Bearer ${user.token}` } }
    )
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
        !isPending && isLoggedIn && !lists &&
        <p>No lists yet.</p>
      }
      {
        !isPending && isLoggedIn && lists && !currentList.items &&
        <p>No list items yet.</p>
      }
      {
        !isPending && isLoggedIn && lists && currentList.items && (
          <>
            <ListNav
              currentList={currentList}
              selectList={selectList}
            />
            <ListView currentList={currentList} />
          </>
        )
      }
      { !isPending && isLoggedIn && (
        <>
          <input type="text" value={entry} onChange={(event) => setEntry(event.target.value)}/>
          <button onClick={ addNewList }>Add List</button>
        </>
      )}
      { !isPending && !isLoggedIn && <p>Log in or sign up to get started!</p>}
    </ListsContext.Provider>
  );
};

export default TasksPage;
