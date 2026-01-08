// 1. Auto Slider Functionality
const sliderImages = [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2075',
    'https://images.unsplash.com/photo-1544126592-807daa2b565b?q=80&w=2070'
];

let currentSlide = 0;
const sliderDiv = document.querySelector('#slider div');

function changeSlide() {
    if (sliderDiv) {
        currentSlide = (currentSlide + 1) % sliderImages.length;
        sliderDiv.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${sliderImages[currentSlide]}')`;
    }
}

setInterval(changeSlide, 5000); // Every 5 seconds

// 2. Global Cart Variable
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initial Cart Count Update
const countElementInitial = document.getElementById('cart-count');
if (countElementInitial) {
    countElementInitial.innerText = cart.length;
}

// 3. Products Variable (Meka ekaparak pamanak liyanna)
let products = []; 

const productContainer = document.getElementById('product-container');

function displayProducts() {
    if (!productContainer) return;
    productContainer.innerHTML = ""; 

    products.forEach(item => {
        const discountPrice = item.price - (item.price * item.discount / 100);
        
        const card = `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden relative group cursor-pointer" onclick="viewProduct(${item.id})">
                ${item.isSoldOut ? '<div class="absolute inset-0 bg-black/50 z-10 flex items-center justify-center"><span class="bg-red-500 text-white px-4 py-1 rounded-full font-bold">SOLD OUT</span></div>' : ''}
                
                ${item.discount > 0 ? `<div class="absolute top-3 left-3 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-md z-20">${item.discount}% OFF</div>` : ''}

                <img src="${item.image}" class="w-full h-64 object-cover group-hover:scale-105 transition duration-300">
                
                <div class="p-4">
                    <p class="text-xs text-gray-400 uppercase">${item.category}</p>
                    <h3 class="font-bold text-lg mb-1">${item.name}</h3>
                    <div class="flex items-center space-x-2">
                        <span class="text-pink-600 font-bold text-xl">Rs. ${discountPrice}</span>
                        ${item.discount > 0 ? `<span class="text-gray-400 line-through text-sm">Rs. ${item.price}</span>` : ''}
                    </div>
                    
                    <div class="mt-2 flex space-x-1">
                        ${item.sizes.map(s => `<span class="text-[10px] bg-gray-100 px-2 py-0.5 rounded">${s}</span>`).join('')}
                    </div>
                    <button onclick="event.stopPropagation(); addToCart(${item.id})" class="mt-4 w-full bg-pink-500 text-white py-2 rounded-xl font-bold">Add to Cart</button>
                </div>
            </div>
        `;
        productContainer.innerHTML += card;
    });

}
    // Filter by Category Logic
function filterByCategory(cat) {
    document.getElementById('current-category').innerText = cat === 'All' ? 'All Collections' : cat;
    
    const allProducts = JSON.parse(localStorage.getItem('allProducts')) || products; // Get cached data
    const filtered = cat === 'All' ? allProducts : allProducts.filter(p => p.category === cat);
    
    renderFilteredProducts(filtered);
}

// Search Logic
function filterProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const allProducts = JSON.parse(localStorage.getItem('allProducts')) || products;
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
    renderFilteredProducts(filtered);
}

function filterProductsMobile() {
    const query = document.getElementById('mobileSearchInput').value.toLowerCase();
    const allProducts = JSON.parse(localStorage.getItem('allProducts')) || products;
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
    renderFilteredProducts(filtered);
}

// Helper function to render cards
function renderFilteredProducts(items) {
    const container = document.getElementById('product-container');
    container.innerHTML = "";
    
    if(items.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center py-20 text-gray-400 italic">No items found matching your criteria.</p>`;
        return;
    }

    items.forEach(item => {
        // ... Oyaage displayProducts() function eke thiyena card HTML eka methanata danna ...
        // Example:
        const discountPrice = item.price - (item.price * item.discount / 100);
        container.innerHTML += `
            <div class="bg-white rounded-xl shadow-sm overflow-hidden relative group cursor-pointer border border-gray-100" onclick="viewProduct(${item.id})">
                <img src="${item.image.split(',')[0]}" class="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition duration-500">
                <div class="p-4">
                    <p class="text-[10px] text-pink-400 font-bold uppercase">${item.category}</p>
                    <h3 class="font-bold text-sm mb-1 truncate">${item.name}</h3>
                    <p class="text-pink-600 font-bold">Rs. ${discountPrice}</p>
                </div>
            </div>`;
    });
}

function viewProduct(id) {
    const item = products.find(p => p.id == id);
    if (item) {
        // Product details okkoma save karamu
        localStorage.setItem('selectedProduct', JSON.stringify(item));
        window.location.href = "product.html";
    }
}
// WhatsApp Function
function sendToWhatsApp() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let phoneNumber = "94778726607"; 
    let message = "Hi, I would like to order the following baby items:\n\n";
    let grandTotal = 0;

    cart.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        grandTotal += subtotal;
        message += `${index + 1}. *${item.name}*\n   Size: ${item.size}\n   Qty: ${item.quantity}\n   Price: Rs.${subtotal}\n\n`;
    });

    message += `*Grand Total: Rs.${grandTotal}*`;
    let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    
    if (!product) return;
    if (product.isSoldOut) {
        alert("Sorry, this item is Sold Out!");
        return;
    }

    const existingItem = cart.find(item => item.id == productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price - (product.price * product.discount / 100),
            image: product.image,
            quantity: 1,
            size: product.sizes[0]
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert("Added to cart successfully!");
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if(countElement) {
        countElement.innerText = cart.length;
    }
}

function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('total-price');
    
    if (!cartContainer) return; 

    let total = 0;
    cartContainer.innerHTML = "";

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartContainer.innerHTML += `
            <div class="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" class="w-16 h-16 object-cover rounded-lg">
                    <div>
                        <h3 class="font-bold">${item.name}</h3>
                        <p class="text-pink-500 font-bold text-sm">Rs. ${item.price}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="changeQty(${index}, -1)" class="bg-gray-100 px-2 rounded">-</button>
                    <span class="font-bold">${item.quantity}</span>
                    <button onclick="changeQty(${index}, 1)" class="bg-gray-100 px-2 rounded">+</button>
                    <button onclick="removeItem(${index})" class="text-red-500 ml-4"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    if(totalElement) totalElement.innerText = total;
}

function changeQty(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

// Google Sheet Integration
const sheetId = '1G4cN7nFeC3160l5q9B18kGW3fEJDXLFjaOIJf-and-w'; 
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Sheet1`;

async function loadProductsFromSheet() {
    try {
        const response = await fetch(base);
        const data = await response.text();
        
        const rows = data.split('\n').slice(1); 
        products = rows.map(row => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
            return {
                id: cols[0].replace(/"/g, '').trim(),
                name: cols[1].replace(/"/g, '').trim(),
                price: parseFloat(cols[2].replace(/"/g, '')),
                description: cols[3].replace(/"/g, '').trim(),
                category: cols[4].replace(/"/g, '').trim(),
                sizes: cols[5].replace(/"/g, '').split(','),
                colors: cols[6].replace(/"/g, '').split(','),
                discount: parseFloat(cols[7].replace(/"/g, '')),
                image: cols[8].replace(/"/g, '').trim(),
                isSoldOut: cols[9].replace(/"/g, '').trim().toLowerCase() === 'sold out'
            };
        });
        
        displayProducts(); 
    } catch (error) {
        console.error("Sheet data loading error:", error);
    }

    let selectedSize = "";
let selectedColor = "";
let currentQty = 1;

function renderProductDetails() {
    const pId = localStorage.getItem('selectedProductId');
    // Load products from localStorage or wait for fetch
    setTimeout(() => {
        const item = products.find(p => p.id == pId);
        if (!item) return;

        document.getElementById('p-title').innerText = item.name;
        document.getElementById('p-price').innerText = "Rs. " + (item.price - (item.price * item.discount / 100));
        document.getElementById('p-old-price').innerText = item.discount > 0 ? "Rs. " + item.price : "";
        document.getElementById('p-desc').innerText = item.description;
        document.getElementById('p-cat').innerText = item.category;
        
        // Multi-image handling (Link1, Link2 kiyala sheet eke thibunoth)
        const images = item.image.split(',');
        document.getElementById('main-img').src = images[0];
        
        const thumbContainer = document.getElementById('thumb-container');
        images.forEach(img => {
            const t = document.createElement('img');
            t.src = img;
            t.className = "w-20 h-20 object-cover rounded-lg cursor-pointer border-2 hover:border-pink-500";
            t.onclick = () => document.getElementById('main-img').src = img;
            thumbContainer.appendChild(t);
        });

        // Sizes Render
        const sizeBox = document.getElementById('size-options');
        item.sizes.forEach(s => {
            const btn = document.createElement('button');
            btn.innerText = s;
            btn.className = "border-2 border-gray-200 px-4 py-2 rounded-xl hover:bg-pink-50 transition";
            btn.onclick = (e) => {
                document.querySelectorAll('#size-options button').forEach(b => b.classList.remove('selected-option'));
                btn.classList.add('selected-option');
                selectedSize = s;
            };
            sizeBox.appendChild(btn);
        });

        // Colors Render
        const colorBox = document.getElementById('color-options');
        item.colors.forEach(c => {
            const btn = document.createElement('button');
            btn.innerText = c;
            btn.className = "border-2 border-gray-200 px-4 py-2 rounded-xl hover:bg-pink-50 transition";
            btn.onclick = () => {
                document.querySelectorAll('#color-options button').forEach(b => b.classList.remove('selected-option'));
                btn.classList.add('selected-option');
                selectedColor = c;
            };
            colorBox.appendChild(btn);
        });
    }, 1000); // Wait for sheet to load
}

function changeQty(val) {
    currentQty = Math.max(1, currentQty + val);
    document.getElementById('qty-val').innerText = currentQty;
}

function finalAddToCart() {
    if (!selectedSize || !selectedColor) {
        alert("Please select both Size and Color!");
        return;
    }
    const pId = localStorage.getItem('selectedProductId');
    const item = products.find(p => p.id == pId);
    
    cart.push({
        ...item,
        price: item.price - (item.price * item.discount / 100),
        size: selectedSize,
        color: selectedColor,
        quantity: currentQty
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Product added to cart!");
    window.location.href = "cart.html";
}
}

// Unified Window Load
window.onload = function() {
    loadProductsFromSheet();
    displayCartItems();
    updateCartCount();
};