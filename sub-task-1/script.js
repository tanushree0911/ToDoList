let allTodos = [];
let activeSearchTerm = "";
let activeDateRange = { start: null, end: null };

async function fetchTodos() {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=20');
    const data = await res.json();

    const start = new Date('2025-01-01').getTime();
    const end = new Date('2025-07-01').getTime();

    allTodos = data.map(todo => {
        const randomTimestamp = Math.floor(Math.random() * (end - start + 1) + start);
        return {
            ...todo,
            selected: false,
            createdDate: new Date(randomTimestamp)
        };
    });

    renderTable();
}

function openDrawer(index) {
    const todo = allTodos[index];
    
    document.getElementById('edit-index').value = index;
    // document.getElementById('edit-id').value = todo.id;
    document.getElementById('edit-title').value = todo.title;
    // document.getElementById('edit-status').value = todo.completed.toString();

    // Show drawer and overlay
    document.getElementById('side-drawer').classList.add('open');
    document.getElementById('drawer-overlay').classList.add('active');
}

function closeDrawer() {
    document.getElementById('side-drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('active');
}

function saveEntry() {
    const index = document.getElementById('edit-index').value;
    
    allTodos[index].title = document.getElementById('edit-title').value;
    // allTodos[index].completed = document.getElementById('edit-status').value === 'true';

    renderTable();
    closeDrawer(); 
}

function toggleRowSelection(index) {
    allTodos[index].selected = !allTodos[index].selected;
    renderTable();
}

function toggleAll(masterCheckbox) {
    allTodos.forEach(todo => todo.selected = masterCheckbox.checked);
    renderTable();
}

function deleteSelected() {
    if (confirm("Are you sure you want to delete the selected items?")) {
        allTodos = allTodos.filter(todo => !todo.selected);
        
        document.getElementById('select-all').checked = false;
        renderTable();
    }
}

function deleteSingle(index) {
    if (confirm("Delete this task?")) {
        allTodos.splice(index, 1);
        renderTable();
    }
}

function updateBulkDeleteButton() {
    const btn = document.getElementById('bulk-delete-btn');
    const anySelected = allTodos.some(todo => todo.selected);
    btn.disabled = !anySelected;
}

function applyDateFilter() {
    const startVal = document.getElementById('startDate').value;
    const endVal = document.getElementById('endDate').value;

    // Convert string inputs ("YYYY-MM-DD") to Date objects for comparison
    activeDateRange.start = startVal ? new Date(startVal).setHours(0,0,0,0) : null;
    activeDateRange.end = endVal ? new Date(endVal).setHours(23,59,59,999) : null;

    renderTable();
}

function clearFilter() {
    document.getElementById('startDate').value = "";
    document.getElementById('endDate').value = "";
    document.getElementById('searchInput').value = "";

    activeDateRange = { start: null, end: null };
    activeSearchTerm = "";
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('todoBody');
    
    const filteredData = allTodos.filter(todo => {
        const todoTime = todo.createdDate.getTime();
        
        const matchesStart = !activeDateRange.start || todoTime >= activeDateRange.start;
        const matchesEnd = !activeDateRange.end || todoTime <= activeDateRange.end;
        
        const matchesText = todo.title.toLowerCase().includes(activeSearchTerm);

        return matchesStart && matchesEnd && matchesText;
    });

    tbody.innerHTML = filteredData.map(todo => {
        const originalIndex = allTodos.indexOf(todo);
        const formattedDate = todo.createdDate.toLocaleDateString();

        return `
            <tr>
                <td>
                    <input type="checkbox" ${todo.selected ? 'checked' : ''} onchange="toggleRowSelection(${originalIndex})">
                    <button onclick="openDrawer(${originalIndex})">Edit</button>
                </td>
                <td>${todo.id}</td>
                <td>${todo.title}</td>
                <td>${formattedDate}</td>
                <td>${todo.completed ? 'Complete' : 'Pending'}</td>
                <td>
                    <button class="delete-btn" onclick="deleteSingle(${originalIndex})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

fetchTodos();