import { useUsers } from "./data/resources";

export function App() {
  const {
    isLoading,
    isUninitialized,
    isUpdating,
    error,
    data,
    // mutations,
    refetch,
  } = useUsers();

  return (
    <>
    <div>{JSON.stringify({
      isLoading, isUninitialized, isUpdating, error, data
    })}</div>
    <button onClick={(e) => refetch()}>Fetch</button>
    {/* <button onClick={(e) => mutations.create()}>Fetch</button> */}
    </>
    
  );
}

export default App;
