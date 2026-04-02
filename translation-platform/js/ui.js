// UI Management and Helper Functions
const UI = {
    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Show modal
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    // Hide modal
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    // Show loading state
    showLoading(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.classList.add('loading');
            element.disabled = true;
        }
    },

    // Hide loading state
    hideLoading(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.classList.remove('loading');
            element.disabled = false;
        }
    },

    // Validate form
    validateForm(formElement) {
        const inputs = formElement.querySelectorAll('[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        return isValid;
    },

    // Show field error
    showFieldError(input, message) {
        input.classList.add('error');

        let errorElement = input.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            input.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
    },

    // Clear field error
    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    },

    // Confirm dialog
    confirm(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <div class="confirm-message">${Utils.escapeHTML(message)}</div>
            <div class="confirm-actions">
                <button class="btn btn-secondary" data-action="cancel">Cancel</button>
                <button class="btn btn-primary" data-action="confirm">Confirm</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const handleClick = (e) => {
            const action = e.target.dataset.action;
            if (action === 'confirm') {
                if (onConfirm) onConfirm();
            } else if (action === 'cancel') {
                if (onCancel) onCancel();
            }
            overlay.remove();
        };

        dialog.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', handleClick);
        });
    },

    // Update notification badge
    updateNotificationBadge(count) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    },

    // Render star rating
    renderStars(rating, maxStars = 5) {
        let html = '<div class="stars">';
        for (let i = 1; i <= maxStars; i++) {
            if (i <= rating) {
                html += '<span class="star filled">★</span>';
            } else if (i - 0.5 <= rating) {
                html += '<span class="star half">★</span>';
            } else {
                html += '<span class="star">☆</span>';
            }
        }
        html += '</div>';
        return html;
    },

    // Create pagination
    createPagination(currentPage, totalPages, onPageChange) {
        const container = document.createElement('div');
        container.className = 'pagination';

        // Previous button
        const prev = document.createElement('button');
        prev.className = 'pagination-btn';
        prev.textContent = '‹';
        prev.disabled = currentPage === 1;
        prev.addEventListener('click', () => onPageChange(currentPage - 1));
        container.appendChild(prev);

        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => onPageChange(i));
            container.appendChild(pageBtn);
        }

        // Next button
        const next = document.createElement('button');
        next.className = 'pagination-btn';
        next.textContent = '›';
        next.disabled = currentPage === totalPages;
        next.addEventListener('click', () => onPageChange(currentPage + 1));
        container.appendChild(next);

        return container;
    },

    // Empty state message
    showEmptyState(container, message, iconClass = 'icon-empty') {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }

        container.innerHTML = `
            <div class="empty-state">
                <div class="${iconClass}"></div>
                <p>${Utils.escapeHTML(message)}</p>
            </div>
        `;
    },

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
