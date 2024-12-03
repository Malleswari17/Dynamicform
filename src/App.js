import React, { useState, useEffect } from 'react';

// Mock API response based on the dropdown selection
// This function simulates backend responses
const mockApiResponse = (type) => {
  switch (type) {
    case 'User Information':
      return {
        fields: [
          { name: 'firstName', type: 'text', label: 'First Name', required: true },
          { name: 'lastName', type: 'text', label: 'Last Name', required: true },
          { name: 'age', type: 'number', label: 'Age', required: false },
        ],
      };
    case 'Address Information':
      return {
        fields: [
          { name: 'street', type: 'text', label: 'Street', required: true },
          { name: 'city', type: 'text', label: 'City', required: true },
          { name: 'state', type: 'dropdown', label: 'State', options: ['Andhra Pradesh', 'Telangana', 'Karnataka'], required: true },
          { name: 'zipCode', type: 'text', label: 'Zip Code', required: false },
        ],
      };
    case 'Payment Information':
      return {
        fields: [
          { name: 'cardNumber', type: 'text', label: 'Card Number', required: true },
          { name: 'expiryDate', type: 'date', label: 'Expiry Date', required: true },
          { name: 'cvv', type: 'password', label: 'CVV', required: true },
          { name: 'cardholderName', type: 'text', label: 'Cardholder Name', required: true },
        ],
      };
    default:
      return { fields: [] };
  }
};

const DynamicForm = () => {
  // State to store selected form type
  const [formType, setFormType] = useState('');
  
  // State to store the structure of the form fields
  const [formStructure, setFormStructure] = useState([]);
  
  // State to track the user's input values
  const [formData, setFormData] = useState({});
  
  // State to hold submitted form data
  const [submittedData, setSubmittedData] = useState([]);
  
  // State to manage form completion progress
  const [progress, setProgress] = useState(0);
  
  // State to store validation errors
  const [error, setError] = useState({});

  // Fetch form structure whenever the form type changes
  useEffect(() => {
    if (formType) {
      const apiResponse = mockApiResponse(formType); // Simulates API call
      setFormStructure(apiResponse.fields); // Set form fields dynamically
      setFormData({}); // Reset form data
      setError({}); // Clear validation errors
    }
  }, [formType]);

  // Handle changes to input fields
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value })); // Update form data
    setError((prev) => ({ ...prev, [field]: null })); // Clear error for the field
  };

  // Validate the form based on required fields
  const validateForm = () => {
    let isValid = true;
    let errors = {};
    
    // Check if all required fields are filled
    formStructure.forEach((field) => {
      if (field.required && !formData[field.name]) {
        isValid = false;
        errors[field.name] = `${field.label} is required.`; // Error message
      }
    });
    setError(errors); // Set validation errors
    return isValid; // Return form validity
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (validateForm()) {
      setSubmittedData((prev) => [...prev, formData]); // Store submitted data
      setFormData({}); // Reset form data
      alert('Form submitted successfully!'); // Success feedback
    }
  };

  // Handle deletion of submitted data
  const handleDelete = (index) => {
    const updatedData = [...submittedData];
    updatedData.splice(index, 1); // Remove the selected entry
    setSubmittedData(updatedData); // Update state
    alert('Entry deleted successfully!'); // Feedback message
  };

  // Calculate progress percentage based on filled required fields
  const calculateProgress = () => {
    const totalFields = formStructure.length; // Total fields in the form
    const filledFields = Object.keys(formData).filter((key) => formData[key]).length; // Filled fields
    return totalFields ? Math.round((filledFields / totalFields) * 100) : 0; // Progress %
  };

  // Update progress whenever form data changes
  useEffect(() => {
    setProgress(calculateProgress());
  }, [formData, formStructure]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Dynamic Form</h1>
      
      {/* Dropdown to select the form type */}
      <div>
        <label>Select Form Type:</label>
        <select onChange={(e) => setFormType(e.target.value)} value={formType}>
          <option value="">-- Select --</option>
          <option value="User Information">User Information</option>
          <option value="Address Information">Address Information</option>
          <option value="Payment Information">Payment Information</option>
        </select>
      </div>
      
      {/* Render the form fields dynamically */}
      {formType && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <h2>{formType}</h2>
          {formStructure.map((field) => (
            <div key={field.name} style={{ marginBottom: '10px' }}>
              <label>
                {field.label}
                {field.required && ' *'} {/* Display '*' for required fields */}
              </label>
              {field.type === 'dropdown' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              )}
              {error[field.name] && <p style={{ color: 'red' }}>{error[field.name]}</p>} {/* Error message */}
            </div>
          ))}
          <div style={{ marginTop: '10px' }}>
            <button type="submit">Submit</button>
          </div>
        </form>
      )}

      {/* Progress bar to indicate form completion */}
      <div style={{ marginTop: '20px' }}>
        <h3>Progress</h3>
        <div style={{ background: '#ccc', height: '10px', borderRadius: '5px' }}>
          <div
            style={{
              background: 'green',
              width: `${progress}%`,
              height: '100%',
              borderRadius: '5px',
            }}
          ></div>
        </div>
      </div>

      {/* Table to display submitted form data */}
      <div style={{ marginTop: '20px' }}>
        <h3>Submitted Data</h3>
        {submittedData.length > 0 ? (
          <table border="1" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                {Object.keys(submittedData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                  <td>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default DynamicForm;
