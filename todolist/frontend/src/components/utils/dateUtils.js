function getDueDateClass(dueDate) {
    if (!dueDate) return { className: '', text: 'No date' };
    
    try {
        const today = new Date();
        const targetDate = new Date(dueDate);
        
        // Check if date is valid
        if (isNaN(targetDate.getTime())) {
            return { className: '', text: 'Invalid date' };
        }

        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { className: 'expired', text: 'Expired' };
        } else if (diffDays >= 0 && diffDays <= 1) {
            return { className: 'due-soon', text: 'Today' };
        } else if (diffDays > 1 && diffDays <= 7) {
            return { className: 'due-upcoming', text: `${diffDays} days left` };
        } else {
            return { className: 'due-later', text: '' };
        }
    } catch (error) {
        console.error('Error processing date:', error);
        return { className: '', text: 'Invalid date' };
    }
}

export default getDueDateClass;
