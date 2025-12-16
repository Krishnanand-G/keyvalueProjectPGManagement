import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import './AlertsSection.css';

function AlertsSection({ alerts }) {
    const getAlertIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle size={18} />;
            case 'success': return <CheckCircle size={18} />;
            case 'info': return <Info size={18} />;
            default: return <Info size={18} />;
        }
    };

    return (
        <div className="alerts-section">
            <h3>Alerts</h3>
            <div className="alerts-list">
                {alerts.map(alert => (
                    <div key={alert.id} className={`alert-card alert-${alert.type}`}>
                        <span className="alert-icon">{getAlertIcon(alert.type)}</span>
                        <div className="alert-content">
                            <p className="alert-message">{alert.message}</p>
                            <p className="alert-date">{new Date(alert.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AlertsSection;
