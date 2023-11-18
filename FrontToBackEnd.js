document.getElementById('generateButton').addEventListener('click', function() {
    const notes = document.getElementById('notesInput').value;
    fetch('/generate_midi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: notes })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerText = 'MIDI file generated! Download link: ' + data.fileUrl;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'Error generating MIDI.';
    });
});


