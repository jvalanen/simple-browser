import React, { useState, useEffect } from "react";
// import axios from "axios";
import data from "./data.json";
import dataDiograph from "./data-diograph.json";

const getData = () => {
  data.rooms[0].diograph = dataDiograph;
  return data;
};

interface Data {
  // Define your data structure here
}

const App: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get<Data>("https://api.example.com/data");
        const response = { data: getData() };
        setData(response.data);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Render your data here */}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default App;
