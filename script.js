// 유아들이 좋아할 만한 상품 목록 (이모지와 간단한 가격)
const products = [
    { id: 'p1', name: '빨간 사과', emoji: '🍎', price: 1000 },
    { id: 'p2', name: '바나나', emoji: '🍌', price: 1500 },
    { id: 'p3', name: '수박', emoji: '🍉', price: 3000 },
    { id: 'p4', name: '초코 케이크', emoji: '🍰', price: 2500 },
    { id: 'p5', name: '우유', emoji: '🥛', price: 1000 },
    { id: 'p6', name: '햄버거', emoji: '🍔', price: 4000 },
    { id: 'p7', name: '포도 주스', emoji: '🧃', price: 800 },
    { id: 'p8', name: '장난감 곰', emoji: '🧸', price: 5000 },
    { id: 'p9', name: '풍선', emoji: '🎈', price: 500 },
    { id: 'p10', name: '당근', emoji: '🥕', price: 500 },
    { id: 'p11', name: '아이스크림', emoji: '🍦', price: 1200 },
    { id: 'p12', name: '맛있는 피자', emoji: '🍕', price: 3500 },
    { id: 'p13', name: '로봇 장난감', emoji: '🤖', price: 4500 },
    { id: 'p14', name: '딸기', emoji: '🍓', price: 2000 },
    { id: 'p15', name: '포도', emoji: '🍇', price: 1800 }
];

let cart = {}; // 장바구니 데이터를 저장하는 객체 { 'p1': { count: 1, ... } }

document.addEventListener('DOMContentLoaded', () => {
    
    // 상품 카드 생성 로직
    const productGrid = document.getElementById('productGrid');
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'productCard';
        // 숫자 천단위 콤마 처리
        const formattedPrice = p.price.toLocaleString();
        
        card.innerHTML = `
            <div class="emoji">${p.emoji}</div>
            <div class="name">${p.name}</div>
            <div class="price">${formattedPrice}원</div>
        `;
        card.addEventListener('click', () => {
            playSound('beep');
            addToCart(p);
        });
        productGrid.appendChild(card);
    });

    // 화면 전환 이벤트 설정
    document.getElementById('start-btn').addEventListener('click', () => {
        switchScreen('screen-shop');
    });

    document.getElementById('reset-cart-btn').addEventListener('click', () => {
        cart = {};
        updateCartUI();
    });

    document.getElementById('checkout-btn').addEventListener('click', () => {
        switchScreen('screen-payment');
    });

    document.getElementById('back-to-shop-btn').addEventListener('click', () => {
        switchScreen('screen-shop');
    });

    // 결제 수단 클릭 로직 (카드 카드 페이 등등)
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const methodInfo = btn.querySelector('.emoji').textContent;
            document.getElementById('payment-icon').textContent = methodInfo;
            
            switchScreen('screen-processing');
            
            setTimeout(() => {
                playSound('success');
                showReceipt();
                switchScreen('screen-receipt');
            }, 2500); // 2.5초 지연 (결제 로딩 효과)
        });
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
        cart = {};
        updateCartUI();
        switchScreen('screen-welcome');
    });
});

// 장바구니에 아이템 추가
function addToCart(product) {
    if (cart[product.id]) {
        cart[product.id].count += 1;
    } else {
        cart[product.id] = { ...product, count: 1 };
    }
    updateCartUI();
}

// 장바구니 UI 및 총합 갱신
function updateCartUI() {
    const cartItemsEl = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    cartItemsEl.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    Object.values(cart).forEach(item => {
        total += item.price * item.count;
        itemCount += item.count;

        const row = document.createElement('div');
        row.className = 'cart-item';
        
        const itemTotalPrice = (item.price * item.count).toLocaleString();
        
        row.innerHTML = `
            <div class="cart-item-info">
                <span>${item.emoji} ${item.name}</span>
                <span class="badge">${item.count}</span>
            </div>
            <div class="cart-item-price">${itemTotalPrice}원</div>
        `;
        cartItemsEl.appendChild(row);
    });

    totalPriceEl.textContent = `${total.toLocaleString()}원`;

    // 1개라도 담겨야 계산 버튼 활성화
    if (itemCount > 0) {
        checkoutBtn.disabled = false;
        // 새로 추가될 때마다 아래로 스크롤
        cartItemsEl.scrollTop = cartItemsEl.scrollHeight;
    } else {
        checkoutBtn.disabled = true;
    }
}

// 영수증 생성 및 출력
function showReceipt() {
    const receiptItemsEl = document.getElementById('receipt-items');
    const receiptTotalEl = document.getElementById('receipt-total-price');
    
    receiptItemsEl.innerHTML = '';
    let total = 0;

    Object.values(cart).forEach(item => {
        total += item.price * item.count;
        const row = document.createElement('div');
        row.className = 'receipt-line';
        
        const itemTotal = (item.price * item.count).toLocaleString();
        
        row.innerHTML = `
            <span>${item.name} x${item.count}</span>
            <span>${itemTotal}원</span>
        `;
        receiptItemsEl.appendChild(row);
    });

    receiptTotalEl.textContent = `${total.toLocaleString()}원`;
}

// 화면 전환 애니메이션 함수
function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
        if (s.id !== id) {
            s.classList.remove('active');
            setTimeout(() => s.classList.add('hidden'), 350);
        }
    });
    
    const target = document.getElementById(id);
    target.classList.remove('hidden');
    setTimeout(() => target.classList.add('active'), 50);
}

// 오디오 사운드 재생
function playSound(type) {
    let audioId = type === 'beep' ? 'beep-sound' : 'success-sound';
    const audio = document.getElementById(audioId);
    if(audio) {
        audio.currentTime = 0; // 초기화
        audio.play().catch(e => console.log('Autoplay prevented', e));
    }
}
