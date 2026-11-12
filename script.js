// HTML contains the notes; JavaScript adds cross-medium filtering.
const noteList = document.querySelector("#notes-list");

if (noteList) {
    const notes = Array.from(noteList.querySelectorAll(".field-note"));
    const lensFilter = document.querySelector("#lens-filter");
    const mediumFilter = document.querySelector("#medium-filter");
    const search = document.querySelector("#note-search");
    const count = document.querySelector("#note-count");
    const empty = document.querySelector("#empty-notes");
    const searchable = new Map(notes.map(note => [note, note.textContent.toLowerCase()]));

    function filterNotes() {
        const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
        let visible = 0;
        notes.forEach(note => {
            const lenses = JSON.parse(note.dataset.lenses);
            const media = JSON.parse(note.dataset.media);
            const matchesLens = !lensFilter.value || lenses.includes(lensFilter.value);
            const matchesMedium = !mediumFilter.value || media.includes(mediumFilter.value);
            const matchesSearch = words.every(word => searchable.get(note).includes(word));
            note.hidden = !(matchesLens && matchesMedium && matchesSearch);
            if (!note.hidden) visible += 1;
        });
        count.textContent = `${visible} of ${notes.length} notes`;
        empty.hidden = visible !== 0;
    }

    function resetFilters() {
        lensFilter.value = "";
        mediumFilter.value = "";
        search.value = "";
        filterNotes();
    }

    function openLinkedNote() {
        let slug;
        try {
            slug = decodeURIComponent(window.location.hash.slice(1));
        } catch {
            return;
        }
        const note = notes.find(item => item.id === slug);
        if (!note) return;
        if (note.hidden) resetFilters();
        note.querySelector("details").open = true;
        requestAnimationFrame(() => note.scrollIntoView({ block: "start" }));
    }

    lensFilter.addEventListener("change", filterNotes);
    mediumFilter.addEventListener("change", filterNotes);
    search.addEventListener("input", filterNotes);
    document.querySelector("#reset-filters").addEventListener("click", resetFilters);
    window.addEventListener("hashchange", openLinkedNote);
    noteList.addEventListener("click", event => {
        const link = event.target.closest(".note-permalink");
        if (link) link.closest(".field-note").querySelector("details").open = true;
    });
    document.querySelector("#note-filters").hidden = false;
    filterNotes();
    openLinkedNote();
}
