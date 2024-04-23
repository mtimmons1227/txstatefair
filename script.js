// Function to populate dropdowns from JSON data
async function populateDropdowns() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        const inspectorDropdown = document.getElementById('inspector');
        data.inspectors.forEach(inspector => {
            const option = document.createElement('option');
            option.value = inspector;
            option.textContent = inspector;
            inspectorDropdown.appendChild(option);
        });

        const platDropdown = document.getElementById('map_plat');
        Object.keys(data.platVendors).forEach(plat => {
            const option = document.createElement('option');
            option.value = plat;
            option.textContent = plat;
            platDropdown.appendChild(option);
        });

        // Function to populate concessionaire dropdown based on selected plat
        function populateConcessionaireDropdown(selectedPlat) {
            const vendorSpan = document.getElementById('concessionaire');
            if (vendorSpan) {
                const selectedVendor = data.platVendors[selectedPlat];
                vendorSpan.textContent = selectedVendor;
            }
        }

        // Initially populate concessionaire dropdown based on default selected plat
        populateConcessionaireDropdown(platDropdown.value);

        // Event listener to populate concessionaire dropdown when plat selection changes
        platDropdown.addEventListener('change', function() {
            populateConcessionaireDropdown(this.value);
        });

    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

// Function to populate end date with current date and time when submit button is clicked
function populateEndDate(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const endDateInput = document.getElementById('endDatetime');
    const now = new Date();
    const dateString = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    endDateInput.value = dateString;
    updateSubmissionDate(dateString); // Update submission date
}

// Function to update submission date as static heading under "HEALTH DEPARTMENT NOTIFIED" section
function updateSubmissionDate(dateString) {
    const healthCheckbox = document.querySelector('input[name="healthDepartmentNotified"]');
    if (healthCheckbox.checked) {
        const submissionDateSection = document.getElementById('submissionDateSection');
        const submissionDateHeading = document.createElement('h3');
        submissionDateHeading.textContent = `Submission Date: ${dateString}`;
        submissionDateSection.appendChild(submissionDateHeading);
    }
}

// Function to add a blank line after section headers
function addBlankLineAfterHeaders() {
    const sectionHeaders = document.querySelectorAll('.legend');
    sectionHeaders.forEach(header => {
        const hr = document.createElement('hr');
        header.parentNode.insertBefore(hr, header.nextSibling);
    });
}

// Function to populate start date with current date and time
function populateStartDate() {
    const startDateInput = document.getElementById('datetime');
    const now = new Date();
    const dateString = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    startDateInput.value = dateString;
}

// Function to make Yes/No checkboxes mutually exclusive
function makeMutuallyExclusive() {
    const yesCheckbox = document.querySelector('input[name="liquidDischargeCheckbox"][value="yes"]');
    const noCheckbox = document.querySelector('input[name="liquidDischargeCheckbox"][value="no"]');

    yesCheckbox.addEventListener('change', function() {
        if (this.checked) {
            noCheckbox.checked = false;
        }
    });

    noCheckbox.addEventListener('change', function() {
        if (this.checked) {
            yesCheckbox.checked = false;
        }
    });
}

// Function to handle health department notified checkbox on form submission
function handleHealthDepartmentNotified() {
    const healthCheckbox = document.querySelector('input[name="healthDepartmentNotified"]');
    healthCheckbox.checked = false; // Uncheck the checkbox after submission
}

// Window onload event
window.onload = function() {
    populateDropdowns(); // Populate dropdowns when the window loads
    addBlankLineAfterHeaders(); // Add blank line after section headers
    populateStartDate(); // Populate start date with current date and time
    makeMutuallyExclusive(); // Make Yes/No checkboxes mutually exclusive
    // Other functions...
};

// Add event listener to form submit event to populate end date and update submission date when the form is submitted
const form = document.getElementById('complianceForm');
form.addEventListener('submit', function(event) {
    populateEndDate(event);
    handleHealthDepartmentNotified();
});

// Add event listener to submit button to populate end date and update submission date when clicked
const submitButton = document.querySelector('.submit-button');
submitButton.addEventListener('click', function(event) {
    populateEndDate(event);
    handleHealthDepartmentNotified();
});
