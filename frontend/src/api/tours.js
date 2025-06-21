import axios from "axios";

export const updateTour = (id, updatedData) => {
  return axios.put(`/api/tours/${id}`, updatedData);
};
