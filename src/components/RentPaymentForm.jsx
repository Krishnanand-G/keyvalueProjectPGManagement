import { useState } from 'react';
import './RentPaymentForm.css';

function RentPaymentForm() {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Payment submitted for ${selectedMonth}`);
    };

    return (
        <div className="rent-payment-form card">
            <h3>Pay Rent</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="month">Select Month</label>
                    <select
                        id="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        required
                    >
                        <option value="">Choose a month...</option>
                        {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="receipt">Upload Receipt</label>
                    <input
                        type="file"
                        id="receipt"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                    />
                    {selectedFile && (
                        <p className="file-name">Selected: {selectedFile.name}</p>
                    )}
                </div>

                <button type="submit" className="btn-primary submit-btn">
                    Submit Payment
                </button>
            </form>
        </div>
    );
}

export default RentPaymentForm;
