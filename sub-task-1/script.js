let allTodos = [];
let activeSearchTerm = "";

async function fetchTodos() {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=20');
    allTodos = await res.json();
    renderTable();
}

function openDrawer(index) {
    const todo = allTodos[index];
    
    // Fill the form with current data
    document.getElementById('edit-index').value = index;
    document.getElementById('edit-id').value = todo.id;
    document.getElementById('edit-title').value = todo.title;
    document.getElementById('edit-status').value = todo.completed.toString();

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
    allTodos[index].completed = document.getElementById('edit-status').value === 'true';

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

function applyFilter() {
    const input = document.getElementById('searchInput');
    activeSearchTerm = input.value.toLowerCase().trim();
    renderTable();
}

function clearFilter() {
    document.getElementById('searchInput').value = "";
    activeSearchTerm = "";
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('todoBody');
    
    const filteredData = allTodos.filter(todo => 
        todo.title.toLowerCase().includes(activeSearchTerm)
    );

    tbody.innerHTML = filteredData.map(todo => {
        const originalIndex = allTodos.indexOf(todo);
        return `
            <tr class="${todo.selected ? 'selected' : ''}">
                <td>
                    <input type="checkbox" ${todo.selected ? 'checked' : ''} onclick="toggleRowSelection(${originalIndex})">
                    <button onclick="openDrawer(${originalIndex})">Edit</button>
                </td>
                <td>${todo.id}</td>
                <td>${todo.title}</td>
                <td>${todo.completed ? 'Complete' : 'Pending'}</td>
                <td>
                    <button class="delete-btn" onclick="deleteSingle(${originalIndex})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');

    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No records match your filter.</td></tr>';
    }
}

fetchTodos();