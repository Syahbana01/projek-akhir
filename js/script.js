function revealCards() { 
        const cards = document.querySelectorAll('.keunggulan-pop');
        const triggerBottom = window.innerHeight * 0.85;
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < triggerBottom) {
                card.classList.add('show');
            }
        });
    }
    window.addEventListener('scroll', revealCards);
    window.addEventListener('load', revealCards);