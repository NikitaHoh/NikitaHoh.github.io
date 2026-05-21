        // Массив продуктов
        let products = [];

        // Текущий фильтр
        let currentFilter = 'all'; // 'all', 'active', 'bought'

        // Загрузка из localStorage
        function loadFromStorage() {
            const saved = localStorage.getItem('shoppingList');
            if (saved) {
                products = JSON.parse(saved);
            } else {
                // Пример для демонстрации
                products = [
                    { id: 1, name: 'Молоко', quantity: 2, bought: false },
                    { id: 2, name: 'Хлеб', quantity: 1, bought: true },
                    { id: 3, name: 'Яблоки', quantity: 5, bought: false }
                ];
            }
        }

        // Сохранение в localStorage
        function saveToStorage() {
            localStorage.setItem('shoppingList', JSON.stringify(products));
        }

        // Отображение списка
        function renderList() {
            const container = document.getElementById('todoList');
            
            // Фильтрация
            let filteredProducts = products;
            if (currentFilter === 'active') {
                filteredProducts = products.filter(p => !p.bought);
            } else if (currentFilter === 'bought') {
                filteredProducts = products.filter(p => p.bought);
            }
            
            // Если нет товаров
            if (filteredProducts.length === 0) {
                container.innerHTML = '<div class="text-muted text-center p-3">📭 Нет товаров</div>';
                return;
            }
            
            // Отображаем список
            let html = '<ul class="list-group list-group-flush">';
            for (let product of filteredProducts) {
                const boughtClass = product.bought ? 'bought-item' : '';
                const checkedAttr = product.bought ? 'checked' : '';
                html += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" data-id="${product.id}" ${checkedAttr}>
                            <label class="form-check-label ${boughtClass}">
                                ${product.name} — <strong>${product.quantity} шт.</strong>
                            </label>
                        </div>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}">🗑</button>
                    </li>
                `;
            }
            html += '</ul>';
            container.innerHTML = html;
        }
        
        // Добавление товара
        function addProduct() {
            const nameInput = document.getElementById('productName');
            const quantityInput = document.getElementById('productQuantity');
            
            const name = nameInput.value.trim();
            const quantity = parseInt(quantityInput.value);
            
            if (name === '') {
                alert('Введите название товара');
                return;
            }
            
            if (isNaN(quantity) || quantity < 1) {
                alert('Введите корректное количество');
                return;
            }
            
            const newId = Date.now(); // уникальный ID
            products.push({
                id: newId,
                name: name,
                quantity: quantity,
                bought: false
            });
            
            // Очищаем поля
            nameInput.value = '';
            quantityInput.value = '1';
            
            saveToStorage();
            renderList();
        }
        
        // Переключение статуса "Куплено"
        function toggleBought(productId) {
            const product = products.find(p => p.id === productId);
            if (product) {
                product.bought = !product.bought;
                saveToStorage();
                renderList();
            }
        }
        
        // Удаление одного товара
        function deleteProduct(productId) {
            products = products.filter(p => p.id !== productId);
            saveToStorage();
            renderList();
        }
        
        // Очистить купленные товары
        function clearBought() {
            products = products.filter(p => !p.bought);
            saveToStorage();
            renderList();
        }
        
        // Обработчики событий
        function setupEventListeners() {
            const container = document.getElementById('todoList');
            
            // Обработка кликов на чекбокс и кнопку удаления
            container.addEventListener('click', (e) => {
                if (e.target.classList.contains('form-check-input')) {
                    const id = parseInt(e.target.dataset.id);
                    toggleBought(id);
                } else if (e.target.classList.contains('delete-btn')) {
                    const id = parseInt(e.target.dataset.id);
                    deleteProduct(id);
                }
            });
            
            // Кнопка добавления
            document.getElementById('addBtn').addEventListener('click', addProduct);
            
            // Добавление по Enter
            document.getElementById('productName').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addProduct();
            });
            
            // Кнопки фильтров
            document.getElementById('filterAll').addEventListener('click', () => {
                currentFilter = 'all';
                updateFilterButtons('filterAll');
                renderList();
            });
            
            document.getElementById('filterActive').addEventListener('click', () => {
                currentFilter = 'active';
                updateFilterButtons('filterActive');
                renderList();
            });
            
            document.getElementById('filterBought').addEventListener('click', () => {
                currentFilter = 'bought';
                updateFilterButtons('filterBought');
                renderList();
            });
            
            // Очистка купленных
            document.getElementById('clearBoughtBtn').addEventListener('click', clearBought);
        }
        
        // Обновление активной кнопки фильтра
        function updateFilterButtons(activeId) {
            ['filterAll', 'filterActive', 'filterBought'].forEach(id => {
                const btn = document.getElementById(id);
                if (id === activeId) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
        
        // Инициализация приложения
        function init() {
            loadFromStorage();
            renderList();
            setupEventListeners();
        }
        
        // Запуск
        init();