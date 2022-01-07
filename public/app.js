const toCurrency = price => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
    }).format(+price)
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})


const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', (event) => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;


            fetch('/card/remove/' + id, {
                method: 'delete'
            })
                .then(res => res.json())
                .then(card => {
                    if (card.courses.length) {
                        $card.querySelector('tbody').innerHTML = card.courses.map(c => {
                            return `
                                     <tr>
                                        <th>${c.title}</th>
                                        <th>${c.count}</th>
                                        <th>
                                            <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button>
                                        </th>
                                     </tr>
                           `
                        }).join('');
                        $card.querySelector('.price').textContent = toCurrency(card.price);
                    } else {
                        $card.innerHTML = '<p>The card is empty</p>';
                    }
                })

        }
    })
}