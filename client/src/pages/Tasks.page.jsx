import axios from "axios";
import {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import ListsReducer from "../reducers/Lists.reducer";
import ListItem from "../components/ListItem";
import UserContext from "../contexts/User.context";

function TasksPage() {
  const user = useContext(UserContext);
  const [lists, dispatchForLists] = useReducer(ListsReducer, null);
  const [isPending, setIsPending] = useState(true);
  const [currentList, setCurrentList] = useState({});
  const [entry, setEntry] = useState('');
  
  useEffect(() => {
    const abortController = new AbortController();

    axios('/api/v1/lists/', { signal: abortController.signal })
    .then((response) => {
      if (response.statusText === 'OK') {
        dispatchForLists({ type: 'SET_LISTS', payload: response.data });
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

  function addNewList() {
    axios(`/api/v1/lists/`, { name: entry, items: [], owner_id: user._id })
    .then((response) => {
      // toast pop-up
      setEntry('');
    })
    .catch((error) => {
      // toast pop-up
    });
  }
  
  function addListItem() {
    axios.patch(
      `/api/v1/lists/${currentList._id}`,
      { items: [
        ...currentList.items,
        { id: `${currentList.name}-${currentList.items.length + 1}`, description: entry }
      ]}
    )
    .then((response) => {
      // toast pop-up
      axios('/api/v1/lists/')
      .then((response) => setCurrentList(response.data[0]))
      .catch((error) => console.error(error));
      setEntry('');
    })
    .catch((error) => {
      // toast pop-up
    });
  }
  
  return (
    <>
      <div className="App">
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
            !isPending && lists && currentList.items &&
            currentList.items.map((item) => {
              return <ListItem key={item.id} id={currentList._id} description={item.description}></ListItem>
            })
          }
      </div>
      { !isPending &&
        <div>
          <label>{(lists) ? 'Item Description': 'List Name'}</label>
          <input type="text" value={entry} onChange={(event) => setEntry(event.target.value)}/>
          <button onClick={(lists) ? addListItem : addNewList }>Add { (lists) ? 'Item' : 'List' }</button>
        </div>
      }
    </>
  );
}

export default TasksPage;
