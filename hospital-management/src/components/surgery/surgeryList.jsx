import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import AuthContext from '../../AuthContext';




const SurgeryList = ({ doctorID }) => {
  const {getMinDateTime, fetchSurgeries, surgeries, setSurgeries, backend_url, errorMessage, setErrorMessage} = useContext(AuthContext);
  const [schedulingData, setSchedulingData] = useState({ appointmentID: '', patientID: '', time: '', cost: '' });
  const [showModal, setShowModal] = useState(false);

  // Fetch surgeries for the doctor
  const should_fetch_doctor_surgeries = useRef(true);
  useEffect(() => {
    if(should_fetch_doctor_surgeries.current) {
      fetchSurgeries(doctorID);
      should_fetch_doctor_surgeries.current = false;
    }
  }, [doctorID]);

  // Delete a surgery
  const handleDelete = async (surgeryID) => {
    try {
      await axios.delete(`${backend_url}/surgeries/${surgeryID}/doctor/${doctorID}`);
      setSurgeries((prevSurgeries) => prevSurgeries.filter((surgery) => surgery.surgeryID !== surgeryID));
    } catch (error) {
      setErrorMessage('Failed to delete surgery.');
    }
  };

  // Handle schedule button click
  const handleScheduleClick = (surgeryID, patientID) => {
    setSchedulingData({ ...schedulingData, appointmentID: surgeryID, patientID });
    setShowModal(true);
  };

  // Handle input changes for scheduling
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSchedulingData({ ...schedulingData, [name]: value });
  };

  const handleScheduleSubmit = async (event) => {
    event.preventDefault();

    const { appointmentID, time, cost, patientID } = schedulingData;

    // Format the time to the appropriate Date object if it's a string
    const newTime = new Date(time);

    // Assuming you need to send the cost as part of the request body
    const surgeryRequest = {
        time: newTime, // Adjust this to match the expected DTO structure if necessary
        cost: cost, // Include the cost if needed in your DTO (update accordingly)
        patientID: patientID // Include patientID if it's part of the request
    };

    try {
        const response = await axios.put(
            `${backend_url}/surgeries/${appointmentID}/doctor/${doctorID}`,
            surgeryRequest, // Send the request body as the surgeryRequest object
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        alert('Surgery rescheduled successfully!'); // Show success message
        setShowModal(false);
        // Refresh the surgeries after rescheduling
        fetchSurgeries(doctorID);
    } catch (error) {
        console.error('Error rescheduling surgery:', error);
        alert('Error rescheduling surgery');
    }
};  


  return (
    <div>
      <h2>Surgeries for Doctor ID: {doctorID}</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {surgeries.length === 0 ? (
        <div className="appointments">
          <div className="appointment_cards">
            <p>No surgeries found.</p>
          </div>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Surgery ID</th>
              <th>Patient ID</th>
              <th>Type</th>
              <th>Critical Level</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {surgeries.map((surgery) => (
              <tr key={surgery.surgeryID}>
                <td>{surgery.surgeryID}</td>
                <td>{surgery.patientID}</td>
                <td>{surgery.type}</td>
                <td>{surgery.criticalLevel}</td>
                <td>{new Date(surgery.time).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(surgery.surgeryID)} className='login_button button_red'>Delete</button>
                  <button onClick={() => handleScheduleClick(surgery.surgeryID, surgery.patientID)} className='login_button'>Reschedule</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="login_div">
          <h3>Reschedule Surgery</h3>
          <div className="login_div">
          <form className='login_form' onSubmit={handleScheduleSubmit}>
            <div className="login_div">
            <label className='login_label'>
              New Time:
            </label>
              <input className='login_input'
                type="datetime-local"
                name="time"
                value={schedulingData.time}
                onChange={handleInputChange}
                min={getMinDateTime()}
                required
              />
            </div>
            <div className="login_div_horizontal">
              <button type="submit" className='login_button'>Submit</button>
              <button type="button" onClick={() => setShowModal(false)} className='login_button button_red'>Cancel</button>
            </div>
          </form>
          </div>
        </div>
      )}
    </div>
  );
};

SurgeryList.propTypes = {
  doctorID: PropTypes.number.isRequired,
};

export default SurgeryList;
