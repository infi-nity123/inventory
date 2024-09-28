localStorage.clear()
// Function to add a new item
function addItem() {
    var itemName = document.getElementById('newItemInput').value.trim(); // Trim whitespace

    if (itemName === '') {
        alert('Please enter an item name.');
        return;
    }

    // Create an object to hold item data
    var newItem = {
        name: itemName,
        currentQuantity: 0, // Initial quantity set to 0
        changes: []
    };

    // Retrieve existing items from localStorage or initialize if it doesn't exist
    var items = JSON.parse(localStorage.getItem('items')) || [];

    // Check if the item already exists (case insensitive)
    var existingItemIndex = items.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());
    if (existingItemIndex !== -1) {
        alert('Item already exists.');
        return;
    }

    // Add new item to the list
    items.push(newItem);

    // Save updated items list back to localStorage
    localStorage.setItem('items', JSON.stringify(items));

    // Clear input field
    document.getElementById('newItemInput').value = '';

    // Refresh tables
    displayCurrentItems();
}

// Function to add quantity to an item
function addQuantity(itemName) {
    var items = JSON.parse(localStorage.getItem('items')) || [];

    // Find the item in the array (case insensitive)
    var item = items.find(item => item.name.toLowerCase() === itemName.toLowerCase());
    if (!item) {
        alert('Item not found.');
        return;
    }

    var quantityToAdd = parseInt(prompt('Enter quantity to add:', ''));
    if (!isNaN(quantityToAdd) && quantityToAdd > 0) {
        item.currentQuantity += quantityToAdd;
        item.changes.push({ type: 'Addition', quantity: quantityToAdd, date: new Date().toLocaleDateString() });

        // Update localStorage
        localStorage.setItem('items', JSON.stringify(items));

        // Refresh tables
        displayCurrentItems();
        displayItemHistory();
    } else {
        alert('Invalid quantity.');
    }
}

// Function to subtract quantity from an item
function subtractQuantity(itemName) {
    var items = JSON.parse(localStorage.getItem('items')) || [];

    // Find the item in the array (case insensitive)
    var item = items.find(item => item.name.toLowerCase() === itemName.toLowerCase());
    if (!item) {
        alert('Item not found.');
        return;
    }

    var quantityToSubtract = parseInt(prompt('Enter quantity to subtract:', ''));
    if (!isNaN(quantityToSubtract) && quantityToSubtract > 0 && quantityToSubtract <= item.currentQuantity) {
        item.currentQuantity -= quantityToSubtract;
        item.changes.push({ type: 'Subtraction', quantity: quantityToSubtract, date: new Date().toLocaleDateString() });

        // Update localStorage
        localStorage.setItem('items', JSON.stringify(items));

        // Refresh tables
        displayCurrentItems();
        displayItemHistory();
    } else {
        alert('Invalid quantity or insufficient stock.');
    }
}

// Function to display current items in the table
function displayCurrentItems() {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    var currentItemsTable = document.getElementById('currentItemsBody');
    currentItemsTable.innerHTML = '';

    items.forEach(item => {
        var row = currentItemsTable.insertRow();

        var itemNameCell = row.insertCell(0);
        var currentQuantityCell = row.insertCell(1); // Only one column for current quantity
        var addActionCell = row.insertCell(2);
        var dateCell = row.insertCell(3);

        itemNameCell.textContent = item.name;
        currentQuantityCell.textContent = item.currentQuantity;

        var addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.onclick = function() { addQuantity(item.name) };
        addActionCell.appendChild(addButton);

        var subtractButton = document.createElement('button');
        subtractButton.textContent = 'Subtract';
        subtractButton.onclick = function() { subtractQuantity(item.name) };
        addActionCell.appendChild(subtractButton);

        dateCell.textContent = item.changes.length > 0 ? item.changes[item.changes.length - 1].date : '-';
    });
}

// Function to display item history in the table
function displayItemHistory() {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    var itemHistoryTable = document.getElementById('itemHistoryBody');
    itemHistoryTable.innerHTML = '';

    items.forEach(item => {
        item.changes.forEach(change => {
            var row = itemHistoryTable.insertRow();

            var itemNameCell = row.insertCell(0);
            var changeTypeCell = row.insertCell(1);
            var quantityChangedCell = row.insertCell(2);
            var dateCell = row.insertCell(3);

            itemNameCell.textContent = item.name;
            changeTypeCell.textContent = change.type;
            quantityChangedCell.textContent = change.quantity;
            dateCell.textContent = change.date;
        });
    });
}

// Initial display when the page loads
displayCurrentItems();
displayItemHistory();


