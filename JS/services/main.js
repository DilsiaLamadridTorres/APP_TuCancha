import { CanchaService, ReservaService } from './api.js';

// Load all active fields on page load
async function loadFields() {
    try {
        const canchas = await CanchaService.getByEstado('ACTIVA');
        console.log('Available Fields:', canchas);
        // Render UI cards dynamically here
    } catch (error) {
        alert('Could not fetch fields from backend.');
    }
}

// Make a field reservation
async function makeBooking(userId, horarioId) {
    try {
        const response = await ReservaService.create({
            usuarioId: userId,
            horarioId: horarioId
        });
        alert('Reservation created successfully!');
    } catch (error) {
        alert('Failed to book: ' + error.message);
    }
}