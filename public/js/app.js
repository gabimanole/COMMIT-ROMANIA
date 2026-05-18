class EventTemplateApp {
    constructor() {
        this.currentResult = null;
        this.init();
    }

    init() {
        this.loadDefaultConfig();
        this.bindEvents();
        this.setDefaultValues();
    }

    bindEvents() {
        // Form submission
        document.getElementById('eventForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processTemplate();
        });

        // Agenda management
        document.getElementById('addAgendaItem').addEventListener('click', () => {
            this.addAgendaItem();
        });

        // Config management
        document.getElementById('loadConfigBtn').addEventListener('click', () => {
            this.loadConfig();
        });

        document.getElementById('saveConfigBtn').addEventListener('click', () => {
            this.saveConfig();
        });

        // Result actions
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadResult();
        });

        document.getElementById('previewBtn').addEventListener('click', () => {
            this.previewResult();
        });
    }

    setDefaultValues() {
        // Set current date and time
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
        
        document.getElementById('eventDate').value = dateStr;
        document.getElementById('eventTime').value = timeStr;
    }

    async loadDefaultConfig() {
        try {
            const response = await fetch('/config');
            const config = await response.json();
            
            // Populate form with default values
            document.getElementById('chapter').value = config.chapter || 'Iasi';
            document.getElementById('eventTitle').value = config.event?.title || '';
            document.getElementById('locationName').value = config.event?.location?.name || '';
            document.getElementById('locationAddress').value = config.event?.location?.address || '';
            document.getElementById('registrationUrl').value = config.event?.registration?.href || '';
            document.getElementById('registrationText').value = config.event?.registration?.text || '';
            document.getElementById('speakerName').value = config.speaker?.name || '';
            document.getElementById('speakerDescription').value = config.speaker?.description || '';
            document.getElementById('eventSummary').value = config.summary || '';

            // Populate agenda items
            if (config.agenda && config.agenda.length > 0) {
                const agendaContainer = document.getElementById('agendaItems');
                agendaContainer.innerHTML = '';
                config.agenda.forEach((item, index) => {
                    this.addAgendaItem(item);
                });
            }
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }

    async processTemplate() {
        const formData = this.collectFormData();
        
        // Validate event title format
        if (!this.validateEventTitle(formData.eventTitle)) {
            alert('Invalid event title format. Please use: #[number] [title]');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch('/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventData: formData,
                    templateType: 'default'
                })
            });

            const result = await response.json();

            if (result.success) {
                this.currentResult = result.result;
                this.showResult();
            } else {
                throw new Error(result.error || 'Processing failed');
            }
        } catch (error) {
            console.error('Processing error:', error);
            alert('Error processing template: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    collectFormData() {
        const agendaItems = [];
        document.querySelectorAll('.agenda-text').forEach(textarea => {
            if (textarea.value.trim()) {
                agendaItems.push(textarea.value.trim());
            }
        });

        return {
            chapter: document.getElementById('chapter').value,
            event: {
                title: document.getElementById('eventTitle').value,
                date: this.formatDate(document.getElementById('eventDate').value),
                time: document.getElementById('eventTime').value,
                location: {
                    name: document.getElementById('locationName').value,
                    address: document.getElementById('locationAddress').value
                },
                registration: {
                    href: document.getElementById('registrationUrl').value,
                    text: document.getElementById('registrationText').value
                }
            },
            speaker: {
                name: document.getElementById('speakerName').value,
                description: document.getElementById('speakerDescription').value
            },
            agenda: agendaItems,
            summary: document.getElementById('eventSummary').value
        };
    }

    validateEventTitle(title) {
        // Check format: #[number] [title]
        const pattern = /^#\d+\s+.+$/;
        return pattern.test(title);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    addAgendaItem(defaultText = '') {
        const container = document.getElementById('agendaItems');
        const div = document.createElement('div');
        div.className = 'agenda-item mb-2';
        
        div.innerHTML = `
            <textarea class="form-control agenda-text" rows="3" placeholder="Agenda item">${defaultText}</textarea>
            <button type="button" class="btn btn-sm btn-outline-danger mt-1 remove-agenda">
                <i class="fas fa-trash"></i> Remove
            </button>
        `;

        // Add remove functionality
        div.querySelector('.remove-agenda').addEventListener('click', () => {
            div.remove();
        });

        container.appendChild(div);
    }

    showLoading() {
        document.getElementById('loadingCard').style.display = 'block';
        document.getElementById('resultCard').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loadingCard').style.display = 'none';
    }

    showResult() {
        document.getElementById('resultCard').style.display = 'block';
    }

    downloadResult() {
        if (!this.currentResult) return;

        const link = document.createElement('a');
        link.href = `/download/${this.currentResult.filename}`;
        link.download = this.currentResult.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    previewResult() {
        if (!this.currentResult) return;

        const modal = new bootstrap.Modal(document.getElementById('previewModal'));
        const iframe = document.getElementById('previewFrame');
        
        // Create a blob URL for the content
        const blob = new Blob([this.currentResult.content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        iframe.src = url;
        modal.show();

        // Clean up URL when modal is hidden
        document.getElementById('previewModal').addEventListener('hidden.bs.modal', () => {
            URL.revokeObjectURL(url);
        });
    }

    async loadConfig() {
        try {
            const response = await fetch('/config');
            const config = await response.json();
            document.getElementById('configText').value = JSON.stringify(config, null, 2);
        } catch (error) {
            console.error('Error loading config:', error);
            alert('Error loading configuration');
        }
    }

    async saveConfig() {
        try {
            const configText = document.getElementById('configText').value;
            const config = JSON.parse(configText);

            const response = await fetch('/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Configuration saved successfully!');
            } else {
                throw new Error(result.error || 'Failed to save configuration');
            }
        } catch (error) {
            console.error('Error saving config:', error);
            alert('Error saving configuration: ' + error.message);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EventTemplateApp();
});
