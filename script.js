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

// 2. Global Cart Variable (Ekaparak pamanak ihalin danna)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initial Cart Count Update
const countElementInitial = document.getElementById('cart-count');
if (countElementInitial) {
    countElementInitial.innerText = cart.length;
}

// Sample Data
const products = [
    {
        id: 1,
        name: "Cute Pink Baby Frock",
        price: 2500,
        discount: 10,
        category: "Frocks",
        sizes: ["0-3M", "3-6M", "6-12M"],
        colors: ["Pink", "White"],
        image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000",
        description: "High quality cotton frock for your little princess.",
        isSoldOut: false
    },
    {
        id: 2,
        name: "Blue Cotton Romper",
        price: 1800,
        discount: 0,
        category: "Rompers",
        sizes: ["3-6M", "6-12M"],
        colors: ["Blue"],
        image: "https://images.unsplash.com/photo-1522771917583-67b8511ecb5d?q=80&w=1000",
        description: "Soft and comfortable romper for daily use.",
        isSoldOut: true
    }
];

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

function viewProduct(id) {
    localStorage.setItem('selectedProductId', id);
    window.location.href = "product.html";
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
    const product = products.find(p => p.id === productId);
    
    if (product.isSoldOut) {
        alert("Sorry, this item is Sold Out!");
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

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

// Page load ekedi functions run kirima
window.onload = function() {
    displayProducts();
    displayCartItems();
    updateCartCount();
};