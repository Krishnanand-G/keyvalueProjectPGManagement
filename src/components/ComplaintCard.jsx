import './ComplaintCard.css';

function ComplaintCard({ complaint, onClick, isLandlord }) {
    const statusColors = {
        open: 'status-open',
        in_progress: 'status-progress',
        resolved: 'status-resolved',
    };

    const statusLabels = {
        open: 'Open',
        in_progress: 'In Progress',
        resolved: 'Resolved',
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="complaint-card" onClick={onClick}>
            <div className="complaint-header">
                <span className={`status-badge ${statusColors[complaint.status]}`}>
                    {statusLabels[complaint.status]}
                </span>
                <span className="complaint-date">{formatDate(complaint.createdAt)}</span>
            </div>

            <h3 className="complaint-title">{complaint.title}</h3>
            <p className="complaint-description">
                {complaint.description.length > 100
                    ? complaint.description.substring(0, 100) + '...'
                    : complaint.description}
            </p>

            {complaint.landlordRemark && (
                <div className="landlord-remark-preview">
                    <strong>Landlord:</strong> {complaint.landlordRemark.substring(0, 50)}
                    {complaint.landlordRemark.length > 50 && '...'}
                </div>
            )}

            <div className="complaint-footer">
                <span className="click-hint">Click to view details</span>
            </div>
        </div>
    );
}

export default ComplaintCard;
