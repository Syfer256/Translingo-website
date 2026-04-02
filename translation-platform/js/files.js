// File Management System
const Files = {
    // Upload file (simulated)
    upload(fileData) {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser) {
            return { success: false, error: 'Must be logged in to upload files' };
        }

        // Validate file
        if (!fileData.file) {
            return { success: false, error: 'No file provided' };
        }

        const file = fileData.file;

        // Check file size
        if (file.size > CONFIG.FILE_UPLOAD.MAX_SIZE) {
            return {
                success: false,
                error: `File size exceeds maximum of ${UI.formatFileSize(CONFIG.FILE_UPLOAD.MAX_SIZE)}`
            };
        }

        // Check file type
        if (!CONFIG.FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
            return {
                success: false,
                error: 'File type not allowed. Allowed types: PDF, DOC, DOCX, TXT, ODT'
            };
        }

        // Create file record
        const fileRecord = {
            id: Utils.generateId(),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedBy: currentUser.id,
            uploadedByName: `${currentUser.firstName} ${currentUser.lastName}`,
            jobId: fileData.jobId || null,
            category: fileData.category || 'document', // 'document', 'translation', 'revision'
            version: fileData.version || 1,
            uploadedAt: new Date().toISOString(),
            // In a real app, this would be a URL to the file storage
            url: `#file-${Utils.generateId()}`
        };

        Storage.add(Storage.KEYS.FILES, fileRecord);

        return { success: true, file: fileRecord };
    },

    // Get files by job
    getByJob(jobId) {
        const files = Storage.findBy(Storage.KEYS.FILES, { jobId });
        files.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        return files;
    },

    // Get files by category
    getByCategory(jobId, category) {
        const files = this.getByJob(jobId);
        return files.filter(f => f.category === category);
    },

    // Get file by ID
    getById(fileId) {
        return Storage.findById(Storage.KEYS.FILES, fileId);
    },

    // Delete file
    delete(fileId) {
        const file = Storage.findById(Storage.KEYS.FILES, fileId);

        if (!file) {
            return { success: false, error: 'File not found' };
        }

        const currentUser = Auth.getCurrentUser();
        if (!currentUser || (file.uploadedBy !== currentUser.id && currentUser.role !== CONFIG.USER_ROLES.ADMIN)) {
            return { success: false, error: 'Unauthorized' };
        }

        Storage.delete(Storage.KEYS.FILES, fileId);

        return { success: true };
    },

    // Download file (simulated)
    download(fileId) {
        const file = this.getById(fileId);

        if (!file) {
            return { success: false, error: 'File not found' };
        }

        // In a real app, this would trigger actual file download
        console.log('Downloading file:', file.name);
        UI.showToast(`Downloading ${file.name}...`, 'info');

        return { success: true, file };
    },

    // Validate file on client side
    validateFile(file) {
        const errors = [];

        if (file.size > CONFIG.FILE_UPLOAD.MAX_SIZE) {
            errors.push(`File size exceeds maximum of ${UI.formatFileSize(CONFIG.FILE_UPLOAD.MAX_SIZE)}`);
        }

        if (!CONFIG.FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
            errors.push('File type not allowed. Allowed types: PDF, DOC, DOCX, TXT, ODT');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Files;
}
