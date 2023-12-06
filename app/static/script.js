function deleteCollege(button) {
    console.log("Delete button clicked.");
    var college_code = button.getAttribute('college-code');
    var csrfToken = button.getAttribute('csrf-token');
    if (confirm("Are you sure you want to delete this college?\nStudents and Courses under this College will also be deleted.")) {
        fetch(`/colleges/delete/${college_code}`, {  
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrfToken
            }
        }).then(response => response.json())
        .then(data => {
            if (data.success === true) {
                window.location.reload();
            } else {
                console.error("Error: " + data.error);
            }
        });        
    }
}

function delCourse(button) {
    console.log("Delete button clicked.");
    var coursecode = button.getAttribute('course-code');
    var csrfToken = button.getAttribute('csrf-token');
    if (confirm("Are you sure you want to delete this course?")) {
        fetch(`/course/delete/${coursecode}`, {  
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrfToken
            }
        }).then(response => response.json())
        .then(data => {
            if (data.success === true) {
                window.location.reload();
            } else {
                console.error("Error: " + data.error);
            }
        });        
    }
}

function deleteStudent(button) {
    console.log("Delete button clicked.");
    var student_id = button.getAttribute('student-id');
    var csrfToken = button.getAttribute('csrf-token');
    if (confirm("Are you sure you want to delete this student?")) {
        fetch(`/students/delete/${student_id}`, {  // Fix the URL string
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrfToken
            }
        }).then(response => response.json())
        .then(data => {
            if (data.success === true) {
                window.location.reload();
            } else {
                console.error("Error: " + data.error);
            }
        });
    }
}


const searchInput = document.querySelector('.search-bar');
const collegeTable = document.getElementById('table');
const rows = collegeTable.getElementsByTagName('tr');

searchInput.addEventListener('input', function () {
    const searchTerm = this.value.trim().toLowerCase();

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false; // Initialize found flag for the row

        for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();

            if (cellText.includes(searchTerm)) {
                found = true; // Set the found flag
                break; // No need to check other cells in this row
            }
        }

        if (found) {
            row.style.display = ''; // Show the row
        } else {
            row.style.display = 'none'; // Hide the row
        }
    }
});


const fileInput = document.getElementById('file-input');
const fileButton = document.getElementById('file-button');
const imagePreview = document.getElementById('student_info_image');
const imageUrlInput = document.getElementById('image_url');
const imagePreviewContainer = document.getElementById('student_image_container');
const csrfToken = document.querySelector("meta[name=csrf_token]").content;

let originalImageUrl = imageUrlInput.value;
let MB = 1024*1024;

fileButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', async () => {
    try {
        const selectedFile = fileInput.files[0];

        if (!isImageFile(selectedFile)) {
            alert("Invalid file. Please upload an image file (JPG, JPEG, or PNG).");
            fileInput.value = ''; 
            return;
        }

        if (selectedFile.size > MB) { 
            alert("File size exceeds 1MB. Please choose a smaller file.");
            fileInput.value = ''; // Clear the file input
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);
        formData.append("csrf_token", csrfToken);
    
        imagePreviewContainer.innerHTML = '<div id="student_info_image"> <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div> </div>';

        const response = await fetch("/upload/cloudinary/", {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data && data.is_success) {
            const img = document.createElement("img");
            img.id = 'student_info_image';
            img.alt = "New Image Photo"
            img.src = data.url;

            imagePreviewContainer.innerHTML = '';
            imagePreviewContainer.appendChild(img);
            
            imageUrlInput.value = data.url;
        } else {
            console.error("Upload failed:", data);
            
            imageUrlInput.value = originalImageUrl;

            const originalImg = document.createElement("img");
            originalImg.id = 'student_info_image';
            originalImg.alt = "Original Image Photo";
            originalImg.src = originalImageUrl;

            imagePreviewContainer.innerHTML = '';
            imagePreviewContainer.appendChild(originalImg);

            alert("Invalid file. Please upload a JPG, JPEG, or PNG file.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
});

function isImageFile(file) {
  const acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  return file && acceptedImageTypes.includes(file.type);
}