function ListItem({ id, description }) {

  function deleteListItem() {
    axios.delete(`/api/v1/lists/${id}`)
    .then((response) => {
      if (response.statusText === 'OK') {
        axios('/api/v1/lists')
        .then()
        .catch((error) => console.error(error))
      }})
    .catch((error) => console.error(error));
  }
  
  return (
    <>
      <p>{description}</p>
      <button>Edit</button>
      <button onClick={deleteListItem}>Delete</button>
    </>
  );
}

export default ListItem;
