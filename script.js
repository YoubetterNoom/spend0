document.addEventListener('DOMContentLoaded', () => {
    let balance = 1000000000;
    let spent = 0;
    let timer = 30;
    let countdown;

    const balanceElement = document.getElementById('balance');
    const spentElement = document.getElementById('spent');
    const buyButtons = document.querySelectorAll('.buy-button');
    const timerElement = document.getElementById('timer');
    const container = document.getElementById('container');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const tryAgainButton = document.getElementById('try-again-button');
    const backpackItems = document.getElementById('backpack-items');
    const backpackElement = document.querySelector('.backpack');
    const backpack = {};

    function startCountdown() {
        clearInterval(countdown);
        countdown = setInterval(() => {
            timer--;
            timerElement.textContent = timer;

            if (timer <= 0) {
                clearInterval(countdown);
                if (balance <= 0) {
                    modalMessage.textContent = "You are the biggest spender on Earth!";
                } else {
                    modalMessage.textContent = "Your money has been confiscated.";
                }
                modal.style.display = 'flex';
            }
        }, 1000);
    }

    startCountdown();

    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const price = parseInt(item.getAttribute('data-price'));
            const itemName = item.getAttribute('data-name');

            if (balance >= price) {
                balance -= price;
                spent += price;
                balanceElement.textContent = `$${balance.toLocaleString()}`;
                spentElement.textContent = `$${spent.toLocaleString()}`;

                // Add item to backpack
                if (backpack[itemName]) {
                    backpack[itemName]++;
                } else {
                    backpack[itemName] = 1;
                }
                updateBackpack(itemName);

                // Add flash and shake effect to balance, container, and backpack
                balanceElement.classList.add('flash');
                container.classList.add('shake');
                backpackElement.classList.add('shake');
                setTimeout(() => {
                    balanceElement.classList.remove('flash');
                    container.classList.remove('shake');
                    backpackElement.classList.remove('shake');
                }, 500);

                // Add flash green effect to item
                item.classList.add('flash-green');
                setTimeout(() => {
                    item.classList.remove('flash-green');
                }, 500);

                // If balance is zero, show modal and disable all buttons
                if (balance <= 0) {
                    clearInterval(countdown);
                    modalMessage.textContent = "You have spent all your money!";
                    modal.style.display = 'flex';
                    buyButtons.forEach(btn => btn.disabled = true);
                }
            } else {
                alert('You cant afford this expensive thing right now.');
            }
        });
    });

    tryAgainButton.addEventListener('click', () => {
        balance = 2000000000;  // Reset to $20 billion
        spent = 0;
        balanceElement.textContent = `$${balance.toLocaleString()}`;
        spentElement.textContent = `$0`;
        timer = 60;
        timerElement.textContent = timer;
        buyButtons.forEach(btn => btn.disabled = false);
        modal.style.display = 'none';
        backpackItems.innerHTML = '';
        for (let item in backpack) {
            delete backpack[item];
        }
        startCountdown();
    });

    function updateBackpack(itemName) {
        // Check if item already exists in backpack
        let itemElement = document.querySelector(`#backpack-items p[data-name="${itemName}"]`);

        if (itemElement) {
            // Update the quantity if it exists
            itemElement.textContent = `${itemName}: ${backpack[itemName]}`;
            itemElement.classList.add('flash-gold'); // Add flash-gold class to updated item

            // Remove flash-gold class after animation
            setTimeout(() => {
                itemElement.classList.remove('flash-gold');
            }, 500);
        } else {
            // Create new element if it does not exist
            itemElement = document.createElement('p');
            itemElement.setAttribute('data-name', itemName);
            itemElement.textContent = `${itemName}: ${backpack[itemName]}`;
            itemElement.classList.add('flash-gold'); // Add flash-gold class to new item
            backpackItems.appendChild(itemElement);

            // Remove flash-gold class after animation
            setTimeout(() => {
                itemElement.classList.remove('flash-gold');
            }, 500);
        }
    }
});