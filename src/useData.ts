import axios from "axios";
import { useState } from "react";
import {
  validateConnectionData,
  validateDiograph,
  validateRoomConfigData,
} from "@diograph/diograph/validator";
import {
  RoomConfigData,
  ConnectionData,
  IDiographObject,
} from "@diograph/diograph/types";

const baseUrl = "http://localhost:3000";

// custom type, doesn't have validator...
interface CustomRoomObject {
  id: string;
  address: string;
  clientType: string;
  connections: ConnectionData[];
  diograph?: IDiographObject;
}

// custom type
interface RoomConfigDataStore {
  [index: string]: CustomRoomObject | null;
}

const useData = () => {
  const [rooms, setRooms] = useState<RoomConfigDataStore>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<RoomConfigData[]>(`${baseUrl}/rooms`);

      // Validate data from http API
      response.data.forEach((roomApiData) => {
        validateRoomConfigData(roomApiData);
      });

      // Create empty/null objects with room ids
      const roomConfigDataWithIdsObject: RoomConfigDataStore = {};
      response.data.forEach((roomConfigData) => {
        if (!roomConfigData.id)
          throw new Error("RoomConfigData.id is undefined");
        roomConfigDataWithIdsObject[roomConfigData.id] = null;
      });

      setRooms(roomConfigDataWithIdsObject);
    } catch (error) {
      setError("Error fetching data: " + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomData = async (roomId: string) => {
    setLoading(true);
    try {
      const response = await axios.get<CustomRoomObject>(
        `${baseUrl}/rooms/${roomId}`
      );
      // => onko tässä id mukana?

      response.data.connections.forEach((connectionData: ConnectionData) => {
        validateConnectionData(connectionData);
      });

      const diographResponse = await axios.get<IDiographObject>(
        `${baseUrl}/rooms/${roomId}/diograph`
      );
      validateDiograph(diographResponse.data);

      response.data.diograph = diographResponse.data;

      rooms[roomId] = response.data;
      setRooms(rooms);
    } catch (error) {
      setError("Error fetching more data: " + error);
    } finally {
      setLoading(false);
    }
  };

  return { rooms, loading, error, fetchRoomsData, fetchRoomData };
};

export { useData, baseUrl };
