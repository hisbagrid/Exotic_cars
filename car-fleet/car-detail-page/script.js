// Mobile menu: the ☰ button shows/hides the navigation (same on every page)
document.getElementById("menu-btn").addEventListener("click", function () {
    document.getElementById("nav").classList.toggle("open");
});

document.addEventListener('DOMContentLoaded', () => {
    // Complete Vehicle Database with Relative Asset Paths & DOCX Specs
    const carsData = {
        'lamborghini': {
            title: 'Lamborghini Huracan',
            brand: 'Lamborghini',
            model: 'Huracan LP 610-4',
            category: 'Supercar',
            rent: '$500 / day',
            engine: '5.2L V10',
            hp: '602 HP',
            transmission: '7-Speed Dual-Clutch',
            topSpeed: '202 mph (325 km/h)',
            seats: '2',
            driveTrain: 'All-Wheel Drive (AWD)',
            images: [
                '../assets/(1) LAMBORGHINI HURACAN/PIC/1.jpg',
                '../assets/(1) LAMBORGHINI HURACAN/PIC/2.jpg',
                '../assets/(1) LAMBORGHINI HURACAN/PIC/3.jpg'
            ]
        },
        'mclaren': {
            title: 'McLaren 765LT',
            brand: 'McLaren',
            model: '765LT',
            category: 'Supercar / Track-Focused Coupe',
            rent: '$750 / day',
            engine: '4.0L Twin-Turbo V8',
            hp: '755 HP',
            transmission: '7-Speed Dual-Clutch (SSG)',
            topSpeed: '205 mph (330 km/h)',
            seats: '2',
            driveTrain: 'Rear-Wheel Drive (RWD)',
            images: [
                '../assets/(2) MCLAREN 765 LT/PIC/1.jpg',
                '../assets/(2) MCLAREN 765 LT/PIC/2.jpg',
                '../assets/(2) MCLAREN 765 LT/PIC/3.jpg'
            ]
        },
        'rollsroyce': {
            title: 'Rolls-Royce Ghost',
            brand: 'Rolls-Royce',
            model: 'Ghost',
            category: 'Ultra-Luxury Sedan',
            rent: '$750 / day',
            engine: '6.75L Twin-Turbo V12',
            hp: '563 HP',
            transmission: '8-Speed Automatic',
            topSpeed: '155 mph (250 km/h)',
            seats: '5',
            driveTrain: 'All-Wheel Drive (AWD)',
            images: [
                '../assets/(3) ROLLS ROYCE GHOST/PIC/1.jpg',
                '../assets/(3) ROLLS ROYCE GHOST/PIC/2.jpg',
                '../assets/(3) ROLLS ROYCE GHOST/PIC/3.jpg'
            ]
        },
        'mercedes': {
            title: 'Mercedes S-Class',
            brand: 'Mercedes-Benz',
            model: 'S-Class (Black)',
            category: 'Luxury Executive Sedan',
            rent: '$600 / day',
            engine: '3.0L Turbo Inline-6 / 4.0L V8',
            hp: '429 HP',
            transmission: '9-Speed Automatic',
            topSpeed: '130 mph (210 km/h) / 155 mph (250 km/h)',
            seats: '5',
            driveTrain: 'All-Wheel Drive (4MATIC)',
            images: [
                '../assets/(4) MERCEDES S-CLASS/PIC/1.png',
                '../assets/(4) MERCEDES S-CLASS/PIC/2.jpg'
            ]
        },
        'ferrari': {
            title: 'Ferrari SF90 Stradale',
            brand: 'Ferrari',
            model: 'SF90 Stradale (Matte Grey)',
            category: 'Hybrid Supercar / Coupe',
            rent: '$800 / day',
            engine: '4.0L Twin-Turbo V8 + 3 Electric Motors',
            hp: '986 HP (Combined)',
            transmission: '8-Speed Dual-Clutch',
            topSpeed: '211 mph (340 km/h)',
            seats: '2',
            driveTrain: 'All-Wheel Drive (e-AWD)',
            images: [
                '../assets/(5) FERRARI SF-90/PIC/1.jpg',
                '../assets/(5) FERRARI SF-90/PIC/2.jpg'
            ]
        },
        'aston': {
            title: 'Aston Martin Vanquish',
            brand: 'Aston Martin',
            model: 'Vanquish (Red)',
            category: 'Super GT / Coupe',
            rent: '$650 / day',
            engine: '5.2L Twin-Turbo V12',
            hp: '824 HP',
            transmission: '8-Speed Automatic',
            topSpeed: '214 mph (345 km/h)',
            seats: '2',
            driveTrain: 'Rear-Wheel Drive (RWD)',
            images: [
                '../assets/(6) ASTON MARTIN VANQUISH/PIC/1.png',
                '../assets/(6) ASTON MARTIN VANQUISH/PIC/2.png'
            ]
        }
    };

    // Read ?car= query parameter from URL (defaults to 'ferrari' if opened directly)
    const urlParams = new URLSearchParams(window.location.search);
    const carKey = (urlParams.get('car') || 'ferrari').toLowerCase();
    const selectedCar = carsData[carKey] || carsData['ferrari'];

    // Populate Page Title & Text Specifications
    document.title = `Exotic Cars - ${selectedCar.title}`;
    document.getElementById('car-title').textContent = selectedCar.title;
    document.getElementById('spec-brand').textContent = selectedCar.brand;
    document.getElementById('spec-model').textContent = selectedCar.model;
    document.getElementById('spec-category').textContent = selectedCar.category;
    document.getElementById('spec-rent').textContent = selectedCar.rent;
    document.getElementById('spec-engine').textContent = selectedCar.engine;
    document.getElementById('spec-hp').textContent = selectedCar.hp;
    document.getElementById('spec-transmission').textContent = selectedCar.transmission;
    document.getElementById('spec-topspeed').textContent = selectedCar.topSpeed;
    document.getElementById('spec-seats').textContent = selectedCar.seats;
    document.getElementById('spec-drivetrain').textContent = selectedCar.driveTrain;

    // Update Book Now Button Link with Selected Car Parameter
    const bookNowLink = document.getElementById('book-now-link');
    if (bookNowLink) {
        bookNowLink.href = `../booking-form/index.html?car=${carKey}`;
    }

    // Infinite Looping Carousel Logic
    const sliderImg = document.getElementById('car-slider-img');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const carImages = selectedCar.images;
    let currentIndex = 0;

    function updateSliderImage() {
        sliderImg.src = carImages[currentIndex];
        sliderImg.alt = `${selectedCar.title} - Image ${currentIndex + 1}`;
    }

    // Initialize first image
    updateSliderImage();

    // Next Button: Wraps from last image back to 0
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % carImages.length;
        updateSliderImage();
    });

    // Previous Button: Wraps from 0 back to last image
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + carImages.length) % carImages.length;
        updateSliderImage();
    });

    // Optional Keyboard Left/Right Arrow Support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % carImages.length;
            updateSliderImage();
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + carImages.length) % carImages.length;
            updateSliderImage();
        }
    });
});